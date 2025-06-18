"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useReducer } from "react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type TState = {
  year: number;
  month: number;
  currentDays: number[];
  prevDays: number[];
  nextDays: number[];
  now: Date;
};
type TAction =
  | {
      action: "month:+" | "month:-";
      value?: undefined;
    }
  | { action: "start"; value: Date };

const initData = {
  year: 0,
  month: 0,
  currentDays: [0],
  prevDays: [0],
  nextDays: [0],
  now: new Date(),
};

function calculator({ year, month }: { year: number; month: number }) {
  const firstDay = new Date(year, month, 1).getDay(),
    lastDay = new Date(year, month + 1, 0).getDate(),
    prevDays =
      firstDay > 0
        ? Array(new Date(year, month, 0).getDate())
            .fill({})
            .map(({}, i) => i + 1)
            .slice(-firstDay)
        : [],
    currentDays = Array(lastDay)
      .fill({})
      .map(({}, i) => i + 1),
    nextDays = Array(6 - new Date(year, month, lastDay).getDay())
      .fill({})
      .map(({}, i) => i + 1);
  return { year, month, prevDays, currentDays, nextDays, now: new Date() };
}

function reducer(oldState: TState, { action, value }: TAction): TState {
  switch (action) {
    case "start": {
      if (value) {
        const year = value.getFullYear(),
          month = value.getMonth();
        return { ...oldState, ...calculator({ year, month }) };
      } else return oldState;
    }
    case "month:+": {
      const year = oldState.month == 11 ? oldState.year + 1 : oldState.year,
        month = oldState.month == 11 ? 0 : oldState.month + 1;
      return { ...oldState, ...calculator({ year, month }) };
    }
    case "month:-": {
      const year = oldState.month == 0 ? oldState.year - 1 : oldState.year,
        month = oldState.month == 0 ? 11 : oldState.month - 1;
      return { ...oldState, ...calculator({ year, month }) };
    }
    default: {
      return oldState;
    }
  }
}

export default function Calendar({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (v: Date | undefined) => void;
}) {
  const [{ year, month, currentDays, prevDays, nextDays, now }, dispatch] =
    useReducer(reducer, initData);

  useEffect(() => {
    dispatch({ action: "start", value: date || new Date() });
  }, [date]);

  return (
    <div className="min-w-fit min-h-fit p-2 bg-primary-600/20 rounded-md">
      <div className="pb-2 grid grid-cols-[auto_1fr_auto]">
        <button
          onClick={() => {
            dispatch({ action: "month:-" });
          }}
          className="p-2 bg-primary rounded-md text-white"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="content-center text-center">
          {months[month]} {year}
        </div>
        <button
          onClick={() => {
            dispatch({ action: "month:+" });
          }}
          className="p-2 bg-primary rounded-md text-white"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="w-60 grid gap-1 grid-cols-7 auto-rows-min  ">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((label, i) => (
          <div
            key={i + ""}
            className="grid place-content-center text-secondary-600"
          >
            {label}
          </div>
        ))}
        {prevDays.map((label, i) => (
          <div key={i + ""} className="grid place-content-center opacity-30">
            {label}
          </div>
        ))}
        {currentDays.map((label, i) => (
          <button
            key={i + ""}
            onClick={() => {
              if (
                date?.getFullYear() == year &&
                date?.getMonth() == month &&
                date?.getDate() == label
              ) {
                setDate(undefined);
              } else {
                setDate(new Date(year, month, label));
              }
            }}
            className={cn(
              "grid place-content-center rounded-md ",
              date?.getFullYear() == year &&
                date?.getMonth() == month &&
                date?.getDate() == label
                ? "bg-secondary-600 /50  text-white"
                : now.getFullYear() == year &&
                  now.getMonth() == month &&
                  now.getDate() == label
                ? "bg-secondary-600/30"
                : "hover:bg-secondary-600/30 "
            )}
          >
            {label}
          </button>
        ))}
        {nextDays.map((label, i) => (
          <div key={i + ""} className="grid place-content-center opacity-30">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
