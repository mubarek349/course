"use client";

import React from "react";
import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
};

const maxWidthClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl", 
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-none"
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-4 md:p-6",
  lg: "p-6 md:p-8"
};

export default function PageContainer({ 
  children, 
  className,
  maxWidth = "xl",
  padding = "md"
}: PageContainerProps) {
  return (
    <div className={cn(
      "mx-auto w-full space-y-6",
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}
