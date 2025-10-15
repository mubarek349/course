"use client";

import useData from "@/hooks/useData";
import { getCoursesForCustomer } from "@/lib/data/course";
import React from "react";
import Loading from "@/components/loading";
import NoData from "@/components/noData";
import CourseCard from "@/components/courseCard";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";
import Link from "next/link";

export default function Page() {
  const params = useParams<{ lang: string }>(),
    lang = params?.lang ?? "en",
    searchParams = useSearchParams(),
    { data, loading } = useData({
      func: getCoursesForCustomer,
      args: [],
    });

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-blue-50">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loading />
        </div>
      ) : !data || data.length <= 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <NoData />
        </div>
      ) : (
        <div className="w-full px-4 py-20 md:px-10 md:py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
              {lang === "en" ? "Our Courses" : "ኮርሶቻችን"}
            </h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {data.map(({ id, ...value }, i) => (
                <CourseCard
                  key={i + ""}
                  {...{ ...value, id }}
                  btn={
                    <Link
                      href={`/${lang}/course/${id}?code=${
                        searchParams?.get("code") || ""
                      }`}
                      className="w-full"
                    >
                      <Button color="primary" className="w-full">
                        {lang == "en" ? "Get Started" : "መማር ጀምር"}
                      </Button>
                    </Link>
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
