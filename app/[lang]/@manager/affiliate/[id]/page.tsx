"use client";

import { getProgress } from "@/actions/manager/orderProgress";
import CustomDatePicker from "@/components/ui/custom-date-picker";
import CustomTable from "@/components/ui/custom-table";
import useData from "@/hooks/useData";
import { TTableData } from "@/lib/definations";
import {
  endOfMonth,
  getLocalTimeZone,
  startOfMonth,
  today,
} from "@internationalized/date";
import { useParams } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const params= useParams<{ lang: string ,id:string}>();
      const lang = params?.lang || "en",
      id = params?.id || "",
      [tableData, setTableData] = useState<
      TTableData & { id: string; date: { start: Date; end: Date } }
    >({
      search: "",
      currentPage: 1,
      rowsPerPage: 50,
      sortDescriptor: { column: "", direction: "ascending" },
      selectedKeys: new Set(),
      visibleColumns: "all",
      id,
      date: {
        start: new Date(startOfMonth(today(getLocalTimeZone())).toString()),
        end: new Date(endOfMonth(today(getLocalTimeZone())).toString()),
      },
    }),
    { loading, data } = useData({
      func: getProgress,
      args: [tableData],
    });

  return (
    <div className="grid grid-rows-[auto_1fr]">
      <div className="p-2 grid gap-2 grid-cols-3 md:grid-cols-6">
        {Object.entries(
          (data?.list ?? []).reduce(
            (acc, c) => ({
              totalSale: (acc.totalSale || 0) + c.totalSale,
              totalIncome: (acc.totalIncome || 0) + c.totalIncome,
              filteredSale: (acc.filteredSale || 0) + c.filteredSale,
              filteredIncome: (acc.filteredIncome || 0) + c.filteredIncome,
              thisMonthSale: (acc.thisMonthSale || 0) + c.thisMonthSale,
              thisMonthIncome: (acc.thisMonthIncome || 0) + c.thisMonthIncome,
            }),
            {} as Omit<
              NonNullable<typeof data>["list"][0],
              "id" | "titleEn" | "titleAm" | "incomeRate"
            >
          )
        ).map(([n, v], i) => (
          <div key={i + ""} className="p-4 bg-primary-100 rounded-md">
            <p className="text-xs capitalize">
              {n.replace(/([a-z])([A-Z])/g, "$1 $2")}
            </p>
            <p className="text-3xl font-bold">{v}</p>
          </div>
        ))}
      </div>
      <CustomTable
        columns={[
          { label: "Title", key: "title", sortable: true },
          { label: "Income Rate", key: "incomeRate", sortable: true },
          {
            label: "Total Sale",
            key: "totalSale",
            align: "center",
            sortable: true,
          },
          {
            label: "Total Income",
            key: "totalIncome",
            align: "center",
            sortable: true,
          },
          {
            label: "Filtered Sale",
            key: "filteredSale",
            align: "center",
            sortable: true,
          },
          {
            label: "Filtered Income",
            key: "filteredIncome",
            align: "center",
            sortable: true,
          },
          {
            label: "This Month Sale",
            key: "thisMonthSale",
            align: "center",
            sortable: true,
          },
          {
            label: "This Month Income",
            key: "thisMonthIncome",
            align: "center",
            sortable: true,
          },
        ]}
        data={{
          list: data?.list ?? [],
          totalData: data?.totalData ?? 0,
          totalPage: data?.totalPage ?? 1,
        }}
        loadingState={loading ? "loading" : "idle"}
        tableData={tableData}
        setTableData={setTableData}
        RenderCell={({ rowData, columnKey }) => {
          const value = rowData[columnKey as keyof typeof rowData];
          switch (columnKey) {
            case "title": {
              return (
                <p className="min-w-80">
                  {`${lang == "en" ? rowData.titleEn : rowData.titleAm}`}
                </p>
              );
            }
            case "incomeRate": {
              return rowData.incomeRate?.rate;
            }
            default: {
              return JSON.stringify(value);
            }
          }
        }}
        btns={
          <>
            <CustomDatePicker
              date={tableData.date}
              setDate={(date) =>
                setTableData((prev) => ({ ...prev, date: date ?? prev.date }))
              }
              visibleMonths={2}
              // className="hidden sm:flex"
            />
          </>
        }
      />
    </div>
  );
}
