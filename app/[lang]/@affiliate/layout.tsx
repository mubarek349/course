import UserLayout from "@/components/userLayout";
import { Book, ChartBarDecreasing } from "lucide-react";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserLayout
      list={[
        { label: "Course", url: "course", icon: <Book className="size-5" /> },
        {
          label: "Progress",
          url: "progress",
          icon: <ChartBarDecreasing className="size-5" />,
        },
      ]}
    >
      {children}
    </UserLayout>
  );
}
