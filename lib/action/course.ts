"use server";

import prisma from "../db";
import { StateType, TAffiliateSelf, TCourse } from "../definations";
import bcryptjs from "bcryptjs";

export async function courseRegistration(
  prevState: StateType,
  data: TCourse | undefined
): Promise<StateType> {
  try {
    if (!data) return undefined;
    const { id, courseFor, requirement, activity, ...rest } = data;

    await prisma.course.updateMany({
      where: { channelId: rest.channelId },
      data: { channelId: null },
    });
    // .then((res) => {
    //   console.log(res.count);
    // });

    if (id) {
      await prisma.courseFor.deleteMany({ where: { courseId: id } });
      await prisma.requirement.deleteMany({ where: { courseId: id } });
      await prisma.activity.deleteMany({ where: { courseId: id } });
      await prisma.course.update({
        where: { id },
        data: {
          ...rest,
          courseFor: { create: courseFor },
          requirement: { create: requirement },
          activity: {
            create: activity.map(({ titleAm, titleEn, subActivity }) => ({
              titleAm,
              titleEn,
              subActivity: { create: subActivity },
            })),
          },
        },
      });
    } else {
      const courseId = await prisma.course
        .create({ data: rest })
        .then((v) => v.id);
      if (courseId) {
        courseFor.forEach(async (v) => {
          await prisma.courseFor.create({ data: { ...v, courseId } });
        });
        requirement.forEach(async (v) => {
          await prisma.requirement.create({ data: { ...v, courseId } });
        });
        activity.forEach(async ({ subActivity, ...v }) => {
          await prisma.activity.create({
            data: { ...v, courseId, subActivity: { create: subActivity } },
          });
        });
      }
    }

    return { status: true } as const;
  } catch (error) {
    console.log(error);
    return { status: false, cause: "", message: "" } as const;
  }
}

export async function changeRate(
  prevState: StateType,
  data:
    | {
        userId: string;
        courseId: string;
        rate: number;
      }
    | undefined
): Promise<StateType> {
  try {
    if (!data) throw new Error();
    const { userId, courseId, rate } = data,
      incomeRate = await prisma.incomeRate.findFirst({
        where: { userId, courseId },
      });
    if (incomeRate) {
      await prisma.incomeRate.update({
        where: { id: incomeRate.id },
        data: { rate },
      });
    } else {
      await prisma.incomeRate.create({ data: { userId, courseId, rate } });
    }
    return { status: true };
  } catch (error) {
    console.log(error);
    return { status: false, cause: "", message: "" };
  }
}

export async function sellerRegistration(
  prevState: StateType,
  data:
    | {
        id?: string;
        firstName: string;
        fatherName: string;
        lastName: string;
        phoneNumber: string;
        password?: string;
      }
    | undefined
): Promise<StateType> {
  try {
    if (!data) throw new Error();
    const { id, firstName, fatherName, lastName, phoneNumber, password } = data;
    if (id) {
      await prisma.user.update({
        where: { id },
        data: {
          firstName,
          fatherName,
          lastName,
          phoneNumber,
          ...(password ? { password: await bcryptjs.hash(password, 12) } : {}),
        },
      });
      return { status: true };
    } else {
      await prisma.user.create({
        data: {
          role: "seller",
          firstName,
          fatherName,
          lastName,
          phoneNumber,
          password: await bcryptjs.hash(password || firstName, 12),
        },
      });
      return { status: true };
    }
  } catch (error) {
    console.log(error);
    return { status: false, cause: "", message: "" };
  }
}

export async function removeSeller(
  prevState: StateType,
  id: string | undefined
): Promise<StateType> {
  try {
    if (!id) throw new Error();
    await prisma.user.delete({ where: { id } });
    return { status: true };
  } catch (error) {
    console.log(error);
    return { status: false, cause: "", message: "" };
  }
}

export async function affiliateRegistration(
  prevState: StateType,
  data: TAffiliateSelf | undefined
): Promise<StateType> {
  try {
    if (!data) throw new Error();
    const { code, password, phoneNumber, ...rest } = data;
    const oldOtp = await prisma.otp.findFirst({ where: { phoneNumber } });
    if (`${oldOtp?.code}` !== code) throw new Error();
    await prisma.user.create({
      data: {
        ...rest,
        role: "affiliate",
        phoneNumber,
        age: Number(rest.age),
        password: await bcryptjs.hash(password, 12),
        status: "pending",
      },
    });
    return { status: true };
  } catch (error) {
    console.log("ERROR >> ", error);
    return { status: false, cause: "", message: "" };
  }
}
