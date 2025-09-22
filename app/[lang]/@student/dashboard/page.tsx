"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { BookOpen, CheckCircle, Award, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/layout/Section";
import StatCard from "@/components/ui/StatCard";

// Mock data - replace with your actual data fetching logic
const enrolledCourses = [
  {
    id: "clxkz7x5q000416ofypx519jg",
    title: "Machine Learning A-Z",
    progress: 75,
    category: "Data Science",
  },
  {
    id: "clxkz7x5q000416ofypx519jh",
    title: "Python for Everybody",
    progress: 100,
    category: "Programming",
  },
  {
    id: "clxkz7x5q000416ofypx519ji",
    title: "Deep Learning Specialization",
    progress: 40,
    category: "Data Science",
  },
  {
    id: "clxkz7x5q000416ofypx519jj",
    title: "React - The Complete Guide",
    progress: 15,
    category: "Web Development",
  },
];
// Remove the old StatCard component as we're using the new one

function Page() {
  const { data: session } = useSession();
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  const user = session?.user;

  const coursesInProgress = enrolledCourses.filter(
    (c) => c.progress > 0 && c.progress < 100
  ).length;
  const completedCourses = enrolledCourses.filter(
    (c) => c.progress === 100
  ).length;

  const chartData = enrolledCourses.map((course) => ({
    name:
      course.title.substring(0, 15) + (course.title.length > 15 ? "..." : ""),
    Progress: course.progress,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${lang === "en" ? "Welcome back" : "እንኳን በደህና መጡ"} ${user?.name || "Student"}!`}
        subtitle={lang === "en" ? "Let's continue your learning journey." : "የመማር ድረስ እንቀጥል።"}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<BookOpen className="size-6" />}
          label={lang === "en" ? "Courses in Progress" : "በሂደት ላይ ያሉ ኮርሶች"}
          value={coursesInProgress}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          icon={<CheckCircle className="size-6" />}
          label={lang === "en" ? "Completed Courses" : "የተጠናቀቁ ኮርሶች"}
          value={completedCourses}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          icon={<Award className="size-6" />}
          label={lang === "en" ? "Certificates Earned" : "የተገኙ የምስክር ወረቀቶች"}
          value={completedCourses}
          trend={{ value: 25, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Progress Chart */}
        <Section
          title={lang === "en" ? "Course Progress" : "የኮርስ ሂደት"}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Progress" fill="rgb(14 165 233)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>

        {/* Continue Learning */}
        <Section
          title={lang === "en" ? "Continue Learning" : "መማርዎን ይቀጥሉ"}
          description={lang === "en" ? "Pick up where you left off" : "ያቆሙበትን ቦታ ይቀጥሉ"}
        >
          <div className="space-y-3">
            {enrolledCourses
              .filter((c) => c.progress < 100)
              .map((course) => (
                <Link href={`/${lang}/mycourse/${course.id}`} key={course.id}>
                  <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      {course.title}
                    </p>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        {course.category}
                      </span>
                      <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

export default Page;
