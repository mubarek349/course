"use server";

import prisma from "../db";
import { StateType } from "../definations";
import { auth } from "../auth";

// Add course materials to a course
export async function addCourseMaterials(
  courseId: string,
  materials: { name: string; url: string; type: string }[]
): Promise<StateType> {
  try {
    // Get current course materials
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { courseMaterials: true },
    });

    if (!course) {
      return { 
        status: false, 
        cause: "not_found",
        message: "Course not found" 
      };
    }

    // Update course with new materials
    await prisma.course.update({
      where: { id: courseId },
      data: {
        courseMaterials: {
          push: materials.map(material => JSON.stringify(material))
        }
      }
    });

    return { 
      status: true, 
      message: "Course materials added successfully" 
    };
  } catch (error) {
    console.error("Error adding course materials:", error);
    return { 
      status: false, 
      cause: "server_error",
      message: "Failed to add course materials" 
    };
  }
}

// Get course materials for a course
export async function getCourseMaterials(courseId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { courseMaterials: true },
    });

    if (!course) {
      return [];
    }

    // Parse the JSON strings back to objects
    return course.courseMaterials.map(material => {
      try {
        return JSON.parse(material);
      } catch {
        return { name: material, url: material, type: "unknown" };
      }
    });
  } catch (error) {
    console.error("Error fetching course materials:", error);
    return [];
  }
}

// Add announcement for a course
export async function addAnnouncement(
  courseId: string,
  description: string
): Promise<StateType> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { 
        status: false, 
        cause: "unauthorized",
        message: "Unauthorized" 
      };
    }

    await prisma.announcement.create({
      data: {
        anouncementDescription: description,
        courseId: courseId,
      }
    });

    return { 
      status: true, 
      message: "Announcement added successfully" 
    };
  } catch (error) {
    console.error("Error adding announcement:", error);
    return { 
      status: false, 
      cause: "server_error",
      message: "Failed to add announcement" 
    };
  }
}

// Get announcements for a course
export async function getAnnouncements(courseId: string) {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
    });

    return announcements;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

// Add feedback for a course
export async function addFeedback(
  courseId: string,
  feedback: string,
  rating: number
): Promise<StateType> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { 
        status: false, 
        cause: "unauthorized",
        message: "Unauthorized" 
      };
    }

    // Check if user already submitted feedback
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId,
      }
    });

    if (existingFeedback) {
      // Update existing feedback
      await prisma.feedback.update({
        where: { id: existingFeedback.id },
        data: {
          feedback,
          rating,
        }
      });
    } else {
      // Create new feedback
      await prisma.feedback.create({
        data: {
          userId: session.user.id,
          courseId: courseId,
          feedback,
          rating,
        }
      });
    }

    return { 
      status: true, 
      message: "Feedback submitted successfully" 
    };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { 
      status: false, 
      cause: "server_error",
      message: "Failed to submit feedback" 
    };
  }
}

// Get feedback for a course
export async function getFeedback(courseId: string) {
  try {
    const feedback = await prisma.feedback.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            firstName: true,
            fatherName: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return feedback;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return [];
  }
}

// Get average rating for a course
export async function getAverageRating(courseId: string) {
  try {
    const result = await prisma.feedback.aggregate({
      where: { courseId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      }
    });

    return {
      average: result._avg.rating || 0,
      count: result._count.rating || 0,
    };
  } catch (error) {
    console.error("Error fetching average rating:", error);
    return { average: 0, count: 0 };
  }
}