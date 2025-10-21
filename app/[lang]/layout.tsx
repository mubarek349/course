import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import React from "react";

type LayoutProps = {
  pending: React.ReactNode;
  inactive: React.ReactNode;
  manager: React.ReactNode;
  seller: React.ReactNode;
  affiliate: React.ReactNode;
  instructor: React.ReactNode;
  student: React.ReactNode;
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function Layout(props: LayoutProps) {
  await props.params; // Required by Next.js 15
  const session = await auth();
  if (!session) return props.children;

  const user = await prisma.user.findFirst({
    where: { id: session.user?.id || "unknown" },
    select: { status: true, role: true },
  });

  if (!user) return props.children;

  return user.status == "pending"
    ? props.pending
    : user.status == "inactive"
    ? props.inactive
    : session.user?.role === "manager"
    ? props.manager
    : session.user?.role === "seller"
    ? props.seller
    : session.user?.role === "affiliate"
    ? props.affiliate
    : session.user?.role === "instructor"
    ? props.instructor
    : session.user?.role === "student"
    ? props.student
    : props.children;
}
