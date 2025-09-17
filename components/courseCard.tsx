"use client";

import { cn } from "@heroui/react";
import { Course, User } from "@prisma/client";
import { ChartBarIncreasing, Clock, Logs, Play } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

export default function CourseCardAffiliate({
  id,
  titleEn,
  titleAm,
  instructor,
  aboutEn,
  aboutAm,
  thumbnail,
  level,
  duration,
  _count: { activity },
  price,
  btn,
}: Omit<
  Course,
  | "video"
  | "currency"
  | "language"
  | "access"
  | "certificate"
  | "instructorRate"
  | "sellerRate"
  | "affiliateRate"
  | "price"
> & {
  price: number;
  instructor: Pick<User, "firstName" | "fatherName">;
  _count: { activity: number };
  btn: React.ReactNode;
}) {
  const searchParams = useSearchParams();
    const params = useParams<{ lang: string }>();
    const lang = params?.lang || "en";

  return (
    <div className="h-fit relative bg-background rounded-xl overflow-hidden  ">
      <Link
        href={`/${lang}/course/${id}?code=${searchParams?.get("code") || ""}`}
        style={{
          backgroundImage: `url('${thumbnail}')`,
        }}
        className="aspect-video bg-cover bg-center bg-no-repeat grid place-content-center=  "
      >
        <div className="bg-foreground/10 grid place-content-center">
          <div className="p-4 bg-foreground/50 rounded-full">
            <Play className="size-4 stroke-background fill-background" />
          </div>
        </div>
      </Link>
      <div className="px-5 divide-y divide-primary-600/20">
        <div className="py-2 grid gap-2 grid-rows-[auto_auto_1fr]  ">
          <Link
            href={`${lang}/course/${id}?code=${searchParams?.get("code") || ""}`}
            className="text-lg font-semibold "
          >
            {lang == "en" ? titleEn : titleAm}
          </Link>
          <p className="space-x-2">
            <span className="">{lang == "en" ? "course by" : "ኮርስ "}</span>
            <span className="font-bold">
              {lang == "en" ? "" : "በ"}
              {instructor.firstName} {instructor.fatherName}
            </span>
          </p>
          <p className="py-2 text-sm text-balance text-primary-600 ">
            {lang == "en" ? aboutEn : aboutAm}
          </p>
        </div>
        <div className="py-5 grid grid-cols-3 text-xs">
          {[
            {
              Icon: ChartBarIncreasing,
              title: lang == "en" ? "level" : "ደረጃ",
              value: level,
            },
            {
              Icon: Clock,
              title: lang == "en" ? "duration" : "ቆይታ",
              value: duration,
            },
            {
              Icon: Logs,
              title: lang == "en" ? "activities" : "እንቅስቃሴዎች",
              value: activity,
            },
          ].map(({ Icon, title, value }, i) => (
            <div key={i + ""} className="flex gap-2 items-center">
              <Icon className="size-8" />
              <div className="">
                <p className="text-primary-600">{title}</p>
                <p className="">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="py-5 grid">{btn}</div>
      </div>
      <div
        className={cn(
          "absolute top-0 right-0 px-5 py-2 rounded-bl-xl shadow-lg shadow-foreground/20",
          price > 0 ? "bg-background" : "bg-success-100 text-success-700"
        )}
      >
        {price > 0 ? `${price} ETB` : "Free "}
      </div>
    </div>
  );
}
