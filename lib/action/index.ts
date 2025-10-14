"use server";

import { cookies } from "next/headers";
import { StateType } from "../definations";
import { redirect } from "next/navigation";
import prisma from "../db";
import { auth } from "../auth";

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
  const smsToken = process.env.SMS_TOKEN;

  if (!smsApi) {
    console.error("❌ SMS_API is not configured in environment variables");
    throw new Error("SMS API not configured");
  }

  if (!smsToken) {
    console.error("❌ SMS_TOKEN is not configured in environment variables");
    throw new Error("SMS Token not configured");
  }

  console.log("📤 Sending SMS to:", to);
  console.log("📤 SMS API:", smsApi);

  try {
    const response = await fetch(smsApi, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${smsToken}`,
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ SMS API Error:", response.status, errorText);
      throw new Error(`SMS API returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ SMS sent successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ Failed to send SMS:", error);
    throw error;
  }
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

export async function getCurrentUserPhoneNumber() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: false, message: "Not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { phoneNumber: true, id: true },
    });

    if (!user) {
      return { status: false, message: "User not found" };
    }

    return { status: true, phoneNumber: user.phoneNumber, userId: user.id };
  } catch (error) {
    console.error("Error getting current user phone number:", error);
    return { status: false, message: "Failed to get user phone number" };
  }
}

export async function sendOTP(
  prevState: StateType,
  data: { phoneNumber: string } | undefined
): Promise<StateType> {
  try {
    if (!data) {
      console.error("❌ No data provided to sendOTP");
      return { status: false, cause: "no_data", message: "No data provided" };
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    console.log("📱 Generating OTP for:", data.phoneNumber);

    // Find or create OTP record
    let otp = await prisma.otp.findFirst({
      where: { phoneNumber: data.phoneNumber },
    });

    if (otp) {
      otp = await prisma.otp.update({
        where: { id: otp.id },
        data: { code: otpCode },
      });
      console.log("✅ OTP updated in database");
    } else {
      otp = await prisma.otp.create({
        data: {
          phoneNumber: data.phoneNumber,
          code: otpCode,
        },
      });
      console.log("✅ OTP created in database");
    }

    // Try to send SMS
    try {
      await sendSMS(
        otp.phoneNumber,
        `Your one-time OTP code is: ${otp.code}\n\nDo not share your OTP with anyone\n\nThank you for choosing Darulkubra!`
      );
      console.log("✅ OTP SMS sent successfully to:", otp.phoneNumber);
      console.log("🔑 OTP Code:", otp.code);
      return { status: true, message: "OTP sent successfully" };
    } catch (smsError) {
      console.error("❌ Failed to send SMS:", smsError);
      // Still return success because OTP is generated and saved
      // The user can still verify with the OTP code
      console.log("⚠️ SMS failed but OTP is saved. OTP Code:", otp.code);
      return {
        status: true,
        message:
          "OTP generated (SMS may not have been sent - check console for code)",
      };
    }
  } catch (error) {
    console.error("❌ Error in sendOTP:", error);
    return {
      status: false,
      cause: "unknown_error",
      message: error instanceof Error ? error.message : "Failed to send OTP",
    };
  }
}
