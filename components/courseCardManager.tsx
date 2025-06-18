import { Course } from "@prisma/client";
import React from "react";

export default function CourseCardManager({}: Omit<
  Course,
  | "video"
  | "price"
  | "currency"
  | "language"
  | "access"
  | "certificate"
  | "sellerRate"
  | "affiliateRate"
> & {
  _count: { activity: number };
  label: string;
  action: () => void;
}) {
  return <div className="grid place-content-center">CourseManager</div>;
}
