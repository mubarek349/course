"use server";

import prisma from "../db";
import { bot } from "@/bot";
import { StateType } from "../definations";
import { sendSMS } from ".";
import { InlineKeyboard } from "grammy";

export async function sendMessage(
  prevState: StateType,
  data: { name: string; phoneNumber: string; message: string } | undefined
): Promise<StateType> {
  try {
    if (!data) throw new Error();
    const { name, phoneNumber, message } = data;

    console.log(name, phoneNumber, message);

    return { status: true };
  } catch (error) {
    return { status: false, cause: "", message: "" };
    console.log(error);
  }
}

export async function sendMessageToAll(
  prevState: StateType,
  data:
    | {
        courseId: string[];
        message: string;
        withSMS: boolean;
        withUrl?: boolean;
        url?: string;
        name?: string;
      }
    | undefined
): Promise<StateType> {
  try {
    if (!data) throw new Error("No data provided");
    const { message, withSMS, withUrl, url, name, courseId } = data;

    const user = await prisma.user.findMany({
      where: {
        role: "student",
        order: {
          some: {
            courseId: {
              in: courseId,
            },
          },
        },
      },
    });

    user.forEach(async ({ chatId, phoneNumber }) => {
      if (chatId) {
        await bot.api.sendMessage(Number(chatId), message, {
          reply_markup: withUrl
            ? new InlineKeyboard().url(name ?? "", url ?? "")
            : undefined,
        });
      }
      if (withSMS) {
        sendSMS(phoneNumber, `${message} ${withUrl ? url : ""}`);
      }
    });

    return { status: true };
  } catch {
    return { status: false, cause: "", message: "" };
  }
}
