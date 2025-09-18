"use server";

import { auth, signIn, signOut } from "../auth";
import prisma from "../db";
import bcryptjs from "bcryptjs";
import { StateType } from "../definations";
import { redirect } from "next/navigation";
import { bot } from "@/bot";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function authenticate(
  prevState: StateType,
  data: { userName: string; password: string } | undefined
): Promise<StateType> {
  try {
    if (!data) return undefined;
    await signIn("credentials", {
      ...data,
      redirect: false,
    });
  } catch (error) {
    console.log("ERROR :: ", error);
    return { status: false, cause: "Authentication failed", message: "Authentication failed" };
  }
  // return { status: true };
  revalidatePath("");
  redirect(
    `/${(await headers()).get("darulkubra-url")?.split("/")?.[3] ?? "en"}`
  );
}

export async function signup(
  prevState: StateType,
  data:
    | { phoneNumber: string; password: string; confirmPassword: string }
    | undefined
): Promise<StateType> {
  // then password is match or not check
  if (!data) return undefined;
  const { phoneNumber, password, confirmPassword } = data;
  if (password !== confirmPassword)
    return {
      status: false,
      cause: "Password doesn't match",
      message: "Password doesn't match",
    };
  // then check if user already exist or not
  const user = await prisma.user.findFirst({
    where: { phoneNumber, role: "student" },
  });
  if (user)
    return {
      status: false,
      cause: "User already exist",
      message: "User already exist",
    };
  // then hash the password
  const hashedPassword = await bcryptjs.hash(password, 10);
  // then create the user
  if (!hashedPassword)
    return {
      status: false,
      cause: "Password hashing failed",
      message: "Password hashing failed",
    };
  // then create the user in the database
  await prisma.user.create({
    data: {
      phoneNumber: phoneNumber,
      password: hashedPassword,
      role: "student",
    },
  });
  return { status: true, message: "User created successfully" };
}

export async function unauthentic(prevState: StateType): Promise<StateType> {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    console.log("ERROR :: ", error);
    return { status: false, cause: "Sign out failed", message: "Sign out failed" };
  }
  // return { status: true };
  revalidatePath("");
  redirect("/");
  console.log(prevState);
}

export async function changePassword(
  prevState: StateType,
  data: { password: string; confirmPassword: string } | undefined
): Promise<StateType> {
  try {
    if (!data) return undefined;
    const { password, confirmPassword } = data;
    if (password !== confirmPassword)
      throw new Error("Passwords doesn't match");
    const session = await auth(),
      hashedPassword = await bcryptjs.hash(password, 10);
    if (session && hashedPassword) {
      await prisma.user.update({
        where: { id: session?.user?.id, role: { not: "employee" } },
        data: { password: hashedPassword },
      });
    }
    return { status: true, message: "Password changed successfully" };
  } catch (error) {
    console.log(error);
    return { status: false, cause: "Password change failed", message: "Password change failed" };
  }
}

export async function toggleStatus(
  prevState: StateType,
  data:
    | { id: string; chatId: string; status: "pending" | "active" | "inactive" }
    | undefined
): Promise<StateType> {
  try {
    if (!data) throw new Error();
    const { id, status } = data,
      user = await prisma.user.update({
        where: { id },
        data: { status },
      });

    if (user.status === "inactive") {
      const channelIds = await prisma.channel
        .findMany({ select: { chatId: true } })
        .then((res) => res.map((v) => v.chatId));

      await Promise.all(
        channelIds.map(async (channelId) => {
          await bot.api.banChatMember(Number(channelId), Number(user.chatId));
          return;
        })
      );
    }

    return { status: true, message: "Status updated successfully" };
  } catch {
    return { status: false, cause: "Status update failed", message: "Status update failed" };
  }
}
