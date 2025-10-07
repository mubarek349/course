"use client";

import React from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
};

export default function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 md:mb-8",
        "rounded-2xl border border-gray-200/60 dark:border-gray-700/60",
        "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg dark:shadow-xl relative overflow-hidden",
        "px-4 md:px-6 py-4 md:py-5",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-50/20 before:via-transparent before:to-purple-50/10 dark:before:from-blue-950/10 dark:before:via-transparent dark:before:to-purple-950/5 before:rounded-2xl before:pointer-events-none",
        className
      )}
    >
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-300">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
