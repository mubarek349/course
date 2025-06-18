import {
  Button,
  ButtonGroup,
  cn,
  DateRangePicker,
  DateValue,
  RangeValue,
} from "@heroui/react";
import {
  endOfMonth,
  endOfWeek,
  getLocalTimeZone,
  parseDate,
  startOfMonth,
  startOfWeek,
  today,
} from "@internationalized/date";
import { I18nProvider, useLocale } from "@react-aria/i18n";
import React, { useMemo, useState } from "react";

function reducer(
  locale: string,
  setFocusedValue: React.Dispatch<React.SetStateAction<DateValue | null>>,
  setDate: (date: { start: Date; end: Date } | null) => void
) {
  return (
    ...args:
      | [
          | "this week"
          | "this month"
          | "last week"
          | "last month"
          | "last 3 month"
        ]
      | ["manual", RangeValue<DateValue> | null]
  ) => {
    const now = today(getLocalTimeZone());
    let temp: RangeValue<DateValue> | null;
    switch (args[0]) {
      case "manual": {
        temp = args[1];
        break;
      }
      case "this week": {
        temp = { start: startOfWeek(now, locale), end: endOfWeek(now, locale) };
        break;
      }
      case "this month": {
        temp = {
          start: endOfMonth(now),
          end: startOfMonth(now),
        };
        break;
      }
      case "last week": {
        temp = {
          start: startOfWeek(now.subtract({ weeks: 1 }), locale),
          end: endOfWeek(now.subtract({ weeks: 1 }), locale),
        };
        break;
      }
      case "last month": {
        temp = {
          start: endOfMonth(now.subtract({ months: 1 })),
          end: startOfMonth(now.subtract({ months: 1 })),
        };
        break;
      }
      case "last 3 month": {
        temp = {
          start: startOfMonth(now.subtract({ months: 3 })),
          end: endOfMonth(now.subtract({ months: 1 })),
        };
        break;
      }
    }
    setDate(
      temp
        ? {
            start: new Date(temp.start.toString()),
            end: new Date(temp.end.toString()),
          }
        : null
    );
    if (temp) setFocusedValue(temp.start);
  };
}

export default function CustomDatePicker({
  date,
  setDate,
  visibleMonths,
  className,
}: {
  date: { start: Date; end: Date } | null;
  setDate: (date: { start: Date; end: Date } | null) => void;
  visibleMonths?: number;
  className?: string;
}) {
  const { locale } = useLocale(),
    now = useMemo(() => today(getLocalTimeZone()), []),
    [focusedValue, setFocusedValue] = useState<DateValue | null>(now),
    dispatch = reducer(locale, setFocusedValue, setDate);

  function TopContent() {
    return (
      <div className="p-2 grid place-content-center">
        <ButtonGroup
          size="sm"
          variant="flat"
          color="primary"
          className="gap-[1px]"
        >
          <Button onPress={() => dispatch("this week")}>This week</Button>
          <Button onPress={() => dispatch("this month")}>This month</Button>
        </ButtonGroup>
      </div>
    );
  }

  function BottomContent() {
    return (
      <div className="p-2 grid place-content-center">
        <ButtonGroup
          size="sm"
          variant="flat"
          color="primary"
          className="gap-[1px]"
        >
          <Button onPress={() => dispatch("last week")}>last week</Button>
          <Button onPress={() => dispatch("last month")}>last month</Button>
          <Button onPress={() => dispatch("last 3 month")}>last 3 month</Button>
        </ButtonGroup>
      </div>
    );
  }

  return (
    <I18nProvider locale="us-EN-u-ca-gregory">
      <DateRangePicker
        size="sm"
        color="primary"
        variant="faded"
        showMonthAndYearPickers
        visibleMonths={visibleMonths ?? 1}
        value={
          date
            ? {
                start: parseDate(date.start.toISOString().split("T")[0]),
                end: parseDate(date.end.toISOString().split("T")[0]),
              }
            : null
        }
        onChange={(v) => dispatch("manual", v)}
        calendarProps={{ focusedValue, onFocusChange: setFocusedValue }}
        className={cn("md:w-60", className)}
        CalendarTopContent={<TopContent />}
        CalendarBottomContent={<BottomContent />}
      />
    </I18nProvider>
  );
}
