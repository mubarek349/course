import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    console.log("Update order status API called");

    // Check if request has a body
    const contentType = request.headers.get("content-type");
    console.log("Content-Type:", contentType);

    if (!contentType || !contentType.includes("application/json")) {
      console.log("Invalid content type");
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    // Parse the request body with error handling
    let body;
    try {
      body = await request.json();
      console.log("Parsed body:", body);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Check if body is null or undefined
    if (!body) {
      console.log("Body is null or undefined");
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const { courseId, phoneNumber, paymentType, amount, currency } = body;
    console.log(
      "Extracted courseId:",
      courseId,
      "phoneNumber:",
      phoneNumber,
      "paymentType:",
      paymentType,
      "amount:",
      amount,
      "currency:",
      currency
    );

    if (!courseId || !phoneNumber) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Course ID and phone number are required" },
        { status: 400 }
      );
    }

    // Find user by phone number
    console.log("Looking for user with phone number:", phoneNumber);
    const user = await prisma.user.findFirst({
      where: { role: "student", phoneNumber },
    });

    if (!user) {
      console.log("User not found for phone number:", phoneNumber);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Found user:", user.id);

    // First, check if there are any unpaid orders for this user and course
    console.log("Checking for unpaid orders...");
    let existingOrders;
    try {
      existingOrders = await prisma.order.findMany({
        where: {
          userId: user.id,
          courseId: courseId,
          status: "unpaid", // Use the correct enum value
        },
      });
      console.log("Found unpaid orders:", existingOrders.length);
      console.log("Order details:", existingOrders);
    } catch (dbError) {
      console.error("Database error when finding orders:", dbError);
      return NextResponse.json(
        { error: "Database error when checking orders" },
        { status: 500 }
      );
    }

    if (existingOrders.length === 0) {
      console.log("No unpaid orders found, creating a new order...");

      try {
        // Get course details to set proper pricing
        const course = await prisma.course.findUnique({
          where: { id: courseId },
          select: {
            price: true,
            birrPrice: true,
            dolarPrice: true,
          },
        });

        if (!course) {
          return NextResponse.json(
            { error: "Course not found" },
            { status: 404 }
          );
        }

        // Determine the correct price based on payment type
        let orderPrice;
        if (paymentType === "stripe") {
          orderPrice = course.dolarPrice || course.price; // Use dolarPrice for Stripe
        } else {
          orderPrice = course.birrPrice || course.price; // Use birrPrice for Chapa
        }

        // Create a new order if none exists
        const newOrder = await prisma.order.create({
          data: {
            userId: user.id,
            courseId: courseId,
            status: "paid",
            totalPrice: amount || orderPrice,
            price: amount || orderPrice,
            date: new Date(),
            instructorIncome: (amount || orderPrice) * 0.7,
            img: "", // Empty for now
            paymentType: paymentType || "chapa",
          },
        });

        console.log("Created new order:", newOrder.id);

        return NextResponse.json({
          success: true,
          updatedCount: 1,
          message: "Order created and marked as paid",
        });
      } catch (createError) {
        console.error("Database error when creating order:", createError);
        return NextResponse.json(
          { error: "Database error when creating order" },
          { status: 500 }
        );
      }
    }

    // Update existing orders status to paid
    console.log(
      "Updating existing orders for user:",
      user.id,
      "course:",
      courseId
    );
    let updatedOrders;
    try {
      updatedOrders = await prisma.order.updateMany({
        where: {
          userId: user.id,
          courseId: courseId,
          status: "unpaid", // Use the correct enum value
        },
        data: { status: "paid" },
      });

      console.log("Updated orders count:", updatedOrders.count);
    } catch (updateError) {
      console.error("Database error when updating orders:", updateError);
      return NextResponse.json(
        { error: "Database error when updating orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      updatedCount: updatedOrders.count,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    // Provide more specific error information
    let errorMessage = "Failed to update order status";
    if (error instanceof Error) {
      errorMessage = `Database error: ${error.message}`;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
