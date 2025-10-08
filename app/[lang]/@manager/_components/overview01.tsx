"use client";

import { Chip } from "@heroui/react";
import { MoveDown, MoveUp, Percent } from "lucide-react";
import React from "react";

export default function Overview01({
  data,
}: {
  data: { label: string; value: number | string; status?: number }[];
}) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.map(({ label, value, status }, i) => (
        <div key={i + ""} className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">{label}</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
            {status !== undefined && (
              <div className="flex flex-col items-end">
                <Chip
                  size="sm"
                  variant="flat"
                  color={status > 0 ? "success" : "danger"}
                  startContent={
                    status > 0 ? (
                      <MoveUp strokeWidth={2} className="size-3" />
                    ) : (
                      <MoveDown strokeWidth={2} className="size-3" />
                    )
                  }
                  endContent={<Percent className="size-3" />}
                  className="text-xs"
                >
                  {Math.abs(status)}
                </Chip>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">Since last month</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
