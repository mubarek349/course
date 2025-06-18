"use client";

import { CalendarDays } from "lucide-react";
import Calendar from "./calendar";
import { cn } from "@/lib/utils";
import Popover from "./Popover";

export default function DatePicker({
  date,
  setDate,
  className,
}: {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  className?: string;
}) {
  return (
    <Popover
      trigger={
        <button className="md:w-64 btn-light-primary hover:btn-primary flex gap-2 items-center ">
          <CalendarDays className="size-4" />
          <span className="flex-1 text-start ">
            {date?.toDateString().slice(3, 10) || "--- --"}
          </span>
        </button>
      }
      className={cn("", className)}
    >
      <div className="bg-white  rounded-md shadow-[0_0_5px_-2px_rgb(var(--primary-600)/10)] ">
        <Calendar date={date} setDate={setDate} />
      </div>
    </Popover>
  );
}
