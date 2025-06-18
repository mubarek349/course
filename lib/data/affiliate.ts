"use server";
import prisma from "../db";

export async function getAffiliates() {
  try {
    const affiliates = await prisma.user.findMany({
      where: {
        role: "affiliate",
      },
      select: {
        id: true,
        firstName: true,
        fatherName: true,
        lastName: true,
        phoneNumber: true,
        country: true,
        region: true,
        city: true,
      },
    });
    return affiliates;
  } catch {
    return [];
  }
}
