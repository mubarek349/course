"use client";

import { getStudentCourses } from "@/actions/manager/student";
import CustomTable from "@/components/ui/custom-table";
import useData from "@/hooks/useData";
import { TTableData } from "@/lib/definations";
import { useParams } from "next/navigation";
import React, { useState } from "react";

function Page() {
  const { lang, id } = useParams<{ lang: string; id: string }>(),
    [tableData, setTableData] = useState<TTableData & { id: string }>({
      search: "",
      currentPage: 1,
      rowsPerPage: 50,
      selectedKeys: new Set([]),
      visibleColumns: "all",
      sortDescriptor: { column: "title", direction: "ascending" },
      id,
    }),
    { data, loading } = useData({ func: getStudentCourses, args: [tableData] });

  return (
    <CustomTable
      columns={[
        { label: "Image", key: "img", align: "center" },
        { label: "Title", key: "title", sortable: true },
        { label: "Transaction", key: "transaction" },
        { label: "Name", key: "name" },
        { label: "Role", key: "role" },
        { label: " ", key: "action", align: "center" },
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
          case "img": {
            return (
              <div className="size-20 rounded-3xl overflow-hidden border-2 border-primary-200">
                {
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt=""
                    src={
                      rowData.img
                        ? `data:image/png;base64,${rowData.img}`
                        : "/darulkubra.png"
                    }
                    width={1000}
                    height={1000}
                    onClick={({ currentTarget }) => {
                      if (document.fullscreenElement) {
                        document.exitFullscreen();
                      } else if (document.fullscreenEnabled) {
                        currentTarget.requestFullscreen();
                      }
                    }}
                    className="size-full "
                  />
                }
              </div>
            );
          }
          case "title": {
            return `${
              lang == "en" ? rowData.course.titleEn : rowData.course.titleEn
            }`;
          }
          case "transaction": {
            return `${rowData.tx_ref ?? rowData.reference}`;
          }
          case "name": {
            return (
              <p className="capitalize">
                {`${rowData.seller?.firstName ?? ""} ${
                  rowData.seller?.firstName ?? ""
                }`}
              </p>
            );
          }
          case "role": {
            return (
              <p className="capitalize">{`${rowData.seller?.role ?? ""}`}</p>
            );
          }
          case "action": {
            return <div className=""></div>;
          }
          default: {
            return `${value ?? ""}`;
          }
        }
      }}
      btns={<></>}
    />
  );
}

export default Page;
