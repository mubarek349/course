import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    console.log("Chapa update order status API called");

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

    // Chapa-specific fields
    const {
      courseId,
      phoneNumber,
      amount,
      currency = "ETB",
      tx_ref,
      reference,
      code,
      img,
    } = body;

    console.log(
      "Extracted courseId:",
      courseId,
      "phoneNumber:",
      phoneNumber,
      "amount:",
      amount,
      "currency:",
      currency,
      "tx_ref:",
      tx_ref,
      "reference:",
      reference,
      "code:",
      code
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
          status: "unpaid",
          paymentType: "chapa", // Only Chapa orders
        },
      });
      console.log("Found unpaid Chapa orders:", existingOrders.length);
      console.log("Order details:", existingOrders);
    } catch (dbError) {
      console.error("Database error when finding orders:", dbError);
      return NextResponse.json(
        { error: "Database error when checking orders" },
        { status: 500 }
      );
    }

    if (existingOrders.length === 0) {
      console.log("No unpaid Chapa orders found, creating a new order...");

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

        // Use birrPrice for Chapa payments
        const orderPrice = course.birrPrice || course.price;

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
            paymentType: "chapa",
            currency: currency,
            tx_ref: tx_ref || null,
            reference: reference || null,
            code: code || null,
            img: img || "",
            birrPrice: amount || orderPrice,
          },
        });

        console.log("Created new Chapa order:", newOrder.id);

        return NextResponse.json({
          success: true,
          updatedCount: 1,
          message: "Chapa order created and marked as paid",
          orderId: newOrder.id,
        });
      } catch (createError) {
        console.error("Database error when creating order:", createError);
        return NextResponse.json(
          { error: "Database error when creating order" },
          { status: 500 }
        );
      }
    }

    // Update existing Chapa orders status to paid
    console.log(
      "Updating existing Chapa orders for user:",
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
          status: "unpaid",
          paymentType: "chapa", // Only Chapa orders
        },
        data: {
          status: "paid",
          currency: currency,
          tx_ref: tx_ref || undefined,
          reference: reference || undefined,
          code: code || undefined,
          img: img || undefined,
          birrPrice: amount || undefined,
        },
      });

      console.log("Updated Chapa orders count:", updatedOrders.count);
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
      message: "Chapa orders updated successfully",
    });
  } catch (error) {
    console.error("Chapa update order status error:", error);

    // Provide more specific error information
    let errorMessage = "Failed to update Chapa order status";
    if (error instanceof Error) {
      errorMessage = `Database error: ${error.message}`;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
