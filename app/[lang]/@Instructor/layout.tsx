import React from "react";

import UserLayout from "@/components/userLayout";
import { Book, Gauge } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserLayout
      list={[
        { label: "Dashboard", url: "dashboard", icon: <Gauge /> },
        { label: "Course", url: "course", icon: <Book /> },
      ]}
    >
      {children}
    </UserLayout>
  );
}
