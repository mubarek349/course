"use server";

import prisma from "@/lib/db";

export async function getCoursePackages() {
  try {
    const coursePackages = await prisma.course.findMany({
      select: {
        id: true,
        titleEn: true,
        titleAm: true,
        aboutEn: true,
        aboutAm: true,
        thumbnail: true,
        video: true,
        pdfData: true,
        aiProvider: true,
        courseMaterials: true,
        price: true,
        dolarPrice: true,
        birrPrice: true,
        level: true,
        language: true,
        duration: true,
        accessEn: true,
        accessAm: true,
        certificate: true,
        _count: {
          select: {
            order: true,
          },
        },
      },
            
    });

    return { success: true, data: coursePackages };
  } catch (error) {
    console.error("Failed to fetch course packages:", error);
    
    // More specific error handling
    if (error instanceof Error) {
      return { 
        success: false, 
        error: `Database error: ${error.message}` 
      };
    }
    
    return { 
      success: false, 
      error: "Failed to fetch course packages" 
    };
  }
}