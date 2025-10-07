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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative">
      {/* Professional background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:20px_20px] opacity-60" />
      
      <SideBar isSide={isSide} setIsSide={setIsSide} lists={list} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <Header setIsSide={setIsSide} isCollapsed={isCollapsed} />
      <main className={cn(
        "pt-16 transition-all duration-300 relative",
        "bg-gradient-to-br from-white/60 via-white/80 to-white/90 dark:from-slate-900/60 dark:via-slate-800/80 dark:to-slate-700/90",
        "backdrop-blur-sm",
        isCollapsed ? "md:ml-20" : "md:ml-72"
      )}>
        <div className="px-4 md:px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
