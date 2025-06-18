"use server";
import prisma from "../db";

// this is a function to get single course data
export async function getCourseForManager(id: string) {
  try {
    const course = await prisma.course.findFirst({
      where: { id },
    });
    return course;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}
