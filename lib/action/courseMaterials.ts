"use server";

import prisma from "@/lib/db";

export async function addCourseMaterials(
  courseId: string,
  materials: { name: string; url: string; type: string }[]
) {
  try {
    await prisma.courseMaterial.createMany({
      data: materials.map((material) => ({
        courseId,
        name: material.name,
        url: material.url,
        type: material.type,
      })),
    });
    return { success: true };
  } catch (error) {
    console.error("Error adding course materials:", error);
    return { success: false, error: "Failed to add course materials" };
  }
}

export async function getCourseMaterials(courseId: string) {
  try {
    const materials = await prisma.courseMaterial.findMany({
      where: { courseId },
      select: {
        id: true,
        name: true,
        url: true,
        type: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return materials;
  } catch (error) {
    console.error("Error fetching course materials:", error);
    return [];
  }
}