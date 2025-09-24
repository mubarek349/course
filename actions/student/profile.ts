"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getProfile() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      fatherName: true,
      lastName: true,
      gender: true,
      phoneNumber: true,
    },
  });
  return profile;
}
