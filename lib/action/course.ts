/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "../db";
import { StateType, TCourse } from "../definations";
import bcryptjs from "bcryptjs";

export async function courseRegistration(
  prevState: StateType,
  data: TCourse | undefined | null
): Promise<StateType> {
  try {
    console.log("🔧 Server action started", { 
      hasData: !!data, 
      isUpdate: !!(data?.id),
      dataKeys: data ? Object.keys(data) : []
    });

    if (!data || data === null) {
      console.log("❌ No data provided to courseRegistration");
      return {
        status: false,
        cause: "No data provided",
        message: "Course data is required",
      };
    }

    console.log("📋 Course registration data received:", {
      id: data.id,
      titleEn: data.titleEn,
      titleAm: data.titleAm,
      instructorId: data.instructorId,
      channelId: data.channelId,
      price: data.price,
      dolarPrice: data.dolarPrice,
      birrPrice: data.birrPrice,
      pdf: data.pdf,
      courseMaterialsCount: (data as any).courseMaterials?.length || 0,
      finalExamQuestionsCount: data.finalExamQuestions?.length || 0,
      activityCount: data.activity?.length || 0
    });

    // Validate required fields
    if (!data.titleEn || !data.titleAm) {
      return {
        status: false,
        cause: "Validation Error",
        message: "Course title is required",
      };
    }

    if (!data.instructorId || !data.channelId) {
      return {
        status: false,
        cause: "Validation Error",
        message: "Instructor and channel are required",
      };
    }

    if (!data.dolarPrice || !data.birrPrice) {
      return {
        status: false,
        cause: "Validation Error",
        message: "Dollar price and Birr price are required",
      };
    }

    const {
      id,
      courseFor,
      requirement,
      activity,
      finalExamQuestions,
      pdf, // Extract PDF field
      courseMaterials, // Optional client-provided materials
      birrPrice,
      dolarPrice,
      ...rest
    } = data;

    // Prepare courseMaterials for DB (comma-separated URLs only)
    const serializedMaterials: string | undefined = courseMaterials
      ? courseMaterials
          .filter((m) => m && m.url)
          .map((m) => m.url)
          .join(",")
      : undefined;

    // Add pdfData and optionally courseMaterials to the rest data (mapping pdf to pdfData)
    console.log("📄 Processing PDF data:", { pdf, pdfData: pdf || null });
    const courseData = {
      ...rest,
      pdfData: pdf || null, // Map pdf to pdfData for the database
      birrPrice,
      dolarPrice,
      ...(serializedMaterials ? { courseMaterials: serializedMaterials } : {}),
    } as const;

    await prisma.course.updateMany({
      where: { channelId: rest.channelId },
      data: { channelId: null },
    });
    // .then((res) => {
    //   console.log(res.count);
    // });

    if (id) {
      console.log("🔄 Starting course update process for ID:", id);
      
      await prisma.courseFor.deleteMany({ where: { courseId: id } });
      await prisma.requirement.deleteMany({ where: { courseId: id } });

      // Delete questions and related data first
      const activities = await prisma.activity.findMany({
        where: { courseId: id },
      });
      console.log("🗑️ Found activities to delete:", activities.length);
      
      for (const activity of activities) {
        await prisma.questionAnswer.deleteMany({
          where: { question: { activityId: activity.id } },
        });
        await prisma.questionOption.deleteMany({
          where: { question: { activityId: activity.id } },
        });
        await prisma.question.deleteMany({
          where: { activityId: activity.id },
        });
      }

      // Delete final exam questions (those with courseId but no activityId)
      await prisma.questionAnswer.deleteMany({
        where: { question: { courseId: id, activityId: null } },
      });
      await prisma.questionOption.deleteMany({
        where: { question: { courseId: id, activityId: null } },
      });
      await prisma.question.deleteMany({
        where: { courseId: id, activityId: null },
      });

      await prisma.activity.deleteMany({ where: { courseId: id } });

      // Extract relation fields from courseData
      const { instructorId, channelId, ...courseDataWithoutRelations } =
        courseData;

      console.log("💾 Updating course with data:", {
        instructorId,
        channelId,
        courseForCount: courseFor.length,
        requirementCount: requirement.length,
        activityCount: activity.length
      });

      const updatedCourse = await prisma.course.update({
        where: { id },
        data: {
          ...courseDataWithoutRelations, // Use courseData without relation fields (includes pdfData and courseMaterials)
          instructor: { connect: { id: instructorId } }, // Fix: Use relation syntax
          channel: { connect: { id: channelId } }, // Fix: Use relation syntax
          courseFor: { create: courseFor },
          requirement: { create: requirement },
          activity: {
            create: activity.map(
              ({ titleAm, titleEn, subActivity }, index) => ({
                titleAm,
                titleEn,
                order: index + 1,
                subActivity: {
                  create: subActivity.map((sub, subIndex) => ({
                    ...sub,
                    video: sub.video || "", // Ensure video is always a string
                    order: subIndex + 1,
                  })),
                },
              })
            ),
          },
        },
        include: { activity: { orderBy: { order: "asc" } } },
      });

      console.log("✅ Course updated successfully:", updatedCourse.id);

      // Create questions for each activity
      for (let i = 0; i < activity.length; i++) {
        const { questions } = activity[i];
        const createdActivity = updatedCourse.activity[i];

        if (questions && questions.length > 0) {
          for (let j = 0; j < questions.length; j++) {
            const { question, options, answers, explanation } = questions[j];

            // Always create activity questions - they serve as the master copy
            const createdQuestion = await prisma.question.create({
              data: {
                question,
                answerExplanation: explanation,
                activityId: createdActivity.id,
                questionOptions: {
                  create: options.map((option) => ({ option })),
                },
              },
            });

            const createdOptions = await prisma.questionOption.findMany({
              where: { questionId: createdQuestion.id },
            });

            for (const answer of answers) {
              const matchingOption = createdOptions.find(
                (opt) => opt.option === answer
              );
              if (matchingOption) {
                await prisma.questionAnswer.create({
                  data: {
                    questionId: createdQuestion.id,
                    answerId: matchingOption.id,
                  },
                });
              }
            }
          }
        }
      }

      // Create final exam questions and update shared questions
      if (finalExamQuestions && finalExamQuestions.length > 0) {
        for (const examQuestion of finalExamQuestions) {
          if (
            examQuestion.isSharedFromActivity &&
            examQuestion.sourceActivityIndex !== undefined &&
            examQuestion.sourceQuestionIndex !== undefined
          ) {
            // For shared questions: find the existing activity question and update it to include courseId
            const activityIndex = examQuestion.sourceActivityIndex;
            const questionIndex = examQuestion.sourceQuestionIndex;

            if (activityIndex < updatedCourse.activity.length) {
              const targetActivity = updatedCourse.activity[activityIndex];

              // Find the corresponding question in the database
              const existingQuestions = await prisma.question.findMany({
                where: { activityId: targetActivity.id },
                orderBy: { id: "asc" },
              });

              if (questionIndex < existingQuestions.length) {
                const targetQuestion = existingQuestions[questionIndex];

                // Update the question to also be part of the final exam
                await prisma.question.update({
                  where: { id: targetQuestion.id },
                  data: { courseId: id }, // Add courseId to mark it as final exam question
                });
              }
            }
          } else {
            // Only create standalone final exam questions (not tied to activities)
            const createdQuestion = await prisma.question.create({
              data: {
                question: examQuestion.question,
                answerExplanation: examQuestion.explanation,
                courseId: id,
                // Note: activityId is intentionally left null for standalone final exam questions
                questionOptions: {
                  create: examQuestion.options.map((option) => ({ option })),
                },
              },
            });

            const createdOptions = await prisma.questionOption.findMany({
              where: { questionId: createdQuestion.id },
            });

            for (const answer of examQuestion.answers) {
              const matchingOption = createdOptions.find(
                (opt) => opt.option === answer
              );
              if (matchingOption) {
                await prisma.questionAnswer.create({
                  data: {
                    questionId: createdQuestion.id,
                    answerId: matchingOption.id,
                  },
                });
              }
            }
          }
        }
      }
    } else {
      const {
        instructorId: createInstructorId,
        channelId: createChannelId,
        ...restWithoutRelations
      } = rest as unknown as { [k: string]: unknown };
      const courseId = await prisma.course
        .create({
          data: {
            ...restWithoutRelations,
            pdfData: pdf || null,
            // For create, courseMaterials is a scalar field and accepts string[] directly
            ...(serializedMaterials
              ? { courseMaterials: serializedMaterials }
              : {}),
            instructor: { connect: { id: createInstructorId as string } },
            channel: { connect: { id: createChannelId as string } },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        })
        .then((v) => v.id);
      if (courseId) {
        for (const v of courseFor) {
          await prisma.courseFor.create({ data: { ...v, courseId } });
        }
        for (const v of requirement) {
          await prisma.requirement.create({ data: { ...v, courseId } });
        }
        for (let i = 0; i < activity.length; i++) {
          const { subActivity, questions, ...v } = activity[i];
          const createdActivity = await prisma.activity.create({
            data: {
              ...v,
              courseId,
              order: i + 1,
              subActivity: {
                create: subActivity.map((sub, subIndex) => ({
                  ...sub,
                  video: sub.video || "", // Ensure video is always a string
                  order: subIndex + 1,
                })),
              },
            },
          });

          if (questions && questions.length > 0) {
            for (let j = 0; j < questions.length; j++) {
              const { question, options, answers, explanation } = questions[j];

              // Always create activity questions - they serve as the master copy
              const createdQuestion = await prisma.question.create({
                data: {
                  question,
                  answerExplanation: explanation,
                  activityId: createdActivity.id,
                  questionOptions: {
                    create: options.map((option) => ({ option })),
                  },
                },
              });

              const createdOptions = await prisma.questionOption.findMany({
                where: { questionId: createdQuestion.id },
              });

              for (const answer of answers) {
                const matchingOption = createdOptions.find(
                  (opt) => opt.option === answer
                );
                if (matchingOption) {
                  await prisma.questionAnswer.create({
                    data: {
                      questionId: createdQuestion.id,
                      answerId: matchingOption.id,
                    },
                  });
                }
              }
            }
          }
        }

        // Create final exam questions and update shared questions
        if (finalExamQuestions && finalExamQuestions.length > 0) {
          for (const examQuestion of finalExamQuestions) {
            if (
              examQuestion.isSharedFromActivity &&
              examQuestion.sourceActivityIndex !== undefined &&
              examQuestion.sourceQuestionIndex !== undefined
            ) {
              // For shared questions: find the existing activity question and update it to include courseId
              const activityIndex = examQuestion.sourceActivityIndex;
              const questionIndex = examQuestion.sourceQuestionIndex;

              // Find the activity that was just created
              const activities = await prisma.activity.findMany({
                where: { courseId },
                orderBy: { order: "asc" },
              });

              if (activityIndex < activities.length) {
                const targetActivity = activities[activityIndex];

                // Find the corresponding question in the database
                const existingQuestions = await prisma.question.findMany({
                  where: { activityId: targetActivity.id },
                  orderBy: { id: "asc" },
                });

                if (questionIndex < existingQuestions.length) {
                  const targetQuestion = existingQuestions[questionIndex];

                  // Update the question to also be part of the final exam
                  await prisma.question.update({
                    where: { id: targetQuestion.id },
                    data: { courseId }, // Add courseId to mark it as final exam question
                  });
                }
              }
            } else {
              // Only create standalone final exam questions (not tied to activities)
              const createdQuestion = await prisma.question.create({
                data: {
                  question: examQuestion.question,
                  answerExplanation: examQuestion.explanation,
                  courseId,
                  // Note: activityId is intentionally left null for standalone final exam questions
                  questionOptions: {
                    create: examQuestion.options.map((option) => ({ option })),
                  },
                },
              });

              const createdOptions = await prisma.questionOption.findMany({
                where: { questionId: createdQuestion.id },
              });

              for (const answer of examQuestion.answers) {
                const matchingOption = createdOptions.find(
                  (opt) => opt.option === answer
                );
                if (matchingOption) {
                  await prisma.questionAnswer.create({
                    data: {
                      questionId: createdQuestion.id,
                      answerId: matchingOption.id,
                    },
                  });
                }
              }
            }
          }
        }
      }
    }

    console.log("🎉 Course registration completed successfully");
    return { status: true } as const;
  } catch (error) {
    console.error("💥 Course registration error:", error);
    return {
      status: false,
      cause: "Unknown Error",
      message: "An unexpected error occurred while processing the course",
    };
  }
}

export async function changeRate(
  prevState: StateType,
  data:
    | {
        userId: string;
        courseId: string;
        rate: number;
      }
    | undefined
    | null
): Promise<StateType> {
  try {
    if (!data || data === null) {
      console.log("No data provided to changeRate");
      return {
        status: false,
        cause: "No data provided",
        message: "Rate data is required",
      };
    }
    const { userId, courseId, rate } = data,
      incomeRate = await prisma.incomeRate.findFirst({
        where: { userId, courseId },
      });
    if (incomeRate) {
      await prisma.incomeRate.update({
        where: { id: incomeRate.id },
        data: { rate },
      });
    } else {
      await prisma.incomeRate.create({ data: { userId, courseId, rate } });
    }
    return { status: true };
  } catch (error) {
    console.error("Change rate error:", error);

    // Handle different types of errors
    if (error instanceof Error) {
      return {
        status: false,
        cause: error.name,
        message: error.message,
      };
    }

    // Handle Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      return {
        status: false,
        cause: "Database Error",
        message: `Database operation failed: ${
          (error as any).code || "Unknown error"
        }`,
      };
    }

    // Fallback for unknown errors
    return {
      status: false,
      cause: "Unknown Error",
      message: "An unexpected error occurred while updating the rate",
    };
  }
}

export async function sellerRegistration(
  prevState: StateType,
  data:
    | {
        id?: string;
        firstName: string;
        fatherName: string;
        lastName: string;
        phoneNumber: string;
        password?: string;
      }
    | undefined
    | null
): Promise<StateType> {
  try {
    if (!data || data === null) {
      console.log("No data provided to sellerRegistration");
      return {
        status: false,
        cause: "No data provided",
        message: "Seller data is required",
      };
    }
    const { id, firstName, fatherName, lastName, phoneNumber, password } = data;
    if (id) {
      await prisma.user.update({
        where: { id },
        data: {
          firstName,
          fatherName,
          lastName,
          phoneNumber,
          ...(password && password !== ""
            ? { password: await bcryptjs.hash(password, 12) }
            : {}),
        },
      });
    } else {
      if (!password) throw new Error("Password is required for new sellers");
      const { firstName, fatherName, lastName, phoneNumber } = data;
      await prisma.user.create({
        data: {
          firstName,
          fatherName,
          lastName,
          phoneNumber,
          password: await bcryptjs.hash(password, 12),
          role: "seller",
        },
      });
    }
    return { status: true };
  } catch (error) {
    console.log(error);
    return { status: false, cause: "", message: "" };
  }
}

export async function affiliateRegistration(
  prevState: StateType,
  data:
    | {
        firstName: string;
        fatherName: string;
        lastName: string;
        phoneNumber: string;
        password: string;
      }
    | undefined
    | null
): Promise<StateType> {
  try {
    if (!data || data === null) {
      console.log("No data provided to affiliateRegistration");
      return {
        status: false,
        cause: "No data provided",
        message: "Affiliate data is required",
      };
    }
    const { firstName, fatherName, lastName, phoneNumber, password } = data;
    await prisma.user.create({
      data: {
        firstName,
        fatherName,
        lastName,
        phoneNumber,
        password: await bcryptjs.hash(password, 12),
        role: "affiliate",
      },
    });
    return { status: true };
  } catch (error) {
    console.log(error);
    return { status: false, cause: "", message: "" };
  }
}
