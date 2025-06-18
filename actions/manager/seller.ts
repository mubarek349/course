"use server";

import prisma from "@/lib/db";
import { StateType, TSeller, TTableData } from "@/lib/definations";
import { Selection } from "@heroui/react";
import { $Enums } from "@prisma/client";
import bcryptjs from "bcryptjs";

export async function registerSeller(
  prevState: StateType,
  data: TSeller | undefined
): Promise<StateType> {
  try {
    if (!data) throw new Error("No data to update");
    const { id, password, ...rest } = data;
    if (id) {
      await prisma.user.update({
        where: { id },
        data: {
          ...rest,
          age: Number(rest.age),
          ...(password ? { password: await bcryptjs.hash(password, 12) } : {}),
        },
      });
    } else {
      await prisma.user.create({
        data: {
          role: "seller",
          ...rest,
          age: Number(rest.age),
          status: "active",
          password: await bcryptjs.hash(password || rest.firstName, 12),
        },
      });
    }
    return { status: true };
  } catch (error) {
    console.error("Error updating student:", error);
    return { status: false, cause: "", message: "" };
  }
}

export async function getSellers(
  tableData: TTableData & {
    status: Selection;
    date: { start: Date; end: Date };
  }
) {
  try {
    let totalData = 0,
      totalPage = 0;
    const date = tableData.date,
      today = new Date();

    const data = await Promise.all(
      await prisma.user
        .findMany({
          where: {
            role: "seller",
            ...((arr) =>
              arr.length > 0
                ? {
                    status: {
                      in: arr as $Enums.UserStatus[],
                    },
                  }
                : {})(Array.from(tableData.status)),
          },
          select: {
            id: true,
            firstName: true,
            fatherName: true,
            lastName: true,
            code: true,
            status: true,
          },
        })
        .then((res) => {
          //   console.log(">> ", res);
          const temp = res.filter((v) =>
            `${v.firstName} ${v.fatherName} ${v.lastName}`
              .toLowerCase()
              .includes(tableData.search.toLowerCase())
          );
          totalData = temp.length;
          totalPage = Math.ceil(totalData / tableData.rowsPerPage);
          return temp;
        })
        .then(
          async (res) =>
            await Promise.all(
              res.map(async (value) => {
                const order = await prisma.order.findMany({
                    where: {
                      code: value.code,
                      tx_ref: { not: null },
                      // ...((v) =>
                      //   v.length > 0 ? { courseId: { in: v as string[] } } : {})(
                      //   Array.from(tableData.courseId)
                      // ),
                    },
                    select: { income: true, date: true },
                  }),
                  filteredData = order.filter(
                    (v) =>
                      (v.date.toString().slice(4, 15) >
                        date.start.toString().slice(4, 15) &&
                        v.date.toString().slice(4, 15) <
                          date.end.toString().slice(4, 15)) ||
                      (v.date.toString().slice(4, 15) <
                        date.start.toString().slice(4, 15) &&
                        v.date.toString().slice(4, 15) >
                          date.end.toString().slice(4, 15))
                  ),
                  thisMonthData = order.filter(
                    (v) =>
                      v.date.getFullYear() == today.getFullYear() &&
                      v.date.getMonth() == today.getMonth()
                  );
                return {
                  ...value,
                  totalSale: order.length,
                  totalIncome: order.reduce((a, c) => a + Number(c.income), 0),
                  filteredSale: filteredData.length,
                  filteredIncome: filteredData.reduce(
                    (a, c) => a + Number(c.income),
                    0
                  ),
                  thisMonthSale: thisMonthData.length,
                  thisMonthIncome: thisMonthData.reduce(
                    (a, c) => a + Number(c.income),
                    0
                  ),
                };
              })
            )
        )
        .then((res) =>
          res.slice(
            (tableData.currentPage - 1) * tableData.rowsPerPage,
            tableData.currentPage * tableData.rowsPerPage
          )
        )
        .then((res) =>
          res.sort((a, b) => {
            let temp1 = "",
              temp2 = "";
            switch (tableData.sortDescriptor.column) {
              case "name": {
                temp1 = `${a.firstName} ${a.fatherName} ${a.lastName}`;
                temp2 = `${b.firstName} ${b.fatherName} ${b.lastName}`;
                break;
              }
              default: {
                temp1 = `${
                  a[tableData.sortDescriptor.column as keyof typeof a]
                }`;
                temp2 = `${
                  b[tableData.sortDescriptor.column as keyof typeof b]
                }`;
              }
            }
            return temp1 !== undefined && temp2 !== undefined
              ? tableData.sortDescriptor.direction == "ascending"
                ? temp1 > temp2
                  ? -1
                  : temp1 < temp2
                  ? 1
                  : 0
                : temp1 > temp2
                ? 1
                : temp1 < temp2
                ? -1
                : 0
              : 0;
          })
        )
    );
    // console.log("DATA >> ", data);
    return { list: data, totalData, totalPage };
  } catch (error) {
    // console.log("ERROR >> ", error);
    throw error;
  }
}

export async function getSeller(id: string) {
  try {
    const student = await prisma.user.findFirst({
      where: { id, role: "seller" },
    });

    return student;
  } catch (error) {
    console.error("Error fetching student:", error);
    return null;
  }
}

export async function removeSeller(
  prevState: StateType,
  id: string | undefined
): Promise<StateType> {
  if (!id) return undefined;
  try {
    await prisma.user.delete({ where: { role: "seller", id } });
    return { status: true };
  } catch {
    return { status: false, cause: "", message: "" };
  }
}
