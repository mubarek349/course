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
          where: { userId },
          select: { studentQuizAnswers: true },
        },
      },
    });
    console.log(finalExams);
    return finalExams;
  } catch (error) {
    console.error("Error fetching final exams:", error);
    return [];
  }
}

export async function getFinalExamStatus2(courseId: string) {
  try {
    const user = await auth();
    const userId = user?.user?.id;
    if (!userId) return "error" as const;

    const totalQuestions = await prisma.question.count({
      where: { courseId: courseId },
    });
    if (totalQuestions === 0) return "no-quiz" as const;

    const answeredQuestions = await prisma.studentQuiz.groupBy({
      by: ["questionId"],
      where: { userId, question: { courseId: courseId } },
      _count: { questionId: true },
    });
    const uniqueAnswered = answeredQuestions.length;

    if (uniqueAnswered === 0) return "not-done" as const;
    if (uniqueAnswered >= totalQuestions) return "done" as const;
    return "partial" as const;
  } catch (error) {
    console.error("Error fetching final exam status:", error);
    return "error" as const;
  }
}
