"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import { join } from "path";
export async function finalizeAiPdfUpload(packageId: string, filename: string) {
  try {
    await prisma.course.update({
      where: { id: packageId },
      data: { pdfData: filename },
    });

    revalidatePath("/en/manager/course/registration");

    return {
      success: true,
      message: "AI PDF Data updated in database successfully",
    };
  } catch (error) {
    console.error("Finalize AI PDF upload error:", error);
    return {
      success: false,
      message: "Failed to update AI PDF Data in database",
    };
  }
}
export async function uploadAiPdfData(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const packageId = formData.get("packageId") as string;

    if (!file || !packageId) {
      return { success: false, message: "Missing file or package ID" };
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return { success: false, message: "Only PDF files are allowed" };
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      return { success: false, message: "File size must be less than 100MB" };
    }

    // Generate unique filename
    const filename = `ai-pdf-${randomUUID()}.pdf`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "docs", "ai-pdfs");

    try {
      await writeFile(join(uploadDir, filename), buffer);
    } catch {
      // If directory doesn't exist, create it and try again
      const { mkdir } = await import("fs/promises");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, filename), buffer);
    }

    // Update database
    await prisma.course.update({
      where: { id: packageId },
      data: { pdfData: filename },
    });

    revalidatePath("/en/manager/course/registration");

    return {
      success: true,
      message: "AI PDF Data uploaded successfully",
      filename,
    };
  } catch (error) {
    console.error("AI PDF upload error:", error);
    return {
      success: false,
      message: "Failed to upload AI PDF Data",
    };
  }
}
export async function getCurrentAiPdfData(packageId: string) {
  try {
    const aiPdfData=await prisma.course.findFirst({
      where: { id: packageId },
      select:{
          pdfData:true,
      }
    });
    return aiPdfData?.pdfData;
  } catch (error) {
    console.error("Error getting AI PDF data:", error);
    return { success: false, message: "Failed to getting AI PDF data" };
  }
}
export async function removeAiPdfData(courseId: string) {
  try {
    console.log('🗑️ Removing AI PDF data for course:', courseId);
    
    // Get current AI PDF data
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { pdfData: true },
    });

    if (!course?.pdfData) {
      console.log('ℹ️ No AI PDF Data found');
      return { success: false, message: "No AI PDF Data found" };
    }

    // Delete the actual PDF file from filesystem
    const filePath = join(process.cwd(), 'docs', 'ai-pdfs', course.pdfData);
    
    try {
      const { unlink } = await import('fs/promises');
      await unlink(filePath);
      console.log(`📁 Deleted file: ${filePath}`);
    } catch (error) {
      console.warn('⚠️ File not found on filesystem:', error);
      // Continue with database update even if file doesn't exist
    }

    // Update database
    await prisma.course.update({
      where: { id: courseId },
      data: { pdfData: null },
    });

    console.log('✅ AI PDF data removed from database');
    
    // Revalidate the course registration page
    revalidatePath(`/[lang]/@manager/course/registration/${courseId}`);
    revalidatePath('/[lang]/@manager/course/registration');

    return {
      success: true,
      message: "AI PDF Data removed successfully",
    };
  } catch (error) {
    console.error("❌ AI PDF removal error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      message: `Failed to remove AI PDF Data: ${errorMessage}`,
    };
  }
}
