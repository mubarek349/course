import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, courseId } = await request.json();

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

    // Update all unpaid orders for this user to paid
    const whereClause: any = {
      userId: user.id,
      status: "unpaid",
    };

    if (courseId) {
      whereClause.courseId = courseId;
    }

    const updatedOrders = await prisma.order.updateMany({
      where: whereClause,
      data: {
        status: "paid",
        currency: "ETB", // Default currency
        paymentType: "chapa", // Default payment type
      },
    });

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedOrders.count} orders to paid status`,
      updatedCount: updatedOrders.count,
    });
  } catch (error) {
    console.error("Fix orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
