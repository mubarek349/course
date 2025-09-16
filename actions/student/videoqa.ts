"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Submit a video question by a student - supports both course and activity context
export async function submitVideoQuestion(
  courseId: string,
  question: string,
  timestamp?: number,
  subActivityId?: string // Optional for sub-activity videos
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const studentId = session.user.id;

    // Verify the student has access to this course
    const order = await prisma.order.findFirst({
      where: {
        userId: studentId,
        courseId: courseId,
        status: "paid",
      },
    });

    if (!order) {
      throw new Error("Access denied to this course");
    }

    // If subActivityId is provided, verify it belongs to the course
    if (subActivityId) {
      const subActivity = await prisma.subActivity.findUnique({
        where: { id: subActivityId },
        include: {
          activity: {
            select: { courseId: true },
          },
        },
      });

      if (!subActivity || subActivity.activity.courseId !== courseId) {
        throw new Error("Sub-activity does not belong to this course");
      }
    }

    const videoQuestion = await prisma.videoQuestion.create({
      data: {
        studentId,
        courseId,
        subActivityId: subActivityId || null,
        question,
        timestamp,
        type: subActivityId ? "activity" : "course", // Type indicates video context
      },
      include: {
        student: {
          select: {
            firstName: true,
            fatherName: true,
            lastName: true,
          },
        },
        course: {
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

// Get video questions for a specific course (all questions when subActivityId is not provided)
export async function getVideoQuestions(courseId: string, subActivityId?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    // Verify user has access to this course
    const order = await prisma.order.findFirst({
      where: {
        userId,
        courseId,
        status: "paid",
      },
    });

    if (!order) {
      throw new Error("Access denied to this course");
    }

    // Build where clause based on context
    const whereClause: any = {
      courseId,
    };

    // If subActivityId is provided, filter by it (for backwards compatibility)
    // If not provided, get ALL questions for the course (both introduction and activity videos)
    if (subActivityId) {
      whereClause.subActivityId = subActivityId;
      whereClause.type = "activity";
    }
    // Note: When subActivityId is not provided, we get ALL questions for the course
    // This includes both course introduction questions (type: "course") and activity questions (type: "activity")

    const questions = await prisma.videoQuestion.findMany({
      where: whereClause,
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
      select: { studentId: true },
    });

    if (!question || question.studentId !== studentId) {
      throw new Error("Access denied to this question");
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