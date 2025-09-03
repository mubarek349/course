"use client";

import useData from "@/hooks/useData";
import { getCoursesForCustomer } from "@/lib/data/course";
import React from "react";
import Loading from "@/components/loading";
import NoData from "@/components/noData";
import CourseCard from "@/components/courseCard";
import { useParams, useSearchParams } from "next/navigation";
import { Button, Link } from "@heroui/react";

export default function Page() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang ?? "en";
  const searchParams = useSearchParams();
  const { data, loading } = useData({
    func: getCoursesForCustomer,
    args: [],
  });

  return (
    <div className="h-dvh">
      {loading ? (
        <Loading />
      ) : !data || data.length <= 0 ? (
        <NoData />
      ) : (
        <div className="z-30 px-4 py-20 md:px-10 md:py-24 min-h-full grid gap-5 grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 ">
          {data.map(({ id, ...value }, i) => (
            <CourseCard
              key={i + ""}
              {...{ ...value, id }}
              btn={
                <Button
                  color="primary"
                  as={Link}
                  href={`/${lang}/course/${id}`}
                  className=""
                >
                  {lang == "en" ? "Enroll" : "ይመዝገቡ"}
                </Button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
