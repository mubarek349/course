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
      where: { userId: studentId, courseId: courseId, status: "paid" },
    });

    if (!order) {
      return null;
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
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

    if (!course) return null;

    const fuad = {
      ...course,
      activity: course.activity.map((act) => ({
        ...act,
        hasQuiz: Array.isArray(act.question)
          ? act.question.length > 0
          : !!act.question,
      })),
    } as any;

    // Identify the final exam as the last activity that has a quiz
    const examAct =
      [...fuad.activity].reverse().find((a: any) => a.hasQuiz) || null;

    return {
      ...fuad,
      finalExam: examAct
        ? {
            activityId: examAct.id,
            titleEn: "Final Exam",
            titleAm: "መጨረሻ ፈተና",
          }
        : null,
    } as any;
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

export async function getFinalExamStatus(courseId: string) {
  try {
    const user = await auth();
    const userId = user?.user?.id;
    if (!userId) return "error" as const;

    // Get all final exam questions for this course
    const questions = await prisma.question.findMany({
      where: { courseId },
      select: { id: true },
    });

    const total = questions.length;
    if (total === 0) return "no-quiz" as const;

    const answered = await prisma.studentQuiz.groupBy({
      by: ["questionId"],
      where: { 
        userId, 
        questionId: { in: questions.map((q) => q.id) },
        isFinalExam: true 
      },
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
        answerExplanation: true,
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

    // Get all final exam questions for this course with their correct answer id
    const questions = await prisma.question.findMany({
      where: { courseId },
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

    // Get student's latest answers for each question (final exam only)
    const answers = await prisma.studentQuizAnswer.findMany({
      where: {
        studentQuiz: {
          userId,
          questionId: { in: questions.map((q) => q.id) },
          isFinalExam: true,
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

/* Duplicate unlockTheFinalExamAndQuiz removed to avoid redeclaration error. The canonical implementation appears earlier in this file and returns:
{
  status: true,
  activities: activityRows,
  finalExamLocked,
  nextUnlockActivityId
}
*/
