import UserLayout from "@/components/userLayout";
import { Book, ChartBarDecreasing } from "lucide-react";
import React from "react";

const studentNav = [
  { label: "Course", url: "course", icon: <Book className="size-5" /> },
  {
    label: "Progress",
    url: "progress",
    icon: <ChartBarDecreasing className="size-5" />,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserLayout list={studentNav}>
      <main>
        <h1 className="text-xl font-bold mb-4">Student Dashboard</h1>
        {children}
      </main>
    </UserLayout>
  );
}
