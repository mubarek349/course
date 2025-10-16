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
import { Header } from "@/components/guest/header";
import { Footer } from "@/components/guest/footer";

export default function Page() {
  const params = useParams<{ lang: string }>(),
    lang = params?.lang ?? "en",
    searchParams = useSearchParams(),
    { data, loading } = useData({
      func: getCoursesForCustomer,
      args: [],
    });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-gradient-to-b from-white to-sky-50">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loading />
          </div>
        ) : !data || data.length <= 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <NoData />
          </div>
        ) : (
          <section className="py-20">
            <div className="container mx-auto px-4">
              {/* Page Header */}
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                  {lang === "en" ? "Our Courses" : "ኮርሶቻችን"}
                </h1>
                <p className="text-lg text-default-600 max-w-2xl mx-auto">
                  {lang === "en"
                    ? "Explore our comprehensive range of courses designed to help you achieve your learning goals"
                    : "የእርስዎን የመማሪያ ግቦች ለማሳካት የተነደፉ ሰፊ ኮርሶችን ይመልከቱ"}
                </p>
              </div>

              {/* Courses Grid */}
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
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
