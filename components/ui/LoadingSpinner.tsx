"use client";

import React from "react";
import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-8",
    lg: "size-12"
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-brand-200 border-t-brand-600 dark:border-brand-800 dark:border-t-brand-400", sizeClasses[size], className)} />
  );
}
