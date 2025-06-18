"use server";
import prisma from "../db";

export async function getInstructorsForManager(
  search: string,
  currentPage: number,
  rowsPerPage: number
) {
  let totalData = 0,
    totalPage = 0;
  try {
    const data = await prisma.user
      .findMany({
        where: {
          role: "instructor",
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
            .includes(search.toLowerCase())
        );
        totalData = temp.length;
        totalPage = Math.ceil(totalData / rowsPerPage);
        return temp;
      })
      .then((res) =>
        res.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
      );
    return { list: data ?? [], totalData, totalPage };
  } catch {
    return { list: [], totalData, totalPage };
  }
}

// this is a function to get single student data
export async function getInstructorForManager(id: string) {
  try {
    const student = await prisma.user.findFirst({
      where: { id, role: "instructor" },
    });

    return student;
  } catch (error) {
    console.error("Error fetching student:", error);
    return null;
  }
}

// export async function getInstructorsForCourse() {
//   try {
//     const instructors = await prisma.user.findMany({
//       where: {
//         role: "instructor",
//         courses: {
//           some: {
//             id: courseId,
//           },
//         },
//       },
//       select: {
//         id: true,
//         firstName: true,
//         fatherName: true,
//         lastName: true,
//       },
//     });
//     return instructors;
//   } catch (error) {
//     console.error("Error fetching instructors for course:", error);
//     return [];
//   }
// }

export async function getInstructorsList() {
  const data = await prisma.user.findMany({
    where: { role: "instructor" },
    select: { id: true, firstName: true, fatherName: true, lastName: true },
  });

  return data;
}
