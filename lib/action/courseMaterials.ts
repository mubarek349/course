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

    // Get current materials
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { courseMaterials: true },
    });

    // Parse existing materials from triplet format
    const currentMaterials = course?.courseMaterials || "";
    const existingMaterials: CourseMaterial[] = [];
    
    if (currentMaterials.trim()) {
      const parts = currentMaterials.split(',');
      for (let i = 0; i < parts.length; i += 3) {
        if (i + 2 < parts.length) {
          existingMaterials.push({
            name: parts[i].trim(),
            url: parts[i + 1].trim(),
            type: parts[i + 2].trim()
          });
        }
      }
    }

    // Sanitize new materials
    const sanitized = (materials || [])
      .filter((m) => m && m.url)
      .map((m) => ({
        name: m.name?.trim() || m.url.split("/").pop() || "material",
        url: m.url.trim(),
        type: (m.type || "file").toLowerCase(),
      }));

    // Combine and deduplicate by URL
    const allMaterials = [...existingMaterials, ...sanitized];
    const uniqueByUrl = Array.from(
      new Map(allMaterials.map((m) => [m.url, m])).values()
    );

    // Convert to comma-separated triplet format: "name1,url1,type1,name2,url2,type2"
    const commaSeparated = uniqueByUrl
      .map((m) => `${m.name},${m.url},${m.type}`)
      .join(',');

    // Update the course with comma-separated triplets
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

    console.log("📋 Course Materials Raw Data:", { courseId, raw });

    // Handle empty string
    if (!raw || raw.trim() === "") {
      return [];
    }

    const parts = raw.split(',').map(p => p.trim()).filter(p => p.length > 0);
    const materials: CourseMaterial[] = [];

    // Detect format: if parts count is divisible by 3 and contains /api/files/, it's likely triplet format
    // Otherwise, it's old URL-only format
    const isTripletFormat = parts.length % 3 === 0 && parts.some(p => p.includes('/api/files/'));

    if (isTripletFormat) {
      console.log("🔄 Parsing as TRIPLET format");
      // Parse comma-separated triplet format: "name1,url1,type1,name2,url2,type2"
      for (let i = 0; i < parts.length; i += 3) {
        if (i + 2 < parts.length) {
          const name = parts[i] || "material";
          const url = parts[i + 1] || "";
          const type = parts[i + 2] || "file";
          
          if (url) {
            materials.push({ 
              name, 
              url, 
              type: type.toLowerCase() 
            });
          }
        }
      }
    } else {
      console.log("🔄 Parsing as URL-ONLY format (legacy)");
      // Legacy format: just comma-separated URLs or filenames
      parts.forEach(item => {
        if (item) {
          // If it's just a filename (no slashes), construct the full URL
          let url = item;
          if (!item.includes('/')) {
            url = `/api/files/materials/${item}`;
          } else if (!item.startsWith('/api/files/')) {
            // If it has slashes but not the /api/files/ prefix, assume it's just the filename
            const filename = item.split('/').pop();
            url = `/api/files/materials/${filename}`;
          }
          
          const filename = url.split('/').pop() || 'file';
          const extension = filename.split('.').pop()?.toLowerCase() || '';
          
          let type = 'file';
          if (['pdf'].includes(extension)) type = 'pdf';
          else if (['doc', 'docx'].includes(extension)) type = 'document';
          else if (['ppt', 'pptx'].includes(extension)) type = 'presentation';
          else if (['xls', 'xlsx'].includes(extension)) type = 'spreadsheet';
          else if (['mp4', 'avi', 'mov', 'webm'].includes(extension)) type = 'video';
          else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) type = 'image';
          else if (['zip', 'rar', '7z'].includes(extension)) type = 'archive';
          else if (['txt'].includes(extension)) type = 'text';
          
          materials.push({
            name: filename,
            url: url,
            type: type
          });
        }
      });
    }

    console.log("📦 Parsed Materials:", materials);

    return materials;
  } catch (error) {
    console.error("Error fetching course materials:", error);
    return [];
  }
}

export async function getAIPdfMaterial(id: string) {
  const pdfDataWithItsAIProvider = await prisma.course.findUnique({ where: { id } });
  if (!pdfDataWithItsAIProvider) throw new Error("Document not found");
  return {
    id: pdfDataWithItsAIProvider.id,
    aiProvider: pdfDataWithItsAIProvider.aiProvider,
    pdfData: pdfDataWithItsAIProvider.pdfData,
  };
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
