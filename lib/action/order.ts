"use server";

import { sendSMSToCustomer } from "./index";
import { auth } from "../auth";
import prisma from "../db";
import { StateType, TStudent } from "../definations";
import { bot } from "@/bot";
import { InputFile } from "grammy";
import bcryptjs from "bcryptjs";

export default async function sale(
  prevState: StateType,
  data:
    | (TStudent & {
        transactionImage: string;
        transactionNumber: string;
        transactionAmount: number;
        price: number;
      })
    | undefined
): Promise<StateType> {
  try {
    if (!data) return undefined;
    const {
        id,
        phoneNumber,
        transactionImage,
        transactionNumber,
        transactionAmount,
        price,
        ...rest
      } = data,
      session = await auth(),
      course = await prisma.course.findFirst({ where: { id } }),
      seller = await prisma.user.findFirst({
        where: { code: session?.user?.code },
        include: { IncomeRate: { where: { courseId: course?.id } } },
      });
    if (seller && course && Number(course.price) === price) {
      let user = await prisma.user.findFirst({
        where: { role: "student", phoneNumber },
      });
      if (!user) {
        user = await prisma.user.create({
          data: {
            role: "student",
            ...rest,
            age: Number(rest.age),
            phoneNumber,
            password: await bcryptjs.hash(rest.password ?? rest.firstName, 12),
          },
        });
      }

      let order = await prisma.order.findFirst({
        where: { userId: user.id, courseId: course.id },
      });
      if (order) {
        if (order.status === "paid") {
          return {
            status: false,
            cause: "payed",
            message: "Already paid for this course",
          };
        }
        order = await prisma.order.update({
          where: { id: order?.id || "" },
          data: {
            totalPrice: transactionAmount,
            price,
            img: transactionImage,
            reference: transactionNumber,
            status: "paid",
            date: new Date(),
            code: seller.code,
            instructorIncome: (price * Number(course.instructorRate)) / 100,
            income: seller.IncomeRate?.[0]?.rate || course.sellerRate,
          },
        });
      } else {
        order = await prisma.order.create({
          data: {
            userId: user.id,
            courseId: course.id,
            img: transactionImage,
            totalPrice: transactionAmount,
            price,
            reference: transactionNumber,
            status: "paid",
            date: new Date(),
            code: seller.code,
            instructorIncome: (price * Number(course.instructorRate)) / 100,
            income: seller.IncomeRate?.[0]?.rate ?? course.sellerRate,
            paymentType: "chapa",
            currency: "ETB",
          },
        });
      }

      await sendSMSToCustomer(user.phoneNumber, course.titleEn, course.titleAm);

      const channelId = process.env.CHANNELID;
      if (channelId) {
        const startOfDay = new Date(),
          endOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        endOfDay.setHours(23, 59, 59, 999);

        const todaySalesCount = await prisma.order.count({
            where: {
              code: seller.code,
              date: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
          }),
          totalSalesCount = await prisma.order.count({
            where: {
              code: seller.code,
              date: {
                gte: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  1
                ),
                lte: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() + 1,
                  0
                ),
              },
            },
          });
        await bot.api.sendPhoto(
          channelId,
          new InputFile(
            Buffer.from(transactionImage, "base64"),
            "transactionImage.jpg"
          ),
          {
            caption: `
        📢 Course Notification:
  
        -   Order ID: ${order.id}
        -   Transaction Number: ${transactionNumber}
        -   Course: ${course.titleEn} / ${course.titleAm}
        -   Phone: ${user.phoneNumber}
        -   BY : ${seller.firstName} ${seller.fatherName} ${seller.lastName}
        -   Today's Sales: ${todaySalesCount}
        -   Total Sales This Month: ${totalSalesCount}
        -   Date: ${new Date().toLocaleString()}
        `,
          }
        );
      }

      return { status: true };
    }

    throw new Error();
  } catch (error) {
    return {
      status: false,
      cause: error instanceof Error ? error.message : "Unknown error",
      message: "An error occurred",
    };
    console.error("Error occurred:", error);
  }
}
