"use server";

import prisma from "@/lib/db";
import { StateType, TTableData } from "@/lib/definations";
import { Selection } from "@heroui/react";
import { $Enums } from "@prisma/client";
import bcryptjs from "bcryptjs";

export async function registerInstructor(
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
    if (!data) return undefined;
    const { id, firstName, fatherName, lastName, phoneNumber, password } = data;
    if (id) {
      await prisma.user.update({
        where: { id, role: "instructor" },
        data: {
          firstName,
          fatherName,
          lastName,
          phoneNumber,
          ...(password ? { password: await bcryptjs.hash(password, 12) } : {}),
        },
      });
    } else if (password) {
      await prisma.user.create({
        data: {
          role: "instructor",
          firstName,
          fatherName,
          lastName,
          phoneNumber,
          password: await bcryptjs.hash(password || firstName, 12),
        },
      });
    } else throw new Error();
    return { status: true };
  } catch {
    return { status: false, cause: "", message: "" };
  }
}

export async function getInstructorsList() {
  const data = await prisma.user.findMany({
    where: { role: "instructor" },
    select: { id: true, firstName: true, fatherName: true, lastName: true },
  });

  return data;
}

export async function getInstructors(
  tableData: TTableData & { status: Selection }
) {
  let totalData = 0,
    totalPage = 0;
  try {
    const data = await prisma.user
      .findMany({
        where: {
          role: "instructor",
          ...((temp) =>
            temp.length > 0
              ? { status: { in: temp as $Enums.UserStatus[] } }
              : {})(Array.from(tableData.status)),
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
        const temp = res.filter((v) =>
          `${v.firstName} ${v.fatherName} ${v.lastName} ${v.phoneNumber} `
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
              temp1 = `${a.firstName} ${a.firstName} ${a.firstName} `;
              temp2 = `${b.firstName} ${b.firstName} ${b.firstName} `;
              break;
            }
            case "phonNumber": {
              temp1 = `${a.phoneNumber}`;
              temp2 = `${b.phoneNumber}`;
              break;
            }
            default: {
              temp1 = `${a[tableData.sortDescriptor.column as keyof typeof a]}`;
              temp2 = `${b[tableData.sortDescriptor.column as keyof typeof b]}`;
            }
          }

          return temp1 !== null && temp2 !== null
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

    return { list: data ?? [], totalData, totalPage };
  } catch (error) {
    throw error;
  }
}

export async function getInstructor(id: string) {
  const instructor = await prisma.user.findFirst({
    where: { id, role: "instructor" },
  });

  return instructor;
}

export async function removeInstructor(
  prevState: StateType,
  id: string | undefined
): Promise<StateType> {
  try {
    if (!id) return undefined;
    await prisma.user.delete({ where: { id, role: "instructor" } });
    return { status: true };
  } catch {
    return { status: false, cause: "", message: "" };
  }
}
