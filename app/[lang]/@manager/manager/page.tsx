"use client";

import { getManagers } from "@/actions/manager/manager";
import CustomTable from "@/components/ui/custom-table";
import UserStatusToggle from "@/components/userStatusToggle";
import useData from "@/hooks/useData";
import { TTableData } from "@/lib/definations";
import { Button, Chip, Link } from "@heroui/react";
import { Pen, Plus, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { RemoveManager } from "./removeManager";
import { Permission } from "./permission";

export default function Page() {
  const { lang } = useParams<{ lang: string }>(),
    [tableData, setTableData] = useState<TTableData>({
      search: "",
      currentPage: 1,
      rowsPerPage: 50,
      selectedKeys: new Set([]),
      sortDescriptor: {
        column: "name",
        direction: "ascending",
      },
      visibleColumns: "all",
    }),
    { data, loading, refresh } = useData({
      func: getManagers,
      args: [tableData],
    }),
    [permission, setPermission] = useState<{
      id: string;
      permission: string[];
    }>(),
    [remove, setRemove] = useState<string>();

  return (
    <div className="overflow-hidden">
      <CustomTable
        columns={[
          { label: lang == "en" ? "Name" : "", key: "name", sortable: true },
          {
            label: lang == "en" ? "Gender" : "",
            key: "gender",
            sortable: true,
          },
          { label: lang == "en" ? "Age" : "", key: "age", sortable: true },
          {
            label: lang == "en" ? "Country" : "",
            key: "country",
            sortable: true,
          },
          {
            label: lang == "en" ? "Region" : "",
            key: "region",
            sortable: true,
          },
          { label: lang == "en" ? "City" : "", key: "city", sortable: true },
          {
            label: lang == "en" ? "Permission" : "",
            key: "permission",
            // align: "center",
          },
          {
            label: lang == "en" ? "Status" : "",
            key: "status",
            align: "center",
          },
          {
            label: lang == "en" ? "Action" : "",
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
              return `${rowData.firstName} ${rowData.firstName} ${rowData.firstName}`;
            }
            case "permission": {
              return (
                <div className="w-60 flex gap-1 flex-wrap justify-center- items-center ">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="success"
                    onPress={() =>
                      setPermission({
                        id: rowData.id,
                        permission: rowData.permission.map((v) => v.permission),
                      })
                    }
                  >
                    <Pen className="size-4" />
                  </Button>
                  {rowData.permission.map((v, i) => (
                    <Chip key={i + ""} size="sm" variant="flat" color="primary">
                      {v.permission}
                    </Chip>
                  ))}
                </div>
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
                <div className="flex gap-2 justify-center ">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="success"
                    as={Link}
                    href={`/${lang}/manager/registration/${rowData.id}`}
                  >
                    <Pen className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    isIconOnly
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
              return `${value ?? ""}`;
            }
          }
        }}
        btns={
          <>
            <Button
              size="sm"
              color="primary"
              endContent={<Plus className="size-4" />}
              as={Link}
              href={`/${lang}/manager/registration`}
            >
              Add New
            </Button>
          </>
        }
      />
      {permission && (
        <Permission
          data={permission}
          refresh={refresh}
          onOpenChange={() => setPermission(undefined)}
        />
      )}
      {remove && (
        <RemoveManager
          id={remove}
          refresh={refresh}
          onOpenChange={() => setRemove(undefined)}
        />
      )}
    </div>
  );
}
