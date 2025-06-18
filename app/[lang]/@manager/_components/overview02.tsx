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
        "bg-primary-100 rounded-md grid place-content-center overflow-hidden  ",
        "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-success/50 ",
        "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-success [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none",
        " [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-success [&_.recharts-radial-bar-background-sector]:fill-secondary [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-secondary",
        " [&_.recharts-reference-line_[stroke='#ccc']]:stroke-success [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none"
      )}
    >
      <PieChart width={width} height={height} className="">
        <Tooltip
          cursor={false}
          content={({ payload }) => (
            <div className="p-2 bg-background/80 rounded-md backdrop-blur-md">
              {payload?.map(({ name, value, payload }, i) => (
                <p key={i + ""} className="flex gap-1 items-center">
                  <span
                    style={{ backgroundColor: payload.payload.fill }}
                    className="p-2 rounded "
                  />
                  <span className="flex-1 pr-10">{name}</span>
                  <span className="">{value}</span>
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
              <div className="p-2 bg-primary-50 rounded-md text-xs space-y-[1px]">
                {payload.map(({ payload }, i) => (
                  <div key={i + ""} className="flex gap-2 items-center">
                    <span
                      style={{
                        backgroundColor: (
                          payload as { [index: string]: string }
                        )?.fill,
                      }}
                      className="p-1 rounded-[1px]"
                    />
                    <p className="flex-1 flex gap-1 justify-between">
                      <span className="">
                        {(payload as { [index: string]: string })?.label}
                      </span>
                      <span className="">
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
                      className="fill-foreground text-3xl font-bold"
                    >
                      {sales}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-primary-700"
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
