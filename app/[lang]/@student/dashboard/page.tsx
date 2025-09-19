"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { BookOpen, CheckCircle, Award } from "lucide-react";
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
/* eslint-disable @typescript-eslint/no-explicit-any */
const StatCard = ({ icon, label, value, color }: any) => (
  <div className={`bg-white p-6 rounded-lg shadow flex items-center gap-4`}>
    <div className={`p-3 rounded-full ${color}`}>
      {React.cloneElement(icon, { className: "text-white" })}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

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
    <div className="p-1 md:p-6 overflow-auto   ">
      <h1 className="text-3xl font-bold mb-2">
        {lang === "en" ? "Welcome back" : "እንኳን በደህና መጡ"},{" "}
        {user?.name || "Student"}!
      </h1>
      <p className="text-gray-600 mb-8">
        {lang === "en"
          ? "Let's continue your learning journey."
          : "የመማር  እንቀጥል።"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<BookOpen />}
          label={lang === "en" ? "Courses in Progress" : "በሂደት ላይ ያሉ ኮርሶች"}
          value={coursesInProgress}
          color="bg-blue-500"
        />
        <StatCard
          icon={<CheckCircle />}
          label={lang === "en" ? "Completed Courses" : "የተጠናቀቁ ኮርሶች"}
          value={completedCourses}
          color="bg-green-500"
        />
        <StatCard
          icon={<Award />}
          label={lang === "en" ? "Certificates Earned" : "የተገኙ የምስክር ወረቀቶች"}
          value={completedCourses}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2  p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">
            {lang === "en" ? "Course Progress" : "የኮርስ ሂደት"}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Progress" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className=" p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">
            {lang === "en" ? "Continue Learning" : "መማርዎን ይቀጥሉ"}
          </h2>
          <div className="space-y-4">
            {enrolledCourses
              .filter((c) => c.progress < 100)
              .map((course) => (
                <Link href={`/${lang}/mycourse/${course.id}`} key={course.id}>
                  <div className="p-4 border rounded-lg hover:bg-gray-100 cursor-pointer">
                    <p className="font-semibold">{course.title}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-sm text-gray-500 mt-1">
                      {course.progress}%
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
