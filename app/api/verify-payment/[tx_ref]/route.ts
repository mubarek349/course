import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get tx_ref from URL parameters
    const url = new URL(request.url);
    const tx_ref = url.pathname.split("/").pop();

    console.log("PAYMENT CALLBACK >> tx_ref:", tx_ref);

    if (!tx_ref) {
      return new NextResponse("Missing tx_ref", { status: 400 });
    }

    // Try to parse JSON body if it exists
    let data = null;
    try {
      data = await request.json();
      console.log("PAYMENT CALLBACK >> JSON data:", data);
    } catch (jsonError) {
      console.log("No JSON body, using URL parameter");
    }

    // Update order status based on callback data or default to paid
    const status = data?.status === true ? "paid" : "paid"; // Default to paid for Chapa callbacks

    await prisma.order.updateMany({
      where: { tx_ref: tx_ref },
      data: { status: status },
    });

    console.log("Updated order status to:", status);
    return new NextResponse("", { status: 200 });
  } catch (error) {
    console.log("PAYMENT CALLBACK ERROR:", error);
    return new NextResponse("", { status: 404 });
  }
}
