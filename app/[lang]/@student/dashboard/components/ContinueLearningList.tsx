"use client";

import React from "react";
import Link from "next/link";

interface Course {
  id: string;
  titleEn: string;
  titleAm: string;
  thumbnail: string;
  progress: number;
  totalSubActivities: number;
  completedSubActivities: number;
  category: string;
}

interface ContinueLearningListProps {
  courses: Course[];
  lang: string;
}

export default function ContinueLearningList({
  courses,
  lang,
}: ContinueLearningListProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="p-6 text-center text-neutral-500 dark:text-neutral-400">
        <p>
          {lang === "en" ? "No courses in progress" : "ምንም በሂደት ላይ ያሉ ኮርሶች የሉም"}
        </p>
        <p className="text-sm mt-2">
          {lang === "en"
            ? "Start a new course to see it here"
            : "አዲስ ኮርስ ይጀምሩ እዚህ ለማየት"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {courses.map((course) => (
        <Link href={`/${lang}/mycourse/${course.id}`} key={course.id}>
          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors">
            <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {lang === "en" ? course.titleEn : course.titleAm}
            </p>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-2">
              <div
                className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-600 dark:text-neutral-400 capitalize">
                {course.category}
              </span>
              <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                {course.progress}%
              </span>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              {course.completedSubActivities} / {course.totalSubActivities}{" "}
              {lang === "en" ? "lessons completed" : "ትምህርቶች ተጠናቅቀዋል"}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
