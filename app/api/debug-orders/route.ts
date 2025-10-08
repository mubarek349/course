import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get("phoneNumber");

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Find user by phone number
    const user = await prisma.user.findFirst({
      where: { role: "student", phoneNumber },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all orders for this user
    const allOrders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            id: true,
            titleEn: true,
            titleAm: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    // Get paid orders specifically
    const paidOrders = await prisma.order.findMany({
      where: {
        userId: user.id,
        status: "paid",
      },
      include: {
        course: {
          select: {
            id: true,
            titleEn: true,
            titleAm: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    // Test the mycourse query
    const mycourseQuery = await prisma.order.findMany({
      where: { userId: user.id, status: "paid" },
      select: { courseId: true },
    });

    const courseIds = mycourseQuery.map((order) => order.courseId);

    const mycourseData = await prisma.course.findMany({
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
    });

    return NextResponse.json({
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      allOrders: allOrders.map((order) => ({
        id: order.id,
        courseId: order.courseId,
        courseTitle: order.course.titleEn,
        status: order.status,
        paymentType: order.paymentType,
        currency: order.currency,
        price: order.price,
        totalPrice: order.totalPrice,
        date: order.date,
        tx_ref: order.tx_ref,
        reference: order.reference,
        code: order.code,
      })),
      paidOrders: paidOrders.map((order) => ({
        id: order.id,
        courseId: order.courseId,
        courseTitle: order.course.titleEn,
        status: order.status,
        paymentType: order.paymentType,
        currency: order.currency,
        price: order.price,
        totalPrice: order.totalPrice,
        date: order.date,
        tx_ref: order.tx_ref,
        reference: order.reference,
        code: order.code,
      })),
      mycourseData: mycourseData.map((course) => ({
        id: course.id,
        titleEn: course.titleEn,
        titleAm: course.titleAm,
        instructor: course.instructor,
        activityCount: course.activity.reduce(
          (a, c) => a + c._count.subActivity,
          0
        ),
      })),
      summary: {
        totalOrders: allOrders.length,
        paidOrders: paidOrders.length,
        unpaidOrders: allOrders.length - paidOrders.length,
        mycourseCourses: mycourseData.length,
        courseIds: courseIds,
      },
    });
  } catch (error) {
    console.error("Debug orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
