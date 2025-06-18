"use server";
import prisma from "../db";

export async function getStudentsForManager() {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: "student",
      },
      select: {
        id: true,
        firstName: true,
        fatherName: true,
        lastName: true,
        phoneNumber: true,
        age: true,
        gender: true,
        country: true,
        region: true,
        city: true,
        status: true,
      },
    });
    return students;
  } catch {
    return [];
  }
}

// this is a function to get single student data
export async function getStudentForManager(id: string) {
  try {
    const student = await prisma.user.findFirst({
      where: { id, role: "student" },
    });

    return student;
  } catch (error) {
    console.error("Error fetching student:", error);
    return null;
  }
}
