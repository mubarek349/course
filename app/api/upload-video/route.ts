import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("video") as File;
    const titleEn = formData.get("titleEn") as string;
    const titleAm = formData.get("titleAm") as string;

    if (!file || !titleEn || !titleAm) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "file", "videos");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const filename = `${timestamp}${extension}`;
    const filepath = path.join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    let course = await prisma.course.findFirst();
    if (!course) {
      let user = await prisma.user.findFirst({ where: { role: 'instructor' } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            role: 'instructor',
            phone: '0900000000',
            firstName: 'Default',
            fatherName: 'Instructor',
            lastName: 'User',
          },
        });
      }

      course = await prisma.course.create({
        data: {
          titleEn: "Default Course",
          titleAm: "ነባሪ ኮርስ",
          aboutEn: "Default course for uploaded videos",
          aboutAm: "ለተሰቀሉ ቪዲዮዎች ነባሪ ኮርስ",
          thumbnail: "default.jpg",
          video: "default.mp4",
          price: 0,
          level: 'beginner',
          duration: "0:00",
          instructorRate: 0,
          sellerRate: 0,
          affiliateRate: 0,
          instructorId: user.id,
        },
      });
    }

    let activity = await prisma.activity.findFirst({ where: { courseId: course.id } });
    if (!activity) {
      activity = await prisma.activity.create({
        data: {
          titleEn: "Video Activities",
          titleAm: "የቪዲዮ እንቅስቃሴዎች",
          courseId: course.id,
          order: 1,
        },
      });
    }

    const subActivity = await prisma.subActivity.create({
      data: {
        titleEn,
        titleAm,
        activityId: activity.id,
        video: filename,
      },
    });

    return NextResponse.json({ 
      success: true, 
      subActivity,
      message: "Video uploaded successfully" 
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}