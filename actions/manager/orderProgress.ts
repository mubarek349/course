"use server";

import prisma from "@/lib/db";
import { TTableData } from "@/lib/definations";

export async function getProgress(
  tableData: TTableData & { id: string; date: { start: Date; end: Date } }
) {
  try {
    let totalData = 0,
      totalPage = 0;
    const user = await prisma.user.findFirst({ where: { id: tableData.id } });
    if (user) {
      const data = await prisma.course
        .findMany({
          where: {},
          select: {
            id: true,
            titleEn: true,
            titleAm: true,
            order: {
              where: { code: user.code },
              select: {
                id: true,
                date: true,
                income: true,
              },
            },
            incomeRate: {
              where: { userId: user.id },
              select: { id: true, rate: true },
            },
          },
        })
        .then((res) => {
          const temp = res.filter((v) =>
            `${v.titleEn} ${v.titleAm}`
              .toLowerCase()
              .includes(tableData.search.toLowerCase())
          );
          totalData = temp.length;
          totalPage = Math.ceil(totalData / tableData.rowsPerPage);
          return temp;
        })
        .then((res) => {
          const today = new Date();
          return res.map(({ order, incomeRate, ...rest }) => {
            const thisMonthData = order.filter(
                (v) =>
                  v.date.getFullYear() === today.getFullYear() &&
                  v.date.getMonth() === today.getMonth()
              ),
              filteredData = order.filter(
                (v) =>
                  (v.date.toString().slice(4, 15) >
                    tableData.date.start.toString().slice(4, 15) &&
                    v.date.toString().slice(4, 15) <
                      tableData.date.end.toString().slice(4, 15)) ||
                  (v.date.toString().slice(4, 15) <
                    tableData.date.start.toString().slice(4, 15) &&
                    v.date.toString().slice(4, 15) >
                      tableData.date.end.toString().slice(4, 15))
              );
            return {
              ...rest,
              incomeRate: incomeRate?.[0]
                ? {
                    id: incomeRate[0].id,
                    rate: Number(incomeRate[0].rate),
                  }
                : undefined,
              totalSale: order.length,
              totalIncome: order.reduce(
                (acc, current) => acc + Number(current.income),
                0
              ),
              filteredSale: filteredData.length,
              filteredIncome: filteredData.reduce(
                (acc, current) => acc + Number(current.income),
                0
              ),
              thisMonthSale: thisMonthData.length,
              thisMonthIncome: thisMonthData.reduce(
                (acc, current) => acc + Number(current.income),
                0
              ),
            };
          });
        })
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
                temp1 = `${a.titleEn} ${a.titleAm}`;
                temp2 = `${b.titleEn} ${b.titleAm}`;
                break;
              }
              case "incomeRate": {
                temp1 = `${a.incomeRate?.rate}`;
                temp2 = `${b.incomeRate?.rate}`;
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
        );
      return { list: data, totalData, totalPage };
    }
    throw new Error("Invalid session");
  } catch (error) {
    throw error;
  }
}
