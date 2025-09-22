"use client";

import React, { useState } from "react";
import Header from "./header";
import SideBar from "./sideBar";

export default function UserLayout({
  children,
  list,
}: {
  children: React.ReactNode;
  list: { label: string; url: string; icon: React.ReactNode }[];
}) {
  const [isSide, setIsSide] = useState(false);

  return (
    <div className="h-screen flex bg-gradient-to-br from-neutral-50 via-brand-50/20 to-neutral-100 dark:from-neutral-950 dark:via-brand-950/30 dark:to-neutral-900">
      <SideBar isSide={isSide} setIsSide={setIsSide} lists={list} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <div className="flex-shrink-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-30">
          <Header setIsSide={setIsSide} />
        </div>
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="min-h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
