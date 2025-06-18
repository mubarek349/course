"use client";

import useData from "@/hooks/useData";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button, Link } from "@heroui/react";
import CustomTable from "@/components/ui/custom-table";
import { TTableData } from "@/lib/definations";
import { DollarSign } from "lucide-react";
import { getCourses } from "@/actions/common/course";

export default function Page() {
  const { lang } = useParams<{ lang: string }>(),
    [tableData, setTableData] = useState<TTableData>({
      search: "",
      currentPage: 1,
      rowsPerPage: 50,
      visibleColumns: "all",
      selectedKeys: new Set([]),
      sortDescriptor: {
        column: "title",
        direction: "ascending",
      },
    }),
    { data, loading } = useData({
      func: getCourses,
      args: [tableData],
    });

  return (
    <CustomTable
      columns={[
        { label: "Thumbnail", key: "thumbnail", align: "center" },
        { label: "Title", key: "title", sortable: true },
        { label: "Instructor", key: "instructor", sortable: true },
        { label: "Price", key: "price", sortable: true },
        {
          label: "Seller Rate",
          key: "sellerRate",
          sortable: true,
        },
        {
          label: "Sale",
          key: "sale",
          align: "center",
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
          case "thumbnail": {
            return (
              <div className=" grid place-content-center">
                {
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt=""
                    src={rowData.thumbnail}
                    className="w-20 aspect-square rounded-full"
                  />
                }
              </div>
            );
          }
          case "title": {
            return (
              <p className="w-60 ">
                {lang == "en" ? rowData.titleEn : rowData.titleAm}
              </p>
            );
          }
          case "instructor": {
            return `${rowData.instructor.firstName} ${rowData.instructor.fatherName}`;
          }
          case "price": {
            return (
              <p className="whitespace-nowrap ">{`${rowData.price} ETB`}</p>
            );
          }
          case "sellerRate": {
            return (
              <p className="whitespace-nowrap ">{`${rowData.sellerRate} ETB`}</p>
            );
          }
          case "sale": {
            return (
              <Button
                variant="flat"
                color="primary"
                as={Link}
                href={`/${lang}/sale/${rowData.id}/${rowData.price}/${rowData.titleEn}@${rowData.titleAm}`}
                startContent={<DollarSign className="size-5" />}
              >
                Sale
              </Button>
            );
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
