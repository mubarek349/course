"use client";

import React from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
};

export default function Section({ title, description, className, children, headerRight }: SectionProps) {
  return (
    <section className={cn("card p-4 md:p-6", className)}>
      {(title || description || headerRight) && (
        <div className="mb-4 flex items-start md:items-center justify-between gap-3 flex-col md:flex-row">
          <div>
            {title && (
              <h2 className="text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{description}</p>
            )}
          </div>
          {headerRight && <div className="flex items-center gap-2">{headerRight}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
