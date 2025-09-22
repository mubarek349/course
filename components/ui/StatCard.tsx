"use client";

import React from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
};

export default function StatCard({ icon, label, value, trend, className }: StatCardProps) {
  return (
    <div className={cn("card p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">
            <div className="size-6 flex items-center justify-center">
              {icon}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {label}
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {value}
            </p>
          </div>
        </div>
        {trend && (
          <div className={cn(
            "text-sm font-medium px-2 py-1 rounded-full",
            trend.isPositive 
              ? "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/50"
              : "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950/50"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </div>
        )}
      </div>
    </div>
  );
}
