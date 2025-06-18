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
    <div className="grid gap-1 md:gap-4 grid-cols-2 md:grid-cols-3 auto-rows-min text-xs">
      {data.map(({ label, value, status }, i) => (
        <div key={i + ""} className="p-2 bg-primary-100 rounded-md ">
          <p className="">{label}</p>
          <div className="grid grid-cols-[1fr_auto] ">
            <p className="content-center text-2xl font-bold ">{value}</p>
            {status !== undefined && (
              <div className="grid">
                <Chip
                  size="sm"
                  variant="flat"
                  color={status > 0 ? "success" : "danger"}
                  startContent={
                    status > 0 ? (
                      <MoveUp strokeWidth={2} className="size-4" />
                    ) : status > 0 ? (
                      <MoveDown strokeWidth={2} className="size-4" />
                    ) : undefined
                  }
                  endContent={<Percent className="size-4" />}
                  className="place-self-center"
                >
                  {status}
                </Chip>
                <p className="text-xs opacity-70 ">Since last month</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
