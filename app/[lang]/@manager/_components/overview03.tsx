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
        "bg-primary-100 rounded-md overflow-hidden grid content-center items-center   ",
        "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 ",
        "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none",
        " [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
        " [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none"
      )}
    >
      <div className="px-5 pt-2 flex justify-between">
        <p className="text-xl font-bold">Sales</p>
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
              <div className="p-2 bg-background/80 rounded-md backdrop-blur-md">
                <p className="pb-1">{label}</p>
                {payload?.map(({ name, value, payload, color }, i) => (
                  <p key={i + ""} className="flex gap-1 items-center">
                    <span
                      style={{
                        backgroundColor: payload?.payload?.fill ?? color,
                      }}
                      className="p-2 rounded "
                    />
                    <span className="flex-1 pr-10">{name}</span>
                    <span className="">{value}</span>
                  </p>
                ))}
              </div>
            )}
          />
          <Bar
            dataKey="seller"
            stackId="a"
            fill="hsl(var(--heroui-primary-300))"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="affiliate"
            stackId="a"
            fill="hsl(var(--heroui-primary-700))"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="own"
            stackId="a"
            fill="hsl(var(--heroui-primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="px-5 pt-5 pb-2">
        <p className="opacity-60">
          Showing total sales from {new Date().toString().slice(4, 15)} to
          {new Date().toString().slice(4, 15)}
        </p>
      </div>
    </div>
  );
}