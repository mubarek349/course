"use client";

import React, { useState } from "react";
import Registration, { TRequiredFormSchema } from "./registration";
import CustomTable from "@/components/ui/custom-table";
import useData from "@/hooks/useData";
import UserStatusToggle from "@/components/userStatusToggle";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
} from "@heroui/react";
import { Pen, Plus, Trash } from "lucide-react";
import RemoveInstructor from "./removeInstructor";
import { TTableData } from "@/lib/definations";
import { getInstructors } from "@/actions/manager/instuctor";
import ScrollablePageWrapper from "@/components/layout/ScrollablePageWrapper";
import PageHeader from "@/components/layout/PageHeader";

export default function Page() {
  const [tableData, setTableData] = useState<
      TTableData & { status: Selection }
    >({
      visibleColumns: new Set(["name", "phoneNumber", "status", "action"]),
      selectedKeys: new Set([]),
      sortDescriptor: {
        column: "name",
        direction: "ascending",
      },
      search: "",
      rowsPerPage: 50,
      currentPage: 1,
      status: new Set([]),
    }),
    { data, loading, refresh } = useData({
      func: getInstructors,
      args: [tableData],
    }),
    [registration, setRegistration] = useState<true | TRequiredFormSchema>(),
    [remove, setRemove] = useState<string>();

  return (
    <ScrollablePageWrapper>
      <PageHeader
        title="Instructor Management"
        subtitle="Manage instructor accounts, status, and assignments."
        actions={
          <Button
            size="sm"
            color="primary"
            endContent={<Plus className="size-4" />}
            onPress={() => setRegistration(true)}
          >
            Add New Instructor
          </Button>
        }
      />
      <CustomTable
        columns={[
          { label: "Name", key: "name", sortable: true },
          { label: "Age", key: "age", sortable: true },
          { label: "Gender", key: "gender", sortable: true },
          { label: "Phone Number", key: "phoneNumber", sortable: true },
          { label: "country", key: "country", sortable: true },
          { label: "Region", key: "region" },
          { label: "City", key: "city" },
          { label: "Status", key: "status", align: "center" },
          { label: "Action", key: "action", align: "center" },
        ]}
        data={{
          list: [...(data?.list ?? [])],
          totalData: data?.totalData ?? 0,
          totalPage: data?.totalPage ?? 1,
        }}
        loadingState={loading ? "loading" : "idle"}
        RenderCell={({ rowData, columnKey }) => {
          const cellValue = rowData[columnKey as keyof typeof rowData];

          switch (columnKey) {
            case "name": {
              return (
                <p className="">{`${rowData.firstName} ${rowData.fatherName} ${rowData.lastName}`}</p>
              );
            }
            case "status": {
              return (
                <div className="grid place-content-center">
                  <UserStatusToggle
                    id={rowData.id}
                    status={rowData.status}
                    refresh={refresh}
                  />
                </div>
              );
            }
            case "action": {
              return (
                <div className="flex gap-2 items-center justify-center">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="primary"
                    onPress={() =>
                      setRegistration({
                        id: rowData.id,
                        firstName: rowData.firstName,
                        fatherName: rowData.fatherName,
                        lastName: rowData.lastName,
                        phoneNumber: rowData.phoneNumber,
                      })
                    }
                  >
                    <Pen className="size-4" />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="danger"
                    onPress={() => setRemove(rowData.id)}
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              );
            }
            default: {
              return `${cellValue || "-"}`;
            }
          }
        }}
        tableData={tableData}
        setTableData={setTableData}
        btns={
          <>
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
                  <DropdownItem key={v} className="capitalize">
                    {v}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              size="sm"
              color="primary"
              endContent={<Plus className="size-4" />}
              onPress={() => setRegistration(true)}
            >
              Add New
            </Button>
          </>
        }
      />
      <Registration
        registration={registration}
        onClose={() => setRegistration(undefined)}
        refresh={refresh}
      />
      {remove && (
        <RemoveInstructor
          id={remove}
          onClose={() => setRemove(undefined)}
          refresh={refresh}
        />
      )}
    </ScrollablePageWrapper>
  );
}
