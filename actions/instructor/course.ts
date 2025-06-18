"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { TTableData } from "@/lib/definations";

export async function getCourses(tableData: TTableData) {
  let totalData = 0,
    totalPage = 0;
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error();

    const data = await prisma.course
      .findMany({
        where: {
          instructorId: session.user.id,
        },
        select: {
          id: true,
          titleAm: true,
          titleEn: true,
          thumbnail: true,
          status: true,
          order: {
            where: { status: "paid" },
            select: { instructorIncome: true },
          },
          _count: { select: { order: true } },
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
      .then((res) =>
        res.map(({ order, ...rest }) => ({
          ...rest,
          sale: order.length,
          earn: order.reduce(
            (acc, current) => acc + Number(current.instructorIncome),
            0
          ),
        }))
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
            default: {
              temp1 = `${a[tableData.sortDescriptor.column as keyof typeof a]}`;
              temp2 = `${b[tableData.sortDescriptor.column as keyof typeof b]}`;
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
      .then((res) =>
        res.slice(
          (tableData.currentPage - 1) * tableData.rowsPerPage,
          tableData.currentPage * tableData.rowsPerPage
        )
      );

    return { list: data, totalData, totalPage };
  } catch (error) {
    return { list: [], totalData, totalPage };
    console.log(error);
  }
}
