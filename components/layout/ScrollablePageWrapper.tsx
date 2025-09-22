"use client";

import React from "react";
import { cn } from "@/lib/utils";

type ScrollablePageWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ScrollablePageWrapper({ children, className }: ScrollablePageWrapperProps) {
  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-6">
      <div className={cn("mx-auto max-w-7xl", className)}>
        {children}
      </div>
    </div>
  );
}
