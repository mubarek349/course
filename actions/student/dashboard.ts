"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

interface DashboardStats {
  totalCourses: number;
  coursesInProgress: number;
  completedCourses: number;
  certificatesEarned: number;
}

interface CourseProgress {
  id: string;
  titleEn: string;
  titleAm: string;
  thumbnail: string;
  progress: number;
  totalSubActivities: number;
  completedSubActivities: number;
  category: string;
}

export async function getDashboardData(): Promise<DashboardStats | null> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return null;
    }

    const userId = session.user.id;

    // Get all paid courses for the user
    const paidOrders = await prisma.order.findMany({
      where: {
        userId,
        status: "paid",
      },
      select: {
        courseId: true,
        course: {
          select: {
            id: true,
            certificate: true,
            activity: {
              select: {
                subActivity: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const totalCourses = paidOrders.length;

    // Get student progress for all enrolled courses
    const studentProgress = await prisma.studentProgress.findMany({
      where: {
        userId,
      },
      select: {
        subActivityId: true,
        isCompleted: true,
        subActivity: {
          select: {
            activityId: true,
            activity: {
              select: {
                courseId: true,
              },
            },
          },
        },
      },
    });

    // Calculate course completion statistics
    let coursesInProgress = 0;
    let completedCourses = 0;
    let certificatesEarned = 0;

    for (const order of paidOrders) {
      const courseId = order.courseId;

      // Get total sub-activities for this course
      const totalSubActivities = order.course.activity.reduce(
        (total, activity) => total + activity.subActivity.length,
        0
      );

      // Get completed sub-activities for this course
      const completedSubActivities = studentProgress.filter(
        (progress) =>
          progress.subActivity.activity.courseId === courseId &&
          progress.isCompleted
      ).length;

      const progressPercentage =
        totalSubActivities > 0
          ? (completedSubActivities / totalSubActivities) * 100
          : 0;

      if (progressPercentage === 100) {
        completedCourses++;
        if (order.course.certificate) {
          certificatesEarned++;
        }
      } else if (progressPercentage > 0 && progressPercentage < 100) {
        coursesInProgress++;
      }
    }

    return {
      totalCourses,
      coursesInProgress,
      completedCourses,
      certificatesEarned,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}

export async function getGraphData(): Promise<CourseProgress[] | null> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return null;
    }

    const userId = session.user.id;

    // Get all paid courses with details
    const enrolledCourses = await prisma.order.findMany({
      where: {
        userId,
        status: "paid",
      },
      select: {
        course: {
          select: {
            id: true,
            titleEn: true,
            titleAm: true,
            thumbnail: true,
            level: true,
            activity: {
              select: {
                subActivity: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Get student progress
    const studentProgress = await prisma.studentProgress.findMany({
      where: {
        userId,
      },
      select: {
        subActivityId: true,
        isCompleted: true,
        subActivity: {
          select: {
            activity: {
              select: {
                courseId: true,
              },
            },
          },
        },
      },
    });

    // Calculate progress for each course
    const coursesWithProgress: CourseProgress[] = enrolledCourses.map(
      (enrollment) => {
        const course = enrollment.course;

        // Count total sub-activities
        const totalSubActivities = course.activity.reduce(
          (total, activity) => total + activity.subActivity.length,
          0
        );

        // Count completed sub-activities
        const completedSubActivities = studentProgress.filter(
          (progress) =>
            progress.subActivity.activity.courseId === course.id &&
            progress.isCompleted
        ).length;

        const progress =
          totalSubActivities > 0
            ? Math.round((completedSubActivities / totalSubActivities) * 100)
            : 0;

        return {
          id: course.id,
          titleEn: course.titleEn,
          titleAm: course.titleAm,
          thumbnail: course.thumbnail,
          progress,
          totalSubActivities,
          completedSubActivities,
          category: course.level,
        };
      }
    );

    return coursesWithProgress;
  } catch (error) {
    console.error("Error fetching graph data:", error);
    return null;
  }
}

export async function getContinueLearning(): Promise<CourseProgress[] | null> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return null;
    }

    // Get all courses with progress
    const allCourses = await getGraphData();

    if (!allCourses) {
      return null;
    }

    // Filter courses that are in progress (0 < progress < 100)
    const coursesInProgress = allCourses.filter(
      (course) => course.progress > 0 && course.progress < 100
    );

    // Sort by progress (ascending) - show courses with less progress first
    coursesInProgress.sort((a, b) => a.progress - b.progress);

    return coursesInProgress;
  } catch (error) {
    console.error("Error fetching continue learning data:", error);
    return null;
  }
}

export async function getAllEnrolledCourses(): Promise<
  CourseProgress[] | null
> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return null;
    }

    // Get all courses with progress (completed and in progress)
    const allCourses = await getGraphData();

    if (!allCourses) {
      return null;
    }

    // Sort by progress (descending) - show most completed courses first
    allCourses.sort((a, b) => b.progress - a.progress);

    return allCourses;
  } catch (error) {
    console.error("Error fetching all enrolled courses:", error);
    return null;
  }
}
