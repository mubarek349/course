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
    <div className="relative overflow-hidden h-dvh bg-primary-50 grid grid-cols-1 md:grid-cols-[auto_1fr]">
      <SideBar isSide={isSide} setIsSide={setIsSide} lists={list} />
      <div className="grid gap-2 grid-rows-[auto_1fr] overflow-hidden">
        <Header setIsSide={setIsSide} />
        {/* Added mobile-bottom-fix class for proper bottom padding on mobile */}
        <div className="px-2 md:px-5 pb-2 grid overflow-hidden mobile-bottom-fix">
          {children}
        </div>
      </div>
    </div>
  );
}