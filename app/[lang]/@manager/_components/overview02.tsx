import { cn } from "@/lib/utils";
import React from "react";
import { Label, Legend, Pie, PieChart, Tooltip } from "recharts";

export default function Overview02({
  data,
  height = 500,
  width = 300,
}: {
  data: { label: string; value: number }[];
  width?: number;
  height?: number;
}) {
  const newData = data.map((v, i) => ({
      ...v,
      fill: `hsl(var(--heroui-${i < 7 ? "primary" : "secondary"}-${
        (i + (i < 7 ? 2 : -5)) * 100
      }))`,
    })),
    sales = newData.reduce((a, c) => a + c.value, 0);
  return (
    <div
      className={cn(
        "border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 grid place-content-center overflow-hidden",
        "[&_.recharts-cartesian-axis-tick_text]:fill-neutral-600 dark:[&_.recharts-cartesian-axis-tick_text]:fill-neutral-400 [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-neutral-200 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-neutral-700",
        "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-neutral-300 dark:[&_.recharts-curve.recharts-tooltip-cursor]:stroke-neutral-600 [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none",
        "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-neutral-200 dark:[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-neutral-700 [&_.recharts-radial-bar-background-sector]:fill-neutral-100 dark:[&_.recharts-radial-bar-background-sector]:fill-neutral-800 [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-neutral-100 dark:[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-neutral-800",
        "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-neutral-200 dark:[&_.recharts-reference-line_[stroke='#ccc']]:stroke-neutral-700 [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none"
      )}
    >
      <PieChart width={width} height={height} className="">
        <Tooltip
          cursor={false}
          content={({ payload }) => (
            <div className="p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg backdrop-blur-md">
              {payload?.map(({ name, value, payload }, i) => (
                <p key={i + ""} className="flex gap-2 items-center text-sm">
                  <span
                    style={{ backgroundColor: payload.payload.fill }}
                    className="w-3 h-3 rounded-full"
                  />
                  <span className="flex-1 text-neutral-700 dark:text-neutral-300">{name}</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">{value}</span>
                </p>
              ))}
            </div>
          )}
        />
        <Legend
          layout="vertical"
          align="center"
          content={({ payload }) =>
            payload ? (
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs space-y-2">
                {payload.map(({ payload }, i) => (
                  <div key={i + ""} className="flex gap-2 items-center">
                    <span
                      style={{
                        backgroundColor: (
                          payload as { [index: string]: string }
                        )?.fill,
                      }}
                      className="w-3 h-3 rounded-full"
                    />
                    <p className="flex-1 flex justify-between">
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {(payload as { [index: string]: string })?.label}
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {(payload as { [index: string]: string })?.value}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )
          }
        />
        <Pie
          data={newData}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={4}
          fill="#82ca9d"
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-neutral-900 dark:fill-neutral-100 text-3xl font-bold"
                    >
                      {sales}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-neutral-600 dark:fill-neutral-400 text-sm"
                    >
                      Sales
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </div>
  );
}
