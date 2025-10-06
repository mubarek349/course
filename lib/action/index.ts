"use server";

import { cookies } from "next/headers";
import { StateType } from "../definations";
import { redirect } from "next/navigation";
import prisma from "../db";

export async function setLang(
  prevState: StateType,
  lang: "en" | "am" | undefined
): Promise<StateType> {
  try {
    if (!lang) return undefined;
    const cookieStore = await cookies();
    cookieStore.set("lang", lang);
    return { status: true };
  } catch (error) {
    console.log("ERROR :: ", error);
    return { status: false, cause: "", message: "" };
  }
}

export async function sendSMS(to: string, message: string) {
  const smsApi = process.env.SMS_API;
  if (!smsApi) throw new Error();
  await fetch(smsApi, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SMS_TOKEN}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.IDENTIFIER_ID,
      sender: process.env.SENDER_NAME,
      to,
      message,
      callback: process.env.CALLBACK,
    }),
  });
}

export async function sendSMSToCustomer(to: string, en: string, am: string) {
  await sendSMS(
    to,
    `Aselamualeykum dear customer!\n 
    You have successfully purchased ${en} lessons. 
    Continue your course on DARULKUBRA telegram bot, you can get the bot by following the link.\n
  
    አሰላሙዓለይኩም ውድ ደንበኛ!\n 
    የ${am} ትምህርት በተሳካ ሁኔታ ገዝተሃል። 
    በ ዳሩልኩብራ የተለግራም ቦት ላይ ኮርስዎን ይቀጥሉ, ሊንኩን በመከተል ቦት ማግኘት ይችላሉ\n
  
    ${process.env.BOT_URL}
    `
  );
}

export async function sendSMSToAffiliate(to: string, income: number) {
  await sendSMS(
    to,
    `Aselamualeykum dear Affiliate!\n 
    You have made a successful sale. You earned ${income} ETB from this sale.
    Continue to promote the link to the customer to earn more
  
    አሰላሙዓለይኩም ውድ ተባባሪ!\n 
    የተሳካ ሽያጭ አግኝተዋል። በዚህ ሽያጭ ${income} ETB ገቢ አግኝተዋል።
    ተጨማሪ ለማግኘት ከደንበኛ ጋር ያለውን አገናኝ ማስተዋወቅዎን ይቀጥሉ
  
    `
  );
}

export async function redirectToBot(prevState: StateType) {
  // Get the language from the URL or use default
  const lang = "en"; // Default language, you can make this dynamic if needed
  redirect(`/${lang}/student/mycourse`);
  return { status: true } as const;
  console.log(prevState);
}

export async function sendOTP(
  prevState: StateType,
  data: { phoneNumber: string } | undefined
): Promise<StateType> {
  try {
    if (!data) throw new Error();

    let otp = await prisma.otp.findFirst({
      where: { phoneNumber: data.phoneNumber },
    });
    if (otp) {
      otp = await prisma.otp.update({
        where: { id: otp.id },
        data: { code: Math.floor(1000 + Math.random() * 9000) },
      });
    } else {
      otp = await prisma.otp.create({
        data: {
          phoneNumber: data.phoneNumber,
          code: Math.floor(1000 + Math.random() * 9000),
        },
      });
    }

    await sendSMS(otp.phoneNumber, `CODE : ${otp.code}`);

    return { status: true };
  } catch {
    return { status: false, cause: "", message: "" };
  }
}
