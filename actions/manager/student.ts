"use server";

import prisma from "@/lib/db";
import { StateType, TStudent, TTableData } from "@/lib/definations";
import bcryptjs from "bcryptjs";
import { Selection } from "@heroui/react";
import { $Enums } from "@prisma/client";

export async function registerStudent(
  prevState: StateType,
  data: TStudent | undefined
): Promise<StateType> {
  try {
    if (!data) throw new Error();
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
          ...rest,
          role: "student",
          age: Number(rest.age),
          password: await bcryptjs.hash(password ?? rest.firstName, 12),
        },
      });
    }
    return { status: true };
  } catch {
    return { status: false, cause: "", message: "" };
  }
}

export async function getStudents(
  tableData: TTableData & { status: Selection }
) {
  try {
    let totalData = 0,
      totalPage = 0;
    const students = await prisma.user
      .findMany({
        where: {
          role: "student",
          ...([...tableData.status].length > 0
            ? { status: { in: [...tableData.status] as $Enums.UserStatus[] } }
            : {}),
        },
        select: {
          id: true,
          firstName: true,
          fatherName: true,
          lastName: true,
          phoneNumber: true,
          age: true,
          gender: true,
          country: true,
          region: true,
          city: true,
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
      );
    return { list: students, totalData, totalPage };
  } catch (error) {
    throw error;
  }
}

export async function removeStudent(
  prevState: StateType,
  id: string | undefined
): Promise<StateType> {
  try {
    if (!id) throw new Error();
    await prisma.user.delete({ where: { id } });
    return { status: true };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { status: false, cause: "", message: "" };
  }
}

export async function getStudentCourses(
  tableData: TTableData & { id: string }
) {
  try {
    let totalData = 0,
      totalPage = 0;
    const data = await prisma.order
      .findMany({
        where: { userId: tableData.id },
        select: {
          id: true,
          course: {
            select: { id: true, titleEn: true, titleAm: true, thumbnail: true },
          },
          img: true,
          tx_ref: true,
          reference: true,
          code: true,
        },
      })
      .then((res) => {
        const temp = res.filter((v) =>
          `${v.course.titleEn} ${v.course.titleAm}`
            .toLowerCase()
            .includes(tableData.search.toLowerCase())
        );
        totalData = temp.length;
        totalPage = Math.ceil(totalData / tableData.rowsPerPage);
        return temp;
      })
      .then((res) =>
        res.sort((a, b) => {
          let temp1 = "",
            temp2 = "";
          switch (tableData.sortDescriptor.column) {
            case "title": {
              temp1 = `${a.course.titleEn} ${a.course.titleAm}`;
              temp2 = `${b.course.titleEn} ${b.course.titleAm}`;
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
      )
      .then((res) =>
        res.map(async (v) => ({
          ...v,
          ...(v.code
            ? {
                seller: await prisma.user.findFirst({
                  where: { code: v.code },
                  select: {
                    id: true,
                    firstName: true,
                    fatherName: true,
                    lastName: true,
                    role: true,
                  },
                }),
              }
            : {}),
        }))
      );
    return { list: await Promise.all(data), totalData, totalPage };
  } catch (error) {
    throw error;
  }
}
