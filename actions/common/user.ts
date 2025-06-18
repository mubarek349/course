"use server";

import { bot } from "@/bot";
import prisma from "@/lib/db";
import { StateType } from "@/lib/definations";

export async function toggleStatus(
  prevState: StateType,
  data: { id: string; status: "pending" | "active" | "inactive" } | undefined
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
          await bot.api
            .banChatMember(Number(channelId), Number(user.chatId))
            .catch(() => {});
          return;
        })
      );
    }
    return { status: true };
  } catch {
    return { status: false, cause: "", message: "" };
  }
}
