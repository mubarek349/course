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
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-primary-50/30 dark:from-background dark:via-background dark:to-primary-950/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed top-20 right-20 w-32 h-32 bg-primary-100/30 dark:bg-primary-900/20 rounded-full blur-3xl"></div>
      <div className="fixed bottom-20 left-20 w-40 h-40 bg-success-100/30 dark:bg-success-900/20 rounded-full blur-3xl"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-100/20 dark:bg-secondary-900/10 rounded-full blur-3xl"></div>
      
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loading />
        </div>
      ) : !data || data.length <= 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <NoData />
        </div>
      ) : (
        <div className="w-full px-4 py-20 md:px-10 md:py-24 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground dark:text-white bg-gradient-to-r from-primary-600 via-primary-700 to-success-600 dark:from-primary-400 dark:via-primary-300 dark:to-success-400 bg-clip-text text-transparent">
                {lang === "en" ? "Our Courses" : "ኮርሶቻችን"}
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-primary-500 via-primary-600 to-success-500 dark:from-primary-400 dark:via-primary-500 dark:to-success-400 rounded-full shadow-lg dark:shadow-primary-500/50 mx-auto"></div>
              <p className="text-foreground/70 dark:text-foreground/60 max-w-2xl mx-auto">
                {lang === "en" 
                  ? "Explore our comprehensive Islamic education courses taught by expert instructors" 
                  : "በባለሙያ አስተማሪዎች የሚያስተምሩ አጠቃላይ የኢስላማዊ ትምህርት ኮርሶችን ያስሱ"}
              </p>
            </div>

            {/* Course Grid */}
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
                      className="w-full bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-700 dark:hover:to-primary-800 shadow-lg hover:shadow-xl dark:shadow-primary-900/50 transition-all duration-300 hover:scale-[1.02] font-bold"
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
