"use client";

import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import Popover from "./Popover";
import RangeCalendar from "./rangeCalendar";

export default function RangeDatePicker({
  date,
  setDate,
  className,
  triggerClassName,
}: {
  date: {
    start: Date | undefined;
    end: Date | undefined;
  };
  setDate: React.Dispatch<
    React.SetStateAction<{
      start: Date | undefined;
      end: Date | undefined;
    }>
  >;
  className?: string;
  triggerClassName?: string;
}) {
  return (
    <Popover
      trigger={
        <button
          className={cn(
            "w-64  btn-light-primary hover:btn-primary flex gap-2 items-center ",
            triggerClassName
          )}
        >
          <CalendarDays className="size-4" />
          <p className="flex-1 content-center text-center max-md:grid  ">
            {date.start ? (
              <>
                <span className="">{date.start?.toDateString()}</span>
                {date.end && (
                  <>
                    <span className="max-md:hidden px-5">-</span>
                    <span className="">{date.end?.toDateString()}</span>
                  </>
                )}
              </>
            ) : (
              "select date"
            )}
          </p>
        </button>
      }
      className={cn("", className)}
      align="top-right"
    >
      <RangeCalendar date={date} setDate={setDate} className="" />
    </Popover>
  );
}
