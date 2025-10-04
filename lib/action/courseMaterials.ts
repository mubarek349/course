/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export type CourseMaterialInput = { name: string; url: string; type: string };
export type CourseMaterial = CourseMaterialInput;

export async function addCourseMaterials(
  courseId: string,
  materials: CourseMaterialInput[]
) {
  try {
    if (!courseId) {
      return { success: false, error: "Invalid courseId" };
    }

    // Sanitize and normalize input
    const sanitized = (materials || [])
      .filter((m) => m && m.url)
      .map((m) => ({
        name: m.name?.trim() || m.url.split("/").pop() || "material",
        url: m.url,
        type: (m.type || m.url.split(".").pop() || "file").toLowerCase(),
      }));

    // Deduplicate by URL
    const uniqueByUrl = Array.from(
      new Map(sanitized.map((m) => [m.url, m])).values()
    );

    // Convert to comma-separated string format for MySQL
    const commaSeparated = uniqueByUrl.map((m) => `${m.name},${m.url},${m.type}`).join(',');

    // Update the course with comma-separated string
    await prisma.course.update({
      where: { id: courseId },
      data: {
        courseMaterials: commaSeparated,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding course materials:", error);
    return { success: false, error: "Failed to add course materials" };
  }
}

export async function getCourseMaterials(
  courseId: string
): Promise<CourseMaterial[]> {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { courseMaterials: true },
    });

    const raw = course?.courseMaterials ?? "";

    // Handle empty string
    if (!raw || raw.trim() === "") {
      return [];
    }

    // Parse comma-separated string format: "name1,url1,type1,name2,url2,type2"
    const parts = raw.split(',');
    const materials: CourseMaterial[] = [];

    // Process in groups of 3 (name, url, type)
    for (let i = 0; i < parts.length; i += 3) {
      if (i + 2 < parts.length) {
        const name = parts[i]?.trim() || "material";
        const url = parts[i + 1]?.trim() || "";
        const type = parts[i + 2]?.trim() || "file";
        
        if (url) {
          materials.push({ name, url, type: type.toLowerCase() });
        }
      }
    }

    return materials;
  } catch (error) {
    console.error("Error fetching course materials:", error);
    return [];
  }
}

// ---------------- Announcements ----------------
export async function addAnnouncement(courseId: string, description: string) {
  try {
    if (!courseId || !description?.trim()) {
      return { success: false, error: "Invalid payload" };
    }
    const created = await prisma.announcement.create({
      data: {
        courseId,
        anouncementDescription: description.trim(),
      },
      select: { id: true },
    });
    return { success: true, id: created.id };
  } catch (error) {
    console.error("Error adding announcement:", error);
    return { success: false, error: "Failed to add announcement" };
  }
}

export async function getAnnouncements(courseId: string) {
  try {
    if (!courseId) return [];
    const items = await prisma.announcement.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
      select: { id: true, anouncementDescription: true, createdAt: true },
    });
    return items;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

// ---------------- Feedback ----------------
export async function addFeedback(
  courseId: string,
  feedback: string,
  rating: number
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }
    if (!courseId || !feedback?.trim() || !rating) {
      return { success: false, error: "Invalid payload" };
    }
    await prisma.feedback.create({
      data: {
        courseId,
        userId,
        feedback: feedback.trim(),
        rating: Math.max(1, Math.min(5, Math.round(rating))),
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error adding feedback:", error);
    return { success: false, error: "Failed to add feedback" };
  }
}

export async function getFeedback(courseId: string) {
  try {
    if (!courseId) return [];
    const items = await prisma.feedback.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        feedback: true,
        rating: true,
        createdAt: true,
        user: { select: { firstName: true, fatherName: true } },
      },
    });
    return items;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return [];
  }
}

export async function getAverageRating(courseId: string) {
  try {
    if (!courseId) return { average: 0, count: 0 };
    const result = await prisma.feedback.aggregate({
      where: { courseId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    return {
      average: Number(result._avg.rating ?? 0),
      count: Number(result._count.rating ?? 0),
    };
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return { average: 0, count: 0 };
  }
}
