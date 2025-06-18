"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  DropdownTrigger,
  DropdownItem,
  Pagination,
  Spinner,
  Button,
  Dropdown,
  DropdownMenu,
} from "@heroui/react";
import { Search } from "lucide-react";
import { TTableColumns, TTableData } from "@/lib/definations";
import { CInput } from "../heroui";

export default function CustomTable<
  Data extends { id: string },
  T extends { [index: string]: unknown }
>({
  columns,
  data,
  loadingState,
  RenderCell,
  tableData,
  setTableData,
  btns,
  selectable,
}: {
  columns: TTableColumns;
  data: { list: Data[]; totalData: number; totalPage: number };
  loadingState: "loading" | "idle";
  RenderCell: (props: {
    rowData: Data;
    columnKey: React.Key;
  }) => React.ReactNode;
  tableData: TTableData & T;
  setTableData: React.Dispatch<React.SetStateAction<TTableData & T>>;
  btns?: React.ReactNode;
  selectable?: boolean;
}) {
  const headerColumns = React.useMemo(() => {
    if (tableData.visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(tableData.visibleColumns).includes(column.key)
    );
  }, [tableData.visibleColumns, columns]);

  // pages = Math.ceil(data.length / rowsPerPage)

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 max-md:flex-col md:justify-between md:items-center">
          <CInput
            size="sm"
            className="w-full sm:max-w-[44%]"
            classNames={{
              inputWrapper: "border-primary/10",
            }}
            placeholder="Search here ..."
            startContent={<Search className="size-4" />}
            isClearable
            value={tableData.search}
            onValueChange={(search) => {
              setTableData((prev) => ({
                ...prev,
                search,
                currentPage: 1,
              }));
            }}
            onClear={() => {
              setTableData((prev) => ({ ...prev, search: "", currentPage: 1 }));
            }}
          />
          <div className="flex gap-2 max-md:flex-col md:items-center ">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button size="sm" color="primary" variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                color="primary"
                variant="flat"
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectionMode="multiple"
                selectedKeys={tableData.visibleColumns}
                onSelectionChange={(visibleColumns) =>
                  setTableData((prev) => ({ ...prev, visibleColumns }))
                }
              >
                {columns.map((column) => (
                  <DropdownItem key={column.key} className="capitalize">
                    {column.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {btns}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {data.totalData}
          </span>
          <label className="flex gap-1 items-center text-default-400 text-small  ">
            <p className="whitespace-nowrap">Rows </p>
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" color="primary" variant="flat">
                  {tableData.rowsPerPage}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                color="primary"
                variant="flat"
                selectionMode="single"
                disallowEmptySelection
                selectedKeys={new Set([tableData.rowsPerPage])}
                onSelectionChange={(v) => {
                  setTableData((prev) => ({
                    ...prev,
                    rowsPerPage: Number(Array.from(v)[0]),
                    currentPage: 1,
                  }));
                }}
              >
                {["50", "100", "150", "200"].map((v) => (
                  <DropdownItem key={v}>{v}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </label>
        </div>
      </div>
    );
  }, [tableData, data.totalData]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {tableData.selectedKeys === "all"
            ? "All items selected"
            : `${tableData.selectedKeys.size} of ${data.list.length} selected`}
        </span>
        <Pagination
          size="sm"
          color="primary"
          variant="flat"
          isCompact
          showControls
          showShadow
          total={data.totalPage}
          page={tableData.currentPage}
          onChange={(currentPage) =>
            setTableData((prev) => ({ ...prev, currentPage }))
          }
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            size="sm"
            variant="flat"
            isDisabled={data.totalPage === 1}
            onPress={() => {
              if (tableData.currentPage > 1) {
                setTableData((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }));
              }
            }}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="flat"
            isDisabled={data.totalPage === 1}
            onPress={() => {
              if (tableData.currentPage < data.totalPage) {
                setTableData((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }));
              }
            }}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [tableData, data.list.length, data.totalPage]);

  return (
    <Table
      isHeaderSticky
      // removeWrapper
      aria-label="Example table with custom cells, pagination and sorting"
      classNames={{
        wrapper:
          "flex-1 px-2 py-0 bg-transparent rounded-none shadow-none overflow-auto ",
        base: "h-full overflow-hidden",
        th: "bg-primary-100",
      }}
      className="h-full overflow-hidden"
      topContent={topContent}
      bottomContent={bottomContent}
      topContentPlacement="outside"
      bottomContentPlacement="outside"
      selectionMode={selectable ? "multiple" : "none"}
      selectedKeys={tableData.selectedKeys}
      onSelectionChange={(selectedKeys) =>
        setTableData((prev) => ({
          ...prev,
          selectedKeys,
        }))
      }
      sortDescriptor={tableData.sortDescriptor}
      onSortChange={(sortDescriptor) =>
        setTableData((prev) => ({
          ...prev,
          sortDescriptor,
        }))
      }
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.key}
            align={column.align ?? "start"}
            allowsSorting={column.sortable}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={data.list ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
        emptyContent={"No data found"}
        className="divide-y divide-primary-600/20"
      >
        {(rowData) => (
          <TableRow key={rowData.id}>
            {(columnKey) => (
              <TableCell>
                {<RenderCell rowData={rowData} columnKey={columnKey} />}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
