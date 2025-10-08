"use client";

import CustomDatePicker from "@/components/ui/custom-date-picker";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export default function Overview03({
  data,
}: {
  data: { label: string; seller: number; affiliate: number; own: number }[];
}) {
  const searchparams = useSearchParams(),
    [date, setDate] = useState<{ start: Date; end: Date } | null>(() => {
      // Safely handle null searchparams
      const startDate = searchparams?.get("startDate"),
        endDate = searchparams?.get("endDate");
      if (startDate && endDate) {
        return {
          start: new Date(startDate),
          end: new Date(endDate),
        };
      } else return null;
    }),
    router = useRouter();

  useEffect(() => {
    router.push(`?startDate=${date?.start ?? ""}&endDate=${date?.end ?? ""}`);
  }, [date]);

  return (
    <div
      className={cn(
        "border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 overflow-hidden",
        "[&_.recharts-cartesian-axis-tick_text]:fill-neutral-600 dark:[&_.recharts-cartesian-axis-tick_text]:fill-neutral-400 [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-neutral-200 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-neutral-700",
        "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-neutral-300 dark:[&_.recharts-curve.recharts-tooltip-cursor]:stroke-neutral-600 [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none",
        "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-neutral-200 dark:[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-neutral-700 [&_.recharts-radial-bar-background-sector]:fill-neutral-100 dark:[&_.recharts-radial-bar-background-sector]:fill-neutral-800 [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-neutral-100 dark:[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-neutral-800",
        "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-neutral-200 dark:[&_.recharts-reference-line_[stroke='#ccc']]:stroke-neutral-700 [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none"
      )}
    >
      <div className="px-6 pt-4 pb-2 flex justify-between items-center">
        <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Sales</p>
        <CustomDatePicker date={date} setDate={setDate} />
      </div>
      <ResponsiveContainer width={"100%"} height={200} className="">
        <BarChart accessibilityLayer data={data}>
          <XAxis
            dataKey="label"
            tickLine={false}
            tickMargin={10}
            tickSize={7}
            angle={22.5}
            axisLine={false}
          />
          <Tooltip
            cursor={false}
            content={({ payload, label }) => (
              <div className="p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg backdrop-blur-md">
                <p className="pb-2 font-medium text-neutral-900 dark:text-neutral-100">{label}</p>
                {payload?.map(({ name, value, payload, color }, i) => (
                  <p key={i + ""} className="flex gap-2 items-center text-sm">
                    <span
                      style={{
                        backgroundColor: payload?.payload?.fill ?? color,
                      }}
                      className="w-3 h-3 rounded-full"
                    />
                    <span className="flex-1 text-neutral-700 dark:text-neutral-300">{name}</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{value}</span>
                  </p>
                ))}
              </div>
            )}
          />
          <Bar
            dataKey="seller"
            stackId="a"
            fill="rgb(156 163 175)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="affiliate"
            stackId="a"
            fill="rgb(107 114 128)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="own"
            stackId="a"
            fill="rgb(55 65 81)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="px-6 pt-4 pb-4">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Showing total sales from {new Date().toString().slice(4, 15)} to
          {new Date().toString().slice(4, 15)}
        </p>
      </div>
    </div>
  );
}