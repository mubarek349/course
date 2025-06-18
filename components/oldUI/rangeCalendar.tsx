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
  now: Date;
  startYear: number;
  startMonth: number;
  startCurrentDays: number[];
  startPrevDays: number[];
  startNextDays: number[];
  endYear: number;
  endMonth: number;
  endCurrentDays: number[];
  endPrevDays: number[];
  endNextDays: number[];
};
type TAction =
  | {
      action: "month:+" | "month:-";
      value?: undefined;
    }
  | { action: "start"; value: Date };

const initData = {
  now: new Date(),
  startYear: 0,
  startMonth: 0,
  startCurrentDays: [0],
  startPrevDays: [0],
  startNextDays: [0],
  endYear: 0,
  endMonth: 0,
  endCurrentDays: [0],
  endPrevDays: [0],
  endNextDays: [0],
};

function calculator({
  year: startYear,
  month: startMonth,
}: {
  year: number;
  month: number;
}) {
  const startFirstDay = new Date(startYear, startMonth, 1).getDay(),
    startLastDay = new Date(startYear, startMonth + 1, 0).getDate(),
    startPrevDays =
      startFirstDay > 0
        ? Array(new Date(startYear, startMonth, 0).getDate())
            .fill({})
            .map(({}, i) => i + 1)
            .slice(-startFirstDay)
        : [],
    startCurrentDays = Array(startLastDay)
      .fill({})
      .map(({}, i) => i + 1),
    startNextDays = Array(
      6 - new Date(startYear, startMonth, startLastDay).getDay()
    )
      .fill({})
      .map(({}, i) => i + 1),
    endMonth = startMonth == 11 ? 0 : startMonth + 1,
    endYear = endMonth == 0 ? startYear + 1 : startYear,
    endFirstDay = new Date(endYear, endMonth, 1).getDay(),
    endLastDay = new Date(endYear, endMonth + 1, 0).getDate(),
    endPrevDays =
      endFirstDay > 0
        ? Array(new Date(endYear, endMonth, 0).getDate())
            .fill({})
            .map(({}, i) => i + 1)
            .slice(-endFirstDay)
        : [],
    endCurrentDays = Array(endLastDay)
      .fill({})
      .map(({}, i) => i + 1),
    endNextDays = Array(6 - new Date(endYear, endMonth, endLastDay).getDay())
      .fill({})
      .map(({}, i) => i + 1);
  return {
    now: new Date(),
    startYear,
    startMonth,
    startPrevDays,
    startCurrentDays,
    startNextDays,
    endMonth,
    endYear,
    endPrevDays,
    endCurrentDays,
    endNextDays,
  };
}

function reducer(oldState: TState, { action, value }: TAction): TState {
  switch (action) {
    case "start": {
      if (value) {
        const year = value.getFullYear(),
          month = value.getMonth();
        return calculator({ year, month });
      } else return oldState;
    }
    case "month:+": {
      const year =
          oldState.startMonth == 11
            ? oldState.startYear + 1
            : oldState.startYear,
        month = oldState.startMonth == 11 ? 0 : oldState.startMonth + 1;
      return calculator({ year, month });
    }
    case "month:-": {
      const year =
          oldState.startMonth === 0
            ? oldState.startYear - 1
            : oldState.startYear,
        month = oldState.startMonth == 0 ? 11 : oldState.startMonth - 1;
      return calculator({ year, month });
    }
    default: {
      return oldState;
    }
  }
}

export default function RangeCalendar({
  date,
  setDate,
  className,
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
}) {
  const [state, dispatch] = useReducer(reducer, initData);

  useEffect(() => {
    dispatch({ action: "start", value: date.start || new Date() });
  }, [date.start]);

  return (
    <div
      className={cn(
        "min-w-fit min-h-fit p-4 bg-white rounded-md shadow-[0_0_5px_-2px_rgb(var(--primary-600)/10)] grid gap-2 md:grid-cols-[auto_1fr] ",
        className
      )}
    >
      <div className="md:w-40 grid auto-rows-min gap-2 content-center ">
        {["Last 7 day", "Last 30 day", "Last 90 day", "Last 180 day"].map(
          (label, i) => {
            const start = new Date(),
              end = new Date();
            switch (label) {
              case "Last 7 day": {
                end.setDate(start.getDate() - 7);
                break;
              }
              case "Last 30 day": {
                end.setDate(start.getDate() - 30);
                break;
              }
              case "Last 90 day": {
                end.setDate(start.getDate() - 90);
                break;
              }
              case "Last 180 day": {
                end.setDate(start.getDate() - 180);
                break;
              }
            }

            const active =
                date.start?.toDateString() === start.toDateString() &&
                date.end?.toDateString() === end.toDateString(),
              handler = () => {
                if (active) {
                  setDate({ start: undefined, end: undefined });
                } else {
                  setDate({ start, end });
                }
              };
            return (
              <button
                key={i + ""}
                onClick={handler}
                className={cn(
                  "py-1 hover:py-1",
                  active ? "btn-primary" : "btn-light-primary hover:btn-primary"
                )}
              >
                {label}
              </button>
            );
          }
        )}
      </div>
      <div className="grid grid-rows-[auto_1fr_auto]">
        <div className="pb-2 grid grid-cols-[auto_1fr_auto]">
          <button
            onClick={() => {
              dispatch({ action: "month:-" });
            }}
            className="btn-primary "
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex justify-around ">
            <span className="content-center ">
              {months[state.startMonth]} {state.startYear}
            </span>
            <span className="max-md:hidden content-center ">
              {months[state.endMonth]} {state.endYear}
            </span>
          </div>
          <button
            onClick={() => {
              dispatch({ action: "month:+" });
            }}
            className="btn-primary "
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="place-self-center flex gap-2 justify-between">
          <div className="h-fit w-60 p-1 border border-primary-600/20 rounded-md overflow-hidden grid gap-y-1 grid-cols-7 auto-rows-min  ">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((label, i) => (
              <div
                key={i + ""}
                className="grid place-content-center text-secondary-600"
              >
                {label}
              </div>
            ))}
            {state.startPrevDays.map((label, i) => (
              <div
                key={i + ""}
                className="grid place-content-center opacity-30"
              >
                {label}
              </div>
            ))}
            {state.startCurrentDays.map((label, i) => {
              const currentDate = new Date(
                  state.startYear,
                  state.startMonth,
                  label
                ),
                firstSelection =
                  date.start?.toDateString() === currentDate.toDateString(),
                endSelection =
                  date.end?.toDateString() === currentDate.toDateString(),
                between =
                  date.start &&
                  date.end &&
                  ((date.start?.toISOString() < currentDate.toISOString() &&
                    date.end?.toISOString() > currentDate.toISOString()) ||
                    (date.start?.toISOString() > currentDate.toISOString() &&
                      date.end?.toISOString() < currentDate.toISOString())),
                now = state.now.toISOString() === currentDate.toISOString();
              return (
                <button
                  key={i + ""}
                  onClick={() => {
                    if (firstSelection || endSelection) {
                      setDate({ start: undefined, end: undefined });
                    } else if (date.end || !date.start) {
                      setDate({ start: currentDate, end: undefined });
                    } else {
                      setDate((prev) => ({ ...prev, end: currentDate }));
                    }
                  }}
                  className={cn(
                    "grid place-content-center  ",
                    firstSelection
                      ? `bg-secondary-600 text-white ${
                          date.start
                            ? date.end
                              ? date.end > date.start
                                ? "rounded-l-md"
                                : "rounded-r-md"
                              : "rounded-md"
                            : ""
                        }`
                      : endSelection
                      ? `bg-secondary-600 text-white ${
                          date.end && date.start
                            ? date.end < date.start
                              ? "rounded-l-md"
                              : "rounded-r-md"
                            : ""
                        }`
                      : between
                      ? `bg-secondary-600/30 
                        ${
                          currentDate.getDay() === 0
                            ? "rounded-l-md "
                            : currentDate.getDay() === 6
                            ? "rounded-r-md "
                            : ""
                        } 
                        ${
                          i === state.startCurrentDays.length - 1
                            ? "rounded-r-md"
                            : ""
                        } 
                        ${i === 0 ? "rounded-l-md" : ""}
                        `
                      : now
                      ? "bg-success-600/30"
                      : "hover:bg-secondary-600/30 "
                  )}
                >
                  {label}
                </button>
              );
            })}
            {state.startNextDays.map((label, i) => (
              <div
                key={i + ""}
                className="grid place-content-center opacity-30"
              >
                {label}
              </div>
            ))}
          </div>
          <div className="max-md:hidden h-fit w-60 p-1 border border-primary-600/20 rounded-md overflow-hidden grid gap-y-1 grid-cols-7 auto-rows-min  ">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((label, i) => (
              <div
                key={i + ""}
                className="grid place-content-center text-secondary-600"
              >
                {label}
              </div>
            ))}
            {state.endPrevDays.map((label, i) => (
              <div
                key={i + ""}
                className="grid place-content-center opacity-30"
              >
                {label}
              </div>
            ))}
            {state.endCurrentDays.map((label, i) => {
              const currentDate = new Date(
                  state.endYear,
                  state.endMonth,
                  label
                ),
                firstSelected =
                  date.start?.toDateString() === currentDate.toDateString(),
                endSelected =
                  date.end?.toDateString() === currentDate.toDateString(),
                between =
                  date.start &&
                  date.end &&
                  ((date.start?.toISOString() < currentDate.toISOString() &&
                    date.end?.toISOString() > currentDate.toISOString()) ||
                    (date.start?.toISOString() > currentDate.toISOString() &&
                      date.end?.toISOString() < currentDate.toISOString())),
                now = state.now.toISOString() === currentDate.toISOString();
              return (
                <button
                  key={i + ""}
                  onClick={() => {
                    if (firstSelected || endSelected) {
                      setDate({ start: undefined, end: undefined });
                    } else if (date.end || !date.start) {
                      setDate({ start: currentDate, end: undefined });
                    } else {
                      setDate((prev) => ({ ...prev, end: currentDate }));
                    }
                  }}
                  className={cn(
                    "grid place-content-center  ",
                    firstSelected
                      ? `bg-secondary-600 text-white ${
                          date.start
                            ? date.end
                              ? date.end > date.start
                                ? "rounded-l-md"
                                : "rounded-r-md"
                              : "rounded-md"
                            : ""
                        }`
                      : endSelected
                      ? `bg-secondary-600 text-white ${
                          date.end && date.start
                            ? date.end < date.start
                              ? "rounded-l-md"
                              : "rounded-r-md"
                            : ""
                        }`
                      : between
                      ? `bg-secondary-600/30 
                        ${
                          currentDate.getDay() === 0
                            ? "rounded-l-md "
                            : currentDate.getDay() === 6
                            ? "rounded-r-md "
                            : ""
                        } 
                        ${
                          i === state.endCurrentDays.length - 1
                            ? "rounded-r-md"
                            : ""
                        } 
                        ${i === 0 ? "rounded-l-md" : ""}
                        `
                      : now
                      ? "bg-success-600/30"
                      : "hover:bg-secondary-600/30 "
                  )}
                >
                  {label}
                </button>
              );
            })}
            {state.endNextDays.map((label, i) => (
              <div
                key={i + ""}
                className="grid place-content-center opacity-30"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
        <div className="h-10 content-center text-center  ">
          <span className="">{date.start?.toDateString()}</span>
          {date.end && (
            <>
              <span className="px-5">-</span>
              <span className="">{date.end?.toDateString()}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
