"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function updateCourseMaterials(
  courseId: string,
  materials: string
) {
  try {
    console.log("💾 Updating course materials:", {
      courseId,
      materialsLength: materials.length,
    });

    await prisma.course.update({
      where: { id: courseId },
      data: { courseMaterials: materials || undefined },
    });

    console.log("✅ Course materials updated successfully");
    revalidatePath("/en/admin/courseMaterials");
    return { success: true, message: "Course materials updated successfully" };
  } catch (error) {
    console.error("❌ Error updating course materials:", error);
    return { success: false, message: "Failed to update course materials" };
  }
}

export async function uploadCourseMaterial(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const courseId = formData.get("courseId") as string;

    if (!file || !courseId) {
      return { success: false, message: "File and course ID are required" };
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      return { success: false, message: "File size must be less than 100MB" };
    }

    // Create materials directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "docs", "materials");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split(".").pop() || "pdf";
    const filename = `${timestamp}-${Math.floor(
      Math.random() * 100000
    )}.${ext}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    return { success: true, filename, message: "File uploaded successfully" };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, message: "Failed to upload file" };
  }
}

export async function deleteCourseMaterial(courseId: string, filename: string) {
  try {
    // Get current materials
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { courseMaterials: true },
    });

    if (!course) {
      return { success: false, message: "Course not found" };
    }

    // Parse materials from triplet format
    const currentMaterials = course.courseMaterials || "";
    const materials: Array<{ name: string; url: string; type: string }> = [];

    if (currentMaterials.trim()) {
      const parts = currentMaterials.split(",");
      for (let i = 0; i < parts.length; i += 3) {
        if (i + 2 < parts.length) {
          materials.push({
            name: parts[i].trim(),
            url: parts[i + 1].trim(),
            type: parts[i + 2].trim(),
          });
        }
      }
    }

    // Filter out the material with matching URL
    const updatedMaterials = materials.filter((m) => !m.url.includes(filename));

    // Convert back to triplet format
    const materialsString = updatedMaterials
      .map((m) => `${m.name},${m.url},${m.type}`)
      .join(",");

    // Update database
    await prisma.course.update({
      where: { id: courseId },
      data: { courseMaterials: materialsString },
    });

    revalidatePath("/en/admin/courseMaterials");
    return { success: true, message: "Material deleted successfully" };
  } catch (error) {
    console.error("Error deleting material:", error);
    return { success: false, message: "Failed to delete material" };
  }
}

export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        titleEn: true,
        titleAm: true,
        aboutEn: true,
        aboutAm: true,
        courseMaterials: true,
        pdfData: true,
        aiProvider: true,
        status: true,
        _count: {
          select: {
            order: true,
          },
        },
      },
    });

    return { success: true, data: courses };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { success: false, message: "Failed to fetch courses" };
  }
}
