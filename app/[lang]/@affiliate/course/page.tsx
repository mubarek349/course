"use client";

import useData from "@/hooks/useData";
import React, { useState } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Button } from "@heroui/react";
import CustomTable from "@/components/ui/custom-table";
import { TTableData } from "@/lib/definations";
import { Copy } from "lucide-react";
import { useSession } from "next-auth/react";
import { getCourses } from "@/actions/common/course";

export default function Page() {
 const params= useParams<{ lang: string }>();
   const lang = params?.lang || "en",{ data: session } = useSession(),
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
          label: "Affiliate Rate",
          key: "affiliateRate",
          sortable: true,
        },
        {
          label: "Link",
          key: "link",
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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                src={rowData.thumbnail}
                className="size-20 rounded-full"
              />
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
          case "affiliateRate": {
            return (
              <p className="whitespace-nowrap ">{`${rowData.affiliateRate} ETB`}</p>
            );
          }
          case "price": {
            return (
              <p className="whitespace-nowrap ">{`${rowData.price} ETB`}</p>
            );
          }
          case "link": {
            return (
              <Button
                isIconOnly
                variant="flat"
                color="primary"
                onPress={() => {
                  navigator.clipboard
                    .writeText(
                      `https://${window.location.host}/${lang}/course/${
                        rowData.id
                      }?code=${session?.user?.code ?? ""}`
                    )
                    .then(() => {
                      toast.success(
                        lang == "en" ? "Copied to clipboard" : "ሊንክ ኮፒ ሆኗል"
                      );
                    })
                    .catch(() => {
                      toast.error(
                        lang == "en" ? "Failed to Copied" : "ኮፒ ማድረግ አልተሳካም"
                      );
                    });
                }}
              >
                <Copy className="size-5" />
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
