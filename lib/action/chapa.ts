"use server";

import { randomUUID } from "crypto";
import prisma from "../db";
import { sendSMSToAffiliate, sendSMSToCustomer } from ".";
import { bot } from "@/bot";
import { StateType } from "../definations";
import { Transfer, User } from "@prisma/client";
import { headers } from "next/headers";

type TPayState =
  | { status: true; cause?: undefined; message?: undefined; url: string }
  | { status: false; cause: string; message: string; url?: undefined }
  | undefined;

export async function pay(
  prevState: TPayState,
  data:
    | {
        id: string;
        phoneNumber: string;
        affiliateCode?: string;
      }
    | undefined
): Promise<TPayState> {
  try {
    if (!data) return undefined;
    const { id, phoneNumber, affiliateCode } = data,
      course = await prisma.course.findFirst({ where: { id: id } }),
      lang = ((await headers()).get("darulkubra-url") ?? "").split("/")[3];

    if (!course) throw new Error();
    let user = await prisma.user.findFirst({
      where: { role: "student", phoneNumber },
    });

    if (!user) {
      return {
        status: false,
        cause: "user_not_found",
        message:
          "Please register with this phone number before ordering the course",
      };
    }
    const affiliate = await prisma.user.findFirst({
      where: { code: affiliateCode },
      select: {
        code: true,
        IncomeRate: { where: { courseId: course.id } },
      },
    });
    let order = await prisma.order.findFirst({
      where: { userId: user.id, courseId: course.id },
      select: { id: true, tx_ref: true, income: true, status: true },
    });
    // console.log("ORDER :: ", oldOrder);
    if (order) {
      if (order.status === "paid") {
        return {
          status: true,
          url: `${process.env.MAIN_API}/${lang}/student/mycourse`,
        };
      } else if (order.tx_ref) {
        const response = await verify(order.tx_ref);
        if (response) {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: "paid" },
          });
          return {
            status: true,
            url: `${process.env.MAIN_API}/${lang}/verify-payment/${order.tx_ref}`,
          };
        }
      }
      let tx_ref = randomUUID(),
        stop = false;
      while (!stop) {
        const order = await prisma.order.findFirst({
          where: { tx_ref },
        });
        if (!order) stop = true;
        else tx_ref = randomUUID();
      }
      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          tx_ref,
          totalPrice: course.price,
          price: course.price,
          date: new Date(),
          ...(affiliate
            ? {
                code: affiliate.code,
                income: affiliate.IncomeRate[0]?.rate || course.affiliateRate,
              }
            : {}),
        },
        select: { id: true, tx_ref: true, income: true, status: true },
      });
    } else {
      order = await prisma.order.create({
        data: {
          userId: user.id,
          courseId: course.id,
          totalPrice: course.price,
          price: course.price,
          tx_ref: randomUUID(),
          date: new Date(),
          instructorIncome:
            (Number(course.price) * Number(course.instructorRate)) / 100,
          img: "",
          ...(affiliate
            ? {
                code: affiliate.code,
                income: affiliate.IncomeRate[0]?.rate || course.affiliateRate,
              }
            : {}),
        },
        select: { id: true, tx_ref: true, income: true, status: true },
      });
    }
    if (!order) throw new Error();
    const response = await fetch(
      `${process.env.CHAPA_API}/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: course.price,
          phone_number: user.phoneNumber,
          tx_ref: order.tx_ref,
          callback_url: `${process.env.MAIN_API}/api/verify-payment/${order.tx_ref}`,
          return_url: `${process.env.MAIN_API}/${lang}/verify-payment/${order.tx_ref}`,
          "customization[title]": "Payment for my favorite ders",
          "customization[description]": "I love online payments",
          "meta[hide_receipt]": "true",
        }),
        redirect: "follow",
      }
    ).then((res) => res.json());

    if (response?.status == "success") {
      return {
        status: true,
        url: response?.data?.checkout_url,
      };
    }
    throw new Error();
  } catch (error) {
    console.log(error);
    return { status: false, cause: "", message: "" };
  }
}

type TVerifyState =
  | { status: true; cause?: undefined; message?: undefined; id?: string }
  | { status: false; cause: string; message: string; id?: string }
  | undefined;
export async function verifyPayment(
  prevState: TVerifyState,
  tx_ref: string | undefined
): Promise<TVerifyState> {
  try {
    if (!tx_ref) return undefined;
    const order = await prisma.order.findFirst({
      where: { tx_ref },
      select: {
        id: true,
        status: true,
        tx_ref: true,
        courseId: true,
        user: { select: { phoneNumber: true } },
      },
    });

    if (!order) throw new Error();

    if (order.status == "paid") {
      return { status: true };
    }

    const response = await verify(order.tx_ref);

    if (response) {
      const newOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: "paid" },
        select: { user: true, course: true, code: true, income: true },
      });
      await sendSMSToCustomer(
        newOrder.user.phoneNumber,
        newOrder.course.titleEn,
        newOrder.course.titleAm
      );
      if (newOrder.code) {
        const affiliate = await prisma.user.findFirst({
          where: { code: newOrder.code },
        });
        if (affiliate) {
          await sendSMSToAffiliate(
            affiliate.phoneNumber,
            Number(newOrder.income) || 0
          );
        }
      }

      const channelId = process.env.CHANNEL_ID;
      if (channelId) {
        const startOfDay = new Date(),
          endOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        endOfDay.setHours(23, 59, 59, 999);

        const todaySalesCount = await prisma.order.count({
            where: {
              code: newOrder.code,
              date: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
          }),
          today = new Date(),
          totalSalesCount = await prisma.order.count({
            where: {
              code: newOrder.code,
              date: {
                gte: new Date(today.getFullYear(), today.getMonth(), 1),
                lte: new Date(today.getFullYear(), today.getMonth() + 1, 0),
              },
            },
          }),
          affiliate = await prisma.user.findFirst({
            where: { code: newOrder.code || "" },
          });

        await bot.api
          .sendMessage(
            channelId,
            `
            📢 Course Notification:
            -   Name: ${newOrder.user.firstName} ${newOrder.user.fatherName} ${
              newOrder.user.lastName
            } 
            -   Order ID: ${order.id}
            -   Transaction Number: ${order.tx_ref}
            -   Course: ${newOrder.course.titleEn} / ${newOrder.course.titleAm}
            -   Phone: ${newOrder.user.phoneNumber}
            -   Affiliate Name: ${affiliate?.firstName ?? ""} ${
              affiliate?.lastName ?? ""
            }
            -   Today's Sales: ${todaySalesCount}
            -   Total Sales This Month: ${totalSalesCount}
            -   Date: ${new Date().toLocaleString()}
            `
          )
          .catch((err) => {
            console.log(err);
          });
      }
      return { status: true };
    } else {
      return { status: false, cause: "", message: "", id: order.courseId };
    }
  } catch (error) {
    console.log(error);
    return { status: false, cause: "", message: "" };
  }
}

async function verify(tx_ref: string | null) {
  // console.log("VERIFY :: ", tx_ref);
  const response = await fetch(
    `${process.env.CHAPA_API}/transaction/verify/${tx_ref}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${process.env.CHAPA_TOKEN}` },
    }
  ).then((res) => res.json());
  if (response.status == "success" && response.data.status == "success")
    return true;
  else return false;
}

export async function transferPayment(
  prevState: StateType,
  data: { id: string; income: number }[] | undefined
): Promise<StateType> {
  try {
    if (!data) throw new Error();
    // await fetch(`${process.env.CHAPA_API}/banks`, {
    //   method: "GET",
    //   headers: { Authorization: `Bearer ${process.env.CHAPA_TOKEN}` },
    // })
    //   .then((response) => response.text())
    //   .then((result) => {
    //     console.log("RES :: ", JSON.parse(result));
    //     return;
    //   });

    // {
    //   id: 855,
    //   slug: 'telebirr',
    //   swift: 'TELEBIRR',
    //   name: 'telebirr',
    //   acct_length: 10,
    //   country_id: 1,
    //   is_mobilemoney: 1,
    //   is_active: 1,
    //   is_rtgs: null,
    //   real_bank: 1,
    //   active: 1,
    //   is_24hrs: 1,
    //   created_at: '2022-12-12T14:41:12.000000Z',
    //   updated_at: '2024-08-02T20:08:57.000000Z',
    //   currency: 'ETB'
    // }

    const now = new Date(),
      transferData = await Promise.all(
        data.map(async ({ id, income }) => {
          let transfer: Transfer & { user: User };
          const oldTransfer = await prisma.transfer.findFirst({
            where: {
              userId: id,
              year: now.getFullYear(),
              month: now.getMonth(),
            },
          });
          if (oldTransfer) {
            if (oldTransfer.status == "paid") {
              return undefined;
            } else {
              transfer = await prisma.transfer.update({
                where: { id: oldTransfer.id },
                data: { reference: crypto.randomUUID(), income },
                include: { user: true },
              });
            }
          } else {
            transfer = await prisma.transfer.create({
              data: {
                userId: id,
                year: now.getFullYear(),
                month: now.getMonth(),
                income,
              },
              include: { user: true },
            });
          }
          return {
            bank_code: 855,
            // account_name: `${transfer.user.firstName} ${transfer.user.fatherName} ${transfer.user.lastName}`,
            // account_number: transfer.user.phoneNumber,
            account_number: "0900112233",
            account_name: "Abdelkerim Ahmed Mohammed",
            amount: 100,
            reference: transfer.reference,
          };
        })
      );

    console.log("FIRST :: ", transferData);

    const response = await fetch(`${process.env.CHAPA_API}/transfers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "This Month Salary!",
        currency: "ETB",
        bulk_data: transferData.filter((v) => v),
      }),
      redirect: "follow",
    })
      .then((response) => response.text())
      .then((result) => {
        console.log("LAST :: ", JSON.parse(result));
      })
      .catch((err) => {
        console.log("ERR :: ", err);
      });
    console.log(response);
    return { status: true };
  } catch {
    return { status: false, cause: "", message: "" };
  }
}
