import React from "react";
import UserLayout from "@/components/userLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <UserLayout list={[]}>{children}</UserLayout>;
}
