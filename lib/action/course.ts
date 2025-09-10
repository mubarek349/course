"use server";

import prisma from "../db";
import { StateType, TAffiliateSelf, TCourse } from "../definations";
import bcryptjs from "bcryptjs";

export async function courseRegistration(
  prevState: StateType,
  data: TCourse | undefined
): Promise<StateType> {
  try {
    if (!data) return undefined;
    const {
      id,
      courseFor,
      requirement,
      activity,
      finalExamQuestions,
      ...rest
    } = data;

    await prisma.course.updateMany({
      where: { channelId: rest.channelId },
      data: { channelId: null },
    });
    // .then((res) => {
    //   console.log(res.count);
    // });

    if (id) {
      await prisma.courseFor.deleteMany({ where: { courseId: id } });
      await prisma.requirement.deleteMany({ where: { courseId: id } });

      // Delete questions and related data first
      const activities = await prisma.activity.findMany({
        where: { courseId: id },
      });
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

      const updatedCourse = await prisma.course.update({
        where: { id },
        data: {
          ...rest,
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
      const courseId = await prisma.course
        .create({ data: rest })
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

    return { status: true } as const;
  } catch (error) {
    console.log(error);
    return { status: false, cause: "", message: "" } as const;
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
): Promise<StateType> {
  try {
    if (!data) throw new Error();
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
    console.log(error);
    return { status: false, cause: "", message: "" };
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
): Promise<StateType> {
  try {
    if (!data) throw new Error();
    const { id, firstName, fatherName, lastName, phoneNumber, password } = data;
    if (id) {
      await prisma.user.update({
        where: { id },
        data: {
          firstName,
          fatherName,
          lastName,
          phoneNumber,
          ...(password ? { password: await bcryptjs.hash(password, 12) } : {}),
        },
      });
      return { status: true };
    } else {
      await prisma.user.create({
        data: {
          role: "seller",
          firstName,
          fatherName,
          lastName,
          phoneNumber,
          password: await bcryptjs.hash(password || firstName, 12),
        },
      });
      return { status: true };
    }
  } catch (error) {
    console.log(error);
    return { status: false, cause: "", message: "" };
  }
}

export async function removeSeller(
  prevState: StateType,
  id: string | undefined
): Promise<StateType> {
  try {
    if (!id) throw new Error();
    await prisma.user.delete({ where: { id } });
    return { status: true };
  } catch (error) {
    console.log(error);
    return { status: false, cause: "", message: "" };
  }
}

export async function affiliateRegistration(
  prevState: StateType,
  data: TAffiliateSelf | undefined
): Promise<StateType> {
  try {
    if (!data) throw new Error();
    const { code, password, phoneNumber, ...rest } = data;
    const oldOtp = await prisma.otp.findFirst({ where: { phoneNumber } });
    if (`${oldOtp?.code}` !== code) throw new Error();
    await prisma.user.create({
      data: {
        ...rest,
        role: "affiliate",
        phoneNumber,
        age: Number(rest.age),
        password: await bcryptjs.hash(password, 12),
        status: "pending",
      },
    });
    return { status: true };
  } catch (error) {
    console.log("ERROR >> ", error);
    return { status: false, cause: "", message: "" };
  }
}
