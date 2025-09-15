"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Submit a video question by a student
export async function submitVideoQuestion(
  subActivityId: string,
  question: string,
  timestamp?: number
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const studentId = session.user.id;

    // Verify the student has access to this subactivity
    const subActivity = await prisma.subActivity.findUnique({
      where: { id: subActivityId },
      include: {
        activity: {
          include: {
            course: {
              include: {
                order: {
                  where: {
                    userId: studentId,
                    status: "paid",
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!subActivity || subActivity.activity.course.order.length === 0) {
      throw new Error("Access denied to this video");
    }

    const videoQuestion = await prisma.videoQuestion.create({
      data: {
        studentId,
        subActivityId,
        question,
        timestamp,
      },
      include: {
        student: {
          select: {
            firstName: true,
            fatherName: true,
            lastName: true,
          },
        },
        subActivity: {
          select: {
            titleEn: true,
            titleAm: true,
          },
        },
      },
    });

    revalidatePath("/");
    return { success: true, data: videoQuestion };
  } catch (error) {
    console.error("Error submitting video question:", error);
    return { success: false, error: "Failed to submit question" };
  }
}

// Get video questions for a specific subactivity
export async function getVideoQuestions(subActivityId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    // Verify user has access to this subactivity
    const subActivity = await prisma.subActivity.findUnique({
      where: { id: subActivityId },
      include: {
        activity: {
          include: {
            course: {
              include: {
                order: {
                  where: {
                    userId,
                    status: "paid",
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!subActivity || subActivity.activity.course.order.length === 0) {
      throw new Error("Access denied to this video");
    }

    const questions = await prisma.videoQuestion.findMany({
      where: { subActivityId },
      include: {
        student: {
          select: {
            firstName: true,
            fatherName: true,
            lastName: true,
          },
        },
        responses: {
          include: {
            instructor: {
              select: {
                firstName: true,
                fatherName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: questions };
  } catch (error) {
    console.error("Error fetching video questions:", error);
    return { success: false, error: "Failed to fetch questions" };
  }
}

// Delete a video question (only by the student who asked it)
export async function deleteVideoQuestion(questionId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const studentId = session.user.id;

    // Verify the question belongs to the current user
    const question = await prisma.videoQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question || question.studentId !== studentId) {
      throw new Error("Access denied");
    }

    await prisma.videoQuestion.delete({
      where: { id: questionId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting video question:", error);
    return { success: false, error: "Failed to delete question" };
  }
}