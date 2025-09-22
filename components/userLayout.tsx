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
    <div className="h-screen overflow-hidden grid grid-cols-[auto_1fr] bg-gradient-to-br from-neutral-50 via-brand-50/20 to-neutral-100 dark:from-neutral-950 dark:via-brand-950/30 dark:to-neutral-900">
      <SideBar isSide={isSide} setIsSide={setIsSide} lists={list} />
      <div className="grid grid-rows-[auto_1fr] h-full">
        <Header setIsSide={setIsSide} />
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
