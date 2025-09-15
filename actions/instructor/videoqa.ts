"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Submit a response to a video question by an instructor
export async function submitVideoResponse(
  videoQuestionId: string,
  response: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "instructor") {
      throw new Error("Unauthorized - Instructor access required");
    }

    const instructorId = session.user.id;

    // Verify the instructor has access to this course
    const videoQuestion = await prisma.videoQuestion.findUnique({
      where: { id: videoQuestionId },
      include: {
        subActivity: {
          include: {
            activity: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!videoQuestion || videoQuestion.subActivity.activity.course.instructorId !== instructorId) {
      throw new Error("Access denied to this question");
    }

    const videoResponse = await prisma.videoResponse.create({
      data: {
        videoQuestionId,
        instructorId,
        response,
      },
      include: {
        instructor: {
          select: {
            firstName: true,
            fatherName: true,
            lastName: true,
          },
        },
      },
    });

    revalidatePath("/");
    return { success: true, data: videoResponse };
  } catch (error) {
    console.error("Error submitting video response:", error);
    return { success: false, error: "Failed to submit response" };
  }
}

// Get all video questions for instructor's courses
export async function getInstructorVideoQuestions(courseId?: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== "instructor") {
      return { success: false, error: "Unauthorized - Instructor access required" };
    }

    const instructorId = session.user.id;

    const whereClause: any = {
      subActivity: {
        activity: {
          course: {
            instructorId,
            ...(courseId && { id: courseId }),
          },
        },
      },
    };

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
        subActivity: {
          select: {
            titleEn: true,
            titleAm: true,
            activity: {
              select: {
                titleEn: true,
                titleAm: true,
                course: {
                  select: {
                    titleEn: true,
                    titleAm: true,
                  },
                },
              },
            },
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
    console.error("Error fetching instructor video questions:", error);
    return { success: false, error: `Failed to fetch questions: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

// Update a video response (only by the instructor who wrote it)
export async function updateVideoResponse(
  responseId: string,
  newResponse: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "instructor") {
      throw new Error("Unauthorized - Instructor access required");
    }

    const instructorId = session.user.id;

    // Verify the response belongs to the current instructor
    const response = await prisma.videoResponse.findUnique({
      where: { id: responseId },
    });

    if (!response || response.instructorId !== instructorId) {
      throw new Error("Access denied");
    }

    const updatedResponse = await prisma.videoResponse.update({
      where: { id: responseId },
      data: { response: newResponse },
      include: {
        instructor: {
          select: {
            firstName: true,
            fatherName: true,
            lastName: true,
          },
        },
      },
    });

    revalidatePath("/");
    return { success: true, data: updatedResponse };
  } catch (error) {
    console.error("Error updating video response:", error);
    return { success: false, error: "Failed to update response" };
  }
}

// Delete a video response (only by the instructor who wrote it)
export async function deleteVideoResponse(responseId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "instructor") {
      throw new Error("Unauthorized - Instructor access required");
    }

    const instructorId = session.user.id;

    // Verify the response belongs to the current instructor
    const response = await prisma.videoResponse.findUnique({
      where: { id: responseId },
    });

    if (!response || response.instructorId !== instructorId) {
      throw new Error("Access denied");
    }

    await prisma.videoResponse.delete({
      where: { id: responseId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting video response:", error);
    return { success: false, error: "Failed to delete response" };
  }
}