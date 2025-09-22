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
        "rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60",
        "bg-surface-light/70 dark:bg-surface-dark/70 backdrop-blur-xl",
        "px-4 md:px-6 py-4 md:py-5 shadow-soft",
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm md:text-base text-neutral-600 dark:text-neutral-400">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
