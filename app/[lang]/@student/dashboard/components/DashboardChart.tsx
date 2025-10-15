"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartData {
  name: string;
  Progress: number;
}

interface DashboardChartProps {
  data: ChartData[];
}

export default function DashboardChart({ data }: DashboardChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-neutral-500 dark:text-neutral-400">
        <p>No course progress data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          stroke="currentColor"
          className="text-neutral-600 dark:text-neutral-400"
        />
        <YAxis
          stroke="currentColor"
          className="text-neutral-600 dark:text-neutral-400"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgb(23 23 23)",
            border: "1px solid rgb(38 38 38)",
            borderRadius: "8px",
            color: "white",
          }}
        />
        <Legend />
        <Bar dataKey="Progress" fill="rgb(14 165 233)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
