import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const subActivities = await prisma.subActivity.findMany({
      include: {
        activity: true,
      },
      orderBy: {
        titleEn: 'asc',
      },
    });

    return NextResponse.json({ videos: subActivities });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}