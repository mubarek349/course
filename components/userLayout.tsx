"use client";

import React, { useState } from "react";
import Header from "./header";
import SideBar from "./sideBar";
import { cn } from "@/lib/utils";

export default function UserLayout({
  children,
  list,
}: {
  children: React.ReactNode;
  list: { label: string; url: string; icon: React.ReactNode }[];
}) {
  const [isSide, setIsSide] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen  bg-gradient-to-br from-neutral-50 via-brand-50/20 to-neutral-100 dark:from-neutral-950 dark:via-brand-950/30 dark:to-neutral-900">
      <SideBar isSide={isSide} setIsSide={setIsSide} lists={list} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <Header setIsSide={setIsSide} isCollapsed={isCollapsed} />
      <main className={cn(
        "pt-16 transition-all duration-300",
        isCollapsed ? "md:ml-20" : "md:ml-72"
      )}>
        <div className="px-4 md:px-6 py-4">
          {children}
        </div>
      </main>
    </div>
  );
}
