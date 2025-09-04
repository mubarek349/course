"use server";

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
        activity: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            titleEn: true,
            titleAm: true,
            order: true,
            // question: {
            //   select: { question: true, questionOptions: true },
            // },
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
    };
  } catch (error) {
    console.error("Error fetching single course:", error);
    return null;
  }
}
