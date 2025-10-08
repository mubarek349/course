import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";

new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const { tx_ref } = await request.json();

    // Find the order by tx_ref
    const order = await prisma.order.findFirst({
      where: { tx_ref },
      include: { course: true, user: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // In a real implementation, you would verify the payment with Stripe
    // For now, we'll simulate a successful payment
    // You would typically use Stripe webhooks to handle payment completion

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying Stripe payment:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
