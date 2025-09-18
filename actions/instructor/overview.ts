"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

type TOverviewData = {
  0: { label: string; value: number | string; status?: number }[];
  1: { label: string; value: number }[];
  2: { label: string; value: number }[];
  3: { label: string; seller: number; affiliate: number; own: number }[];
};

export async function getOverview({
  start,
  end,
  id,
}: {
  start: Date | undefined;
  end: Date | undefined;
  id?: string;
}): Promise<TOverviewData> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('Authentication required');
    }
    
    if (session.user.role !== 'instructor') {
      throw new Error('Instructor role required');
    }
    
    const data: TOverviewData = {
      0: [],
      1: [],
      2: [],
      3: [],
    };
    
    const thisMonthStartDate = new Date(),
      thisMonthEndDate = new Date(),
      lastMonthStartDate = new Date(),
      lastMonthEndDate = new Date();
    thisMonthStartDate.setDate(1);
    thisMonthEndDate.setMonth(thisMonthEndDate.getMonth() + 1);
    thisMonthEndDate.setDate(0);

    lastMonthStartDate.setMonth(lastMonthStartDate.getMonth() - 1);
    lastMonthStartDate.setDate(1);
    lastMonthEndDate.setDate(0);
    const totalOrders = await prisma.order.findMany({
        where: {
          status: "paid",
          course: { id, instructorId: session.user.id },
        },
        select: {
          user: { select: { gender: true, country: true } },
          course: { select: { id: true, instructorId: true } },
          date: true,
          instructorIncome: true,
          tx_ref: true,
          code: true,
        },
      }),
      totalEarn = totalOrders.reduce(
        (acc, c) => acc + Number(c.instructorIncome),
        0
      ),
      thisMonthOrders = totalOrders.filter(
        (v) => thisMonthStartDate <= v.date && v.date <= thisMonthEndDate
      ),
      lastMonthOrders = totalOrders.filter(
        (v) => lastMonthStartDate <= v.date && v.date <= lastMonthEndDate
      ),
      thisMonthEarn = thisMonthOrders.reduce(
        (acc, c) => acc + Number(c.instructorIncome),
        0
      ),
      lastMonthEarn = lastMonthOrders.reduce(
        (acc, c) => acc + Number(c.instructorIncome),
        0
      ),
      findStatus = (x: number, y: number) =>
        y == 0 ? (x == 0 ? 0 : 100) : Number((((x - y) / y) * 100).toFixed(2));
    data[0] = [
      ...(id
        ? []
        : [
            {
              label: "My Course",
              value: await prisma.course.count({
                where: { instructorId: session.user.id },
              }),
            },
          ]),
      {
        label: "Sale",
        value: totalOrders.length,
      },
      {
        label: "Earn",
        value: totalEarn,
      },
      {
        label: "ThisMonth Sale",
        value: thisMonthOrders.length,
        status: findStatus(thisMonthOrders.length, lastMonthOrders.length),
      },
      {
        label: "ThisMonth Earn",
        value: thisMonthEarn,
        status: findStatus(thisMonthEarn, lastMonthEarn),
      },
    ];

    data[1] = Object.entries(
      totalOrders.reduce(
        (acc, { user: { country } }) => ({
          ...acc,
          [country]: (acc[country] ?? 0) + 1,
        }),
        {} as { [index: string]: number }
      )
    ).map(([label, value]) => ({ label, value }));

    data[2] = Object.entries(
      totalOrders.reduce(
        (acc, { user: { gender } }) => ({
          ...acc,
          [gender ?? "unknown"]: (acc[gender ?? "unknown"] ?? 0) + 1,
        }),
        {} as { [index: string]: number }
      )
    ).map(([label, value]) => ({ label, value }));

    if (!start) {
      start = new Date();
    }
    if (!end) {
      end = new Date();
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    }
    const startDate = start.getDate(),
      startMonth = start.getMonth(),
      startYear = start.getFullYear(),
      endDate = end.getDate(),
      endMonth = end.getMonth(),
      endYear = end.getFullYear();
    let currentDate = startDate,
      currentMonth = startMonth,
      currentYear = startYear;
    if (currentYear === endYear && Math.abs(currentMonth - endMonth) == 0) {
      while (start > end ? currentDate >= endDate : currentDate <= endDate) {
        const currentNewDate = new Date(currentYear, currentMonth, currentDate),
          orders = await prisma.order.findMany({
            where: {
              status: "paid",
              course: { id, instructorId: session.user.id },
              AND: [
                { date: { gte: currentNewDate } },
                {
                  date: {
                    lt: new Date(
                      currentNewDate.getTime() + 24 * 60 * 60 * 1000
                    ),
                  },
                },
              ],
            },
          });
        data[3].push({
          label: currentNewDate.toDateString().slice(4, 10),
          affiliate: orders.filter((v) => v.tx_ref && v.code).length,
          seller: orders.filter((v) => !v.tx_ref && v.code).length,
          own: orders.filter((v) => v.tx_ref && !v.code).length,
        });
        if (start > end) {
          currentDate--;
        } else {
          currentDate++;
        }
      }
    } else {
      while (
        currentYear === endYear
          ? start > end
            ? currentMonth >= endMonth
            : currentMonth <= endMonth
          : true
      ) {
        const newStartDate = new Date(
            currentYear,
            currentMonth,
            currentYear === endYear && currentMonth === startMonth
              ? startDate
              : 1
          ),
          newEndDate = new Date(
            currentYear,
            currentMonth,
            currentYear === endYear && currentMonth === endMonth
              ? endDate
              : new Date(currentYear, currentMonth + 1, 0).getDate()
          ),
          orders = await prisma.order.findMany({
            where: {
              status: "paid",
              course: { id, instructorId: session.user.id },
              date: {
                gte: newStartDate,
                lte: newEndDate,
              },
            },
          });
        data[3].push({
          label: newStartDate.toDateString().slice(4, 7),
          affiliate: orders.filter((v) => v.tx_ref && v.code).length,
          seller: orders.filter((v) => !v.tx_ref && v.code).length,
          own: orders.filter((v) => v.tx_ref && !v.code).length,
        });
        if (start > end) {
          if (currentMonth === 0) {
            currentYear--;
            currentMonth = 11;
          } else {
            currentMonth--;
          }
        } else {
          if (currentMonth === 11) {
            currentYear++;
            currentMonth = 0;
          } else {
            currentMonth++;
          }
        }
      }
    }
    return data;
  } catch (error) {
    console.error('Error in getOverview:', error);
    throw error; // Re-throw the error instead of returning empty data
  }
}
