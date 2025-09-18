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
    <div className="relative h-screen bg-primary-50 grid grid-cols-1 md:grid-cols-[auto_1fr] overflow-hidden">
      <SideBar isSide={isSide} setIsSide={setIsSide} lists={list} />
      <div className="flex flex-col h-full overflow-hidden">
        <Header setIsSide={setIsSide} />
        <div className="px-2 md:px-5 pb-2 flex-1 overflow-y-auto scrollable">
          {children}
        </div>
      </div>
    </div>
  );
}