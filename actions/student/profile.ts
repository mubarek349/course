"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getProfile() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;
  
  // Get user profile
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      fatherName: true,
      lastName: true,
      gender: true,
      phoneNumber: true,
      country: true,
      region: true,
      city: true,
      age: true,
      role: true,
    },
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  // Get enrolled courses count
  const paidOrdersForCount = await prisma.order.findMany({
    where: {
      userId: userId,
      status: "paid",
    },
    select: { courseId: true },
    distinct: ["courseId"],
  });
  const enrolledCoursesCount = paidOrdersForCount.length;

  // Get completed courses (courses where all activities are done)
  const paidOrders = await prisma.order.findMany({
    where: { userId: userId, status: "paid" },
    select: { courseId: true },
    distinct: ["courseId"],
  });

  const courseIds = paidOrders.map((order) => order.courseId);
  
  let completedCoursesCount = 0;
  if (courseIds.length > 0) {
    // For each course, check if all activities are completed
    for (const courseId of courseIds) {
      const activities = await prisma.activity.findMany({
        where: { courseId },
        select: {
          id: true,
          subActivity: { select: { id: true } },
        },
      });

      const totalSubActivities = activities.reduce(
        (sum, activity) => sum + activity.subActivity.length,
        0
      );

      if (totalSubActivities > 0) {
        const completedSubActivities = await prisma.studentProgress.count({
          where: {
            userId,
            isCompleted: true,
            subActivityId: {
              in: activities.flatMap((a) => a.subActivity.map((s) => s.id)),
            },
          },
        });

        if (completedSubActivities >= totalSubActivities) {
          completedCoursesCount++;
        }
      }
    }
  }

  // Get total questions answered
  const questionsAnswered = await prisma.studentQuiz.count({
    where: { userId },
  });

  return {
    ...profile,
    enrolledCoursesCount,
    completedCoursesCount,
    questionsAnswered,
  };
}
