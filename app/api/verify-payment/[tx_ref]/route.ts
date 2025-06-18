import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET({ json }: NextRequest) {
  try {
    const data = await json();
    console.log("PAYMENT CALLBACK >> ", data);
    await prisma.order.updateMany({
      where: { tx_ref: data.tx_ref },
      data: { status: data.status == true ? "paid" : "unpaid" },
    });
    return new NextResponse("", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("", { status: 404 });
  }
}
