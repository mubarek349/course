"use client";

import useData from "@/hooks/useData";
import React, { useState } from "react";
import Link from "next/link";
import { Pen, Plus, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import CustomTable from "@/components/ui/custom-table";
import { TTableData } from "@/lib/definations";
import { getStudents } from "@/actions/manager/student";
import UserStatusToggle from "@/components/userStatusToggle";
import RemoveStudent from "./removeStudent";
import ScrollablePageWrapper from "@/components/layout/ScrollablePageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
} from "@heroui/react";

export default function Page() {
 const params= useParams<{ lang: string }>();
         const lang = params?.lang || "en",
    [tableData, setTableData] = useState<TTableData & { status: Selection }>({
      search: "",
      currentPage: 1,
      rowsPerPage: 50,
      selectedKeys: new Set([]),
      visibleColumns: "all",
      sortDescriptor: {
        column: "name",
        direction: "ascending",
      },
      status: new Set([]),
    }),
    { data, loading, refresh } = useData({
      func: getStudents,
      args: [tableData],
    }),
    [remove, setRemove] = useState<string>();

  return (
    <ScrollablePageWrapper>
      <PageHeader
        title={lang === "en" ? "Student Management" : "የተማሪ አስተዳደር"}
        subtitle={lang === "en" ? "Manage student accounts, status, and registrations." : "የተማሪ መለያዎችን፣ ሁኔታ እና ምዝገባዎችን ያስተዳድሩ።"}
        actions={
          <Button
            size="sm"
            as={Link}
            href={`/${lang}/student/registration`}
            color="primary"
            endContent={<Plus className="size-4" />}
          >
            {lang === "en" ? "Add New Student" : "አዲስ ተማሪ ጨምር"}
          </Button>
        }
      />
      <CustomTable
        columns={[
          { label: lang == "en" ? "Name" : "ስም", key: "name", sortable: true },
          {
            label: lang == "en" ? "Age" : "እድሜእድሜ",
            key: "age",
            sortable: true,
          },
          {
            label: lang == "en" ? "Gender" : "ፆታፆታ",
            key: "gender",
            sortable: true,
          },
          {
            label: lang == "en" ? "Country" : "ሀሀገር",
            key: "country",
            sortable: true,
          },
          {
            label: lang == "en" ? "Region" : "ክልል",
            key: "region",
            sortable: true,
          },
          { label: lang == "en" ? "City" : "ከተማ", key: "city", sortable: true },
          {
            label: lang == "en" ? "Status" : "ሁኔታ",
            key: "status",
            align: "center",
          },
          {
            label: lang == "en" ? "Action" : "ድርጊት",
            key: "action",
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
            case "name": {
              return (
                <Button
                  size="sm"
                  as={Link}
                  href={`/${lang}/student/${rowData.id}`}
                  variant="light"
                >
                  {`${rowData.firstName} ${rowData.fatherName} ${rowData.lastName}`}
                </Button>
              );
            }
            case "status": {
              return (
                <UserStatusToggle
                  id={rowData.id}
                  status={rowData.status}
                  refresh={refresh}
                />
              );
            }
            case "action": {
              return (
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    as={Link}
                    href={`/${lang}/student/registration/${rowData.id}`}
                    variant="flat"
                    color="success"
                    isIconOnly
                  >
                    <Pen className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    onPress={() => setRemove(rowData.id)}
                    isIconOnly
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              );
            }
            default: {
              return `${value ?? ""}`;
            }
          }
        }}
        btns={
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                size="sm"
                variant="flat"
                color="primary"
                className="capitalize"
              >
                {((v) => (v.length === 1 ? v : "status"))(
                  Array.from(tableData.status)
                )}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="flat"
              color="primary"
              selectionMode="multiple"
              closeOnSelect={false}
              aria-label="Table Status"
              selectedKeys={tableData.status}
              onSelectionChange={(status) =>
                setTableData((prev) => ({ ...prev, status }))
              }
            >
              {["active", "inactive"].map((v) => (
                <DropdownItem key={v} className="capitalize ">
                  {v}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        }
      />
      {remove && (
        <RemoveStudent
          id={remove}
          refresh={refresh}
          onOpenChange={() => setRemove(undefined)}
        />
      )}
    </ScrollablePageWrapper>
  );
}
