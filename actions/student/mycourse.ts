"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { StateType, TStudent, TTableData } from "@/lib/definations";
import bcryptjs from "bcryptjs";
import { Selection } from "@heroui/react";
import { $Enums } from "@prisma/client";

export async function getAllMyCourses(studentId: string) {
  // get the student id from the session or request context

  try {
    const paidOrders = await prisma.order.findMany({
      where: { userId: studentId, status: "paid" },
      select: { courseId: true },
    });

    const courseIds = paidOrders.map((order) => order.courseId);

    if (courseIds.length === 0) {
      return [];
    }

    const data = await prisma.course
      .findMany({
        where: {
          id: {
            in: courseIds,
          },
        },
        include: {
          activity: { select: { _count: { select: { subActivity: true } } } },
          instructor: {
            select: { id: true, firstName: true, fatherName: true },
          },
        },
      })
      .then((res) =>
        res.map(
          ({
            id,
            price,
            instructorRate,
            sellerRate,
            affiliateRate,
            activity,
            ...rest
          }) => ({
            id,
            ...rest,
            price: Number(price),
            instructorRate: Number(instructorRate),
            sellerRate: Number(sellerRate),
            affiliateRate: Number(affiliateRate),
            _count: {
              activity: activity.reduce((a, c) => a + c._count.subActivity, 0),
            },
          })
        )
      );
    return data;
  } catch (error) {
    console.error("Error fetching my courses:", error);
    return [];
  }
}

export async function getMySingleCourse(studentId: string, courseId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        userId: studentId,
        courseId: courseId,
        status: "paid",
      },
    });

    if (!order) {
      // If no paid order is found, the user doesn't have access.
      return null;
    }

    // If the user has paid, fetch the course details.
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        titleEn: true,
        titleAm: true,
        aboutEn: true,
        aboutAm: true,
        requirement: true,
        courseFor: true,
        video: true,
        price: true,
        thumbnail: true,
        level: true,
        language: true,
        certificate: true,
        instructor: {
          select: {
            firstName: true,
            fatherName: true,
          },
        },
        activity: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            titleEn: true,
            titleAm: true,
            order: true,
            question: {
              select: { question: true, questionOptions: true },
            },
            subActivity: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                titleEn: true,
                titleAm: true,
                video: true,
                order: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return null;
    }

    // Convert Decimal fields to numbers
    return {
      ...course,
      price: Number(course.price),
    };
  } catch (error) {
    console.error("Error fetching single course:", error);
    return null;
  }
}

export async function getMySingleCourseContent(
  studentId: string,
  courseId: string
) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        userId: studentId,
        courseId: courseId,
        status: "paid",
      },
    });

    if (!order) {
      // If no paid order is found, the user doesn't have access.
      return null;
    }

    // If the user has paid, fetch the course details.
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        titleEn: true,
        titleAm: true,
        video: true,
        requirement: true,
        courseFor: true,
        aboutEn: true,
        aboutAm: true,
        level: true,
        activity: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            titleEn: true,
            titleAm: true,
            order: true,
            question: {
              select: { question: true, questionOptions: true },
              take: 1,
            },
            subActivity: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                titleEn: true,
                titleAm: true,
                video: true,
                order: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return null;
    }

    // Convert Decimal fields to numbers
    const fuad = {
      ...course,
      activity: course.activity.map((act) => ({
        ...act,
        hasQuiz: Array.isArray(act.question)
          ? act.question.length > 0
          : !!act.question,
      })),
    };
    console.log(fuad);
    return fuad;
  } catch (error) {
    console.error("Error fetching single course:", error);
    return null;
  }
}

export async function getActivityQuiz(activityId: string) {
  try {
    const user = await auth();
    const userId = user?.user?.id || undefined;

    const questions = await prisma.question.findMany({
      where: { activityId },
      select: {
        id: true,
        question: true,
        questionOptions: true,
        questionAnswer: true,
        answerExplanation: true,
      },
    });

    if (!questions.length) return null;

    let byQuestionId: Record<string, string | undefined> = {};
    if (userId) {
      const prevAnswers = await prisma.studentQuizAnswer.findMany({
        where: {
          studentQuiz: {
            userId,
            questionId: { in: questions.map((q) => q.id) },
          },
        },
        select: {
          selectedOptionId: true,
          studentQuiz: { select: { questionId: true, id: true } },
        },
        orderBy: { id: "desc" },
      });

      for (const ans of prevAnswers) {
        const qid = ans.studentQuiz.questionId;
        if (byQuestionId[qid]) continue; // keep latest due to desc order
        byQuestionId[qid] = ans.selectedOptionId;
      }
    }

    return questions.map((q) => ({
      ...q,
      studentSelectedOptionId: byQuestionId[q.id],
    }));
  } catch (error) {
    console.error("Error fetching activity quiz:", error);
    return null;
  }
}

// Check if the activity quiz is done, partially done, or not started for this logged-in student
export async function getActivityQuizStatus(activityId: string) {
  try {
    const user = await auth();
    const userId = user?.user?.id;
    if (!userId) return "error" as const;

    const questions = await prisma.question.findMany({
      where: { activityId },
      select: { id: true },
    });
    const total = questions.length;
    if (total === 0) return "no-quiz" as const;

    const answered = await prisma.studentQuiz.groupBy({
      by: ["questionId"],
      where: { userId, questionId: { in: questions.map((q) => q.id) } },
      _count: { questionId: true },
    });
    const uniqueAnswered = answered.length;

    if (uniqueAnswered === 0) return "not-done" as const;
    if (uniqueAnswered >= total) return "done" as const;
    return "partial" as const;
  } catch (error) {
    console.error("Error fetching quiz status:", error);
    return "error" as const;
  }
}

export async function saveStudentQuizAnswers(
  prevState: StateType,
  data: { questionId: string; selectedOptionId: string } | undefined
): Promise<StateType> {
  try {
    // get user id from the session
    const user = await auth();
    if (!user) {
      return {
        status: false,
        cause: "unauthenticated",
        message: "Unauthenticated",
      } as StateType;
    }
    const userId = user.user?.id!;

    // Destructure questionId and selectedOptionId from data
    if (!data) {
      return {
        status: false,
        cause: "invalid_data",
        message: "No data provided",
      } as StateType;
    }
    const { questionId, selectedOptionId } = data;

    const result = await prisma.$transaction(async (tx) => {
      // Ensure the selected option belongs to the question
      const option = await tx.questionOption.findFirst({
        where: { id: selectedOptionId, questionId },
        select: { id: true },
      });
      if (!option) {
        throw new Error("invalid_option");
      }

      const studentQuiz = await tx.studentQuiz.create({
        data: {
          userId,
          questionId,
        },
      });

      const studentQuizAnswer = await tx.studentQuizAnswer.create({
        data: {
          studentQuizId: studentQuiz.id,
          selectedOptionId,
        },
      });

      return { studentQuiz, studentQuizAnswer };
    });
  } catch (error) {
    console.error("Error saving student quiz answers", error);
    // return null;
  }
}

export async function getFinalExam(courseId: string) {
  try {
    const user = await auth();
    const userId = user?.user?.id || undefined;

    // Find the last activity with questions in this course (treated as Final Exam)
    const examActivity = await prisma.activity.findFirst({
      where: { courseId, question: { some: {} } },
      orderBy: { order: "desc" },
      select: { id: true },
    });

    if (!examActivity) return null;

    const questions = await prisma.question.findMany({
      where: { activityId: examActivity.id },
      select: {
        id: true,
        question: true,
        questionOptions: true,
        questionAnswer: true,
        answerExplanation: true,
      },
    });

    if (!questions.length) return null;

    let byQuestionId: Record<string, string | undefined> = {};
    if (userId) {
      const prevAnswers = await prisma.studentQuizAnswer.findMany({
        where: {
          studentQuiz: {
            userId,
            questionId: { in: questions.map((q) => q.id) },
          },
        },
        select: {
          selectedOptionId: true,
          studentQuiz: { select: { questionId: true, id: true } },
        },
        orderBy: { id: "desc" },
      });

      for (const ans of prevAnswers) {
        const qid = ans.studentQuiz.questionId;
        if (byQuestionId[qid]) continue;
        byQuestionId[qid] = ans.selectedOptionId;
      }
    }

    return questions.map((q) => ({
      ...q,
      studentSelectedOptionId: byQuestionId[q.id],
    }));
  } catch (error) {
    console.error("Error fetching final exam:", error);
    return null;
  }
}

export async function getFinalExamStatus(courseId: string) {
  try {
    const user = await auth();
    const userId = user?.user?.id;
    if (!userId) return "error" as const;

    const examActivity = await prisma.activity.findFirst({
      where: { courseId, question: { some: {} } },
      orderBy: { order: "desc" },
      select: { id: true },
    });

    if (!examActivity) return "no-quiz" as const;

    const questions = await prisma.question.findMany({
      where: { activityId: examActivity.id },
      select: { id: true },
    });

    const total = questions.length;
    if (total === 0) return "no-quiz" as const;

    const answered = await prisma.studentQuiz.groupBy({
      by: ["questionId"],
      where: { userId, questionId: { in: questions.map((q) => q.id) } },
      _count: { questionId: true },
    });
    const uniqueAnswered = answered.length;

    if (uniqueAnswered === 0) return "not-done" as const;
    if (uniqueAnswered >= total) return "done" as const;
    return "partial" as const;
  } catch (error) {
    console.error("Error fetching final exam status:", error);
    return "error" as const;
  }
}

export async function getFinalExams(courseId: string) {
  try {
    const user = await auth();
    const userId = user?.user?.id;
    if (!userId) return [];

    const finalExams = await prisma.question.findMany({
      where: { courseId: courseId },
      select: {
        id: true,
        question: true,
        questionOptions: true,
        questionAnswer: true,
        studentQuiz: {
          where: { userId, isFinalExam: true },
          select: {
            id: true,
            studentQuizAnswers: {
              select: { selectedOptionId: true },
              orderBy: { id: "desc" },
              // take: 1,
            },
          },
        },
      },
    });

    // Map latest selected option per question
    return finalExams.map((q) => ({
      ...q,
      studentSelectedOptionId:
        q.studentQuiz[0]?.studentQuizAnswers[0]?.selectedOptionId,
    }));
  } catch (error) {
    console.error("Error fetching final exams:", error);
    return [];
  }
}

export async function submitFinalExamAnswers(
  prevState: StateType,
  data: { questionId: string; selectedOptionId: string } | undefined
): Promise<StateType> {
  try {
    const user = await auth();
    if (!user) {
      return {
        status: false,
        cause: "unauthenticated",
        message: "Unauthenticated",
      } as StateType;
    }
    const userId = user.user?.id!;

    if (!data) {
      return {
        status: false,
        cause: "invalid_data",
        message: "No data provided",
      } as StateType;
    }
    const { questionId, selectedOptionId } = data;

    const result = await prisma.$transaction(async (tx) => {
      const option = await tx.questionOption.findFirst({
        where: { id: selectedOptionId, questionId },
        select: { id: true },
      });
      if (!option) throw new Error("invalid_option");

      const studentQuiz = await tx.studentQuiz.create({
        data: { userId, questionId, isFinalExam: true },
      });

      const studentQuizAnswer = await tx.studentQuizAnswer.create({
        data: { studentQuizId: studentQuiz.id, selectedOptionId },
      });

      return { studentQuiz, studentQuizAnswer };
    });

    return { status: true } as StateType;
  } catch (error: any) {
    const cause =
      error?.message === "invalid_option" ? "invalid_option" : "server_error";
    return {
      status: false,
      cause,
      message: "Failed to save answer",
    } as StateType;
  }
}

export async function readyToCertification(courseId: string) {
  try {
    const user = await auth();
    if (!user) {
      return {
        status: false,
        cause: "unauthenticated",
        message: "Unauthenticated",
      } as StateType;
    }
    const userId = user.user?.id!;

    // Find the final exam activity (last activity with questions)
    const examActivity = await prisma.activity.findFirst({
      where: { courseId, question: { some: {} } },
      orderBy: { order: "desc" },
      select: { id: true },
    });

    if (!examActivity) {
      return {
        status: false,
        result: "nottaken",
        message: "Final exam not found",
      } as any;
    }

    // Get all questions for the final exam with their correct answer id
    const questions = await prisma.question.findMany({
      where: { activityId: examActivity.id },
      select: { id: true, questionAnswer: { select: { answerId: true } } },
    });

    const total = questions.length;
    if (total === 0) {
      return {
        status: false,
        result: "nottaken",
        message: "No questions in final exam",
      } as any;
    }

    // Get student's latest answers for each question
    const answers = await prisma.studentQuizAnswer.findMany({
      where: {
        studentQuiz: {
          userId,
          questionId: { in: questions.map((q) => q.id) },
        },
      },
      select: {
        selectedOptionId: true,
        studentQuiz: { select: { questionId: true } },
      },
      orderBy: { id: "desc" },
    });

    // Map latest answer per question
    const latestAnswers: Record<string, string> = {};
    for (const ans of answers) {
      const qid = ans.studentQuiz.questionId;
      if (!latestAnswers[qid]) latestAnswers[qid] = ans.selectedOptionId;
    }

    // If student hasn't answered any, return nottaken
    if (Object.keys(latestAnswers).length === 0) {
      return {
        status: false,
        result: "nottaken",
        message: "Student has not taken the final exam",
      } as any;
    }

    // Build correct answer map
    const correctByQid: Record<string, string | undefined> = {};
    for (const q of questions as any[]) {
      const qa = q.questionAnswer as any;
      const correctId = Array.isArray(qa) ? qa[0]?.answerId : qa?.answerId;
      correctByQid[q.id] = correctId;
    }

    // Calculate correct answers
    let correct = 0;
    for (const q of questions) {
      const correctId = correctByQid[q.id];
      if (correctId && latestAnswers[q.id] === correctId) correct++;
    }

    const percent = (correct / total) * 100;

    let result: "poor" | "good" | "veryGood" | "excellent";
    if (percent < 50) result = "poor";
    else if (percent < 70) result = "good";
    else if (percent < 85) result = "veryGood";
    else result = "excellent";

    // Everyone who has taken the exam can get a certificate
    return {
      status: true,
      result,
      percent,
      progress: percent,
      correct,
      total,
      canGetCertificate: true,
      message: "Eligible for certificate",
    } as any;
  } catch (error) {
    return {
      status: false,
      result: "error",
      message: "Server error",
    } as any;
  }
}

export async function unlockTheFinalExamAndQuiz(courseId: string) {
  try {
    const user = await auth();
    if (!user) {
      return {
        status: false,
        cause: "unauthenticated",
        message: "Unauthenticated",
      } as any;
    }
    const userId = user.user?.id!;

    // Fetch course activities with their questions
    const activities = await prisma.activity.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        order: true,
        titleEn: true,
        titleAm: true,
        question: { select: { id: true } },
      },
    });

    if (!activities.length) {
      return { status: true, activities: [], finalExamLocked: false } as any;
    }

    const allQuestionIds = activities.flatMap((a) =>
      a.question.map((q) => q.id)
    );

    // If no quiz questions at all, nothing to lock
    if (allQuestionIds.length === 0) {
      return {
        status: true,
        activities: activities.map((a) => ({
          activityId: a.id,
          order: a.order,
          titleEn: a.titleEn,
          titleAm: a.titleAm,
          totalQuestions: 0,
          answeredQuestions: 0,
          quizStatus: "no-quiz" as const,
          locked: false,
        })),
        finalExamLocked: false,
      } as any;
    }

    // Fetch unique answered questions for this user across these activities
    const answered = await prisma.studentQuiz.groupBy({
      by: ["questionId"],
      where: { userId, questionId: { in: allQuestionIds } },
      _count: { questionId: true },
    });
    const answeredSet = new Set(answered.map((a) => a.questionId));

    // Build activity quiz statuses
    const activityRows = activities.map((a) => {
      const qids = a.question.map((q) => q.id);
      const total = qids.length;
      const answeredCount = qids.reduce(
        (acc, id) => acc + (answeredSet.has(id) ? 1 : 0),
        0
      );
      let quizStatus: "done" | "partial" | "not-done" | "no-quiz";
      if (total === 0) quizStatus = "no-quiz";
      else if (answeredCount === 0) quizStatus = "not-done";
      else if (answeredCount >= total) quizStatus = "done";
      else quizStatus = "partial";
      return {
        activityId: a.id,
        order: a.order,
        titleEn: a.titleEn,
        titleAm: a.titleAm,
        totalQuestions: total,
        answeredQuestions: answeredCount,
        quizStatus,
        locked: false, // fill later
      };
    });

    // Apply sequential locking among quiz-bearing activities
    let lockNext = false;
    for (const row of activityRows) {
      if (row.totalQuestions === 0) {
        row.locked = false; // no quiz to lock
        continue;
      }
      if (lockNext) {
        row.locked = true;
      } else {
        row.locked = false;
      }
      if (row.quizStatus !== "done") {
        lockNext = true; // all subsequent quiz activities are locked
      }
    }

    const finalExamLocked = activityRows
      .filter((r) => r.totalQuestions > 0)
      .some((r) => r.quizStatus !== "done");

    // Determine next activity to unlock (first locked quiz activity)
    const nextLocked = activityRows.find(
      (r) => r.locked && r.totalQuestions > 0
    );

    return {
      status: true,
      activities: activityRows,
      finalExamLocked,
      nextUnlockActivityId: nextLocked?.activityId ?? null,
    } as any;
  } catch (error) {
    console.error("Error computing locks:", error);
    return { status: false, message: "Server error" } as any;
  }
}

export async function getCertificateDetails(courseId: string) {
  try {
    const user = await auth();
    if (!user) {
      return {
        status: false,
        cause: "unauthenticated",
        message: "Unauthenticated",
      } as any;
    }
    const userId = user.user?.id!;

    // Fetch course basic info
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        titleEn: true,
        titleAm: true,
        instructor: { select: { firstName: true, fatherName: true } },
      },
    });

    // Fetch student info (best-effort across possible fields)
    let studentName = user.user?.name || "";
    try {
      const dbUser: any = await (prisma as any).user?.findUnique?.({
        where: { id: userId },
        select: {
          firstName: true,
          fatherName: true,
          lastName: true,
          name: true,
          email: true,
        },
      });
      if (dbUser) {
        const parts = [
          dbUser.firstName,
          dbUser.fatherName,
          dbUser.lastName,
        ].filter(Boolean);
        studentName =
          parts.join(" ") || dbUser.name || dbUser.email || studentName;
      }
    } catch {}

    const cert = await readyToCertification(courseId as string);
    const courseTitle = course?.titleEn || course?.titleAm || "Course";
    const instructorName = course?.instructor
      ? [course.instructor.firstName, course.instructor.fatherName]
          .filter(Boolean)
          .join(" ")
      : undefined;

    return {
      status: true,
      studentName,
      courseTitle,
      instructorName,
      issuedAt: new Date().toISOString(),
      ...cert,
    } as any;
  } catch (err) {
    return { status: false, message: "Server error" } as any;
  }
}
