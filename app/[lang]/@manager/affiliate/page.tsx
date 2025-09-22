"use client";

import useAction from "@/hooks/useAction";
import useData from "@/hooks/useData";
import { Pen, Plus, Trash } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { getCoursesList } from "@/actions/manager/course";
import CustomTable from "@/components/ui/custom-table";
import { TTableData } from "@/lib/definations";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Selection,
} from "@heroui/react";
import { getAffiliates, removeAffiliate } from "@/actions/manager/affiliate";
import UserStatusToggle from "@/components/userStatusToggle";
import CustomDatePicker from "@/components/ui/custom-date-picker";
import ScrollablePageWrapper from "@/components/layout/ScrollablePageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import {
  endOfMonth,
  getLocalTimeZone,
  startOfMonth,
  today,
} from "@internationalized/date";

export default function Page() {
  const params= useParams<{ lang: string}>();
      const lang = params?.lang || "en",
    pathname = usePathname(),
    [tableData, setTableData] = useState<
      TTableData & {
        status: Selection;
        // allCourse: {
        //   id: string;
        //   titleEn: string;
        //   titleAm: string;
        // }[];
        // courseId: Selection;
        date: { start: Date; end: Date };
      }
    >({
      visibleColumns: "all",
      selectedKeys: new Set([]),
      sortDescriptor: { column: "", direction: "ascending" },
      search: "",
      currentPage: 1,
      rowsPerPage: 50,
      status: new Set([]),
      // allCourse: [],
      // courseId: new Set([]),
      date: {
        start: new Date(startOfMonth(today(getLocalTimeZone())).toString()),
        end: new Date(endOfMonth(today(getLocalTimeZone())).toString()),
      },
    }),
    { data, loading, refresh } = useData({
      func: getAffiliates,
      args: [tableData],
    }),
    [remove, setRemove] = useState<string>();

  useData({
    func: getCoursesList,
    args: [],
    onSuccess(allCourse) {
      setTableData((prev) => ({ ...prev, allCourse }));
    },
  });

  return (
    <ScrollablePageWrapper>
      <PageHeader
        title={lang === "en" ? "Affiliate Management" : "የአፊሊየት አስተዳደር"}
        subtitle={lang === "en" ? "Manage affiliate partners and their performance metrics." : "የአፊሊየት አጋሮችን እና አፈጻጸማቸውን ያስተዳድሩ።"}
        actions={
          <Button
            size="sm"
            color="primary"
            endContent={<Plus className="size-4" />}
            as={Link}
            href={`${pathname}/registration`}
          >
            {lang === "en" ? "Add New Affiliate" : "አዲስ አፊሊየት ጨምር"}
          </Button>
        }
      />
      <CustomTable
        columns={[
          { label: lang == "en" ? "Name" : "ስም", key: "name", sortable: true },
          {
            label: lang == "en" ? "Total Sale" : "ጠቅላላ ሽያጭ",
            key: "totalSale",
            sortable: true,
            align: "center",
          },
          {
            label: lang == "en" ? "Total Income" : "ጠቅላላ ገቢ",
            key: "totalIncome",
            sortable: true,
            align: "center",
          },
          {
            label: lang == "en" ? "Filtered Sale" : "የዚህ ወር ሽያጭ",
            key: "filteredSale",
            sortable: true,
            align: "center",
          },
          {
            label: lang == "en" ? "Filtered Income" : "የዚህ ወር ገቢ",
            key: "filteredIncome",
            sortable: true,
            align: "center",
          },
          {
            label: lang == "en" ? "This Month Sale" : "የዚህ ወር ሽያጭ",
            key: "thisMonthSale",
            sortable: true,
            align: "center",
          },
          {
            label: lang == "en" ? "This Month Income" : "የዚህ ወር ገቢ",
            key: "thisMonthIncome",
            sortable: true,
            align: "center",
          },
          {
            label: lang == "en" ? "Status" : "",
            key: "status",
            align: "center",
          },
          {
            label: lang == "en" ? "Actions" : "",
            key: "actions",
            align: "center",
          },
        ]}
        data={{
          list: data?.list ?? [],
          totalData: data?.totalData ?? 0,
          totalPage: data?.totalPage ?? 1,
        }}
        RenderCell={({ rowData, columnKey }) => {
          const value = rowData[columnKey as keyof typeof rowData];

          switch (columnKey) {
            case "name": {
              return (
                <Button
                  size="sm"
                  variant="light"
                  className="justify-start"
                  as={Link}
                  href={`/${pathname?.split("/")[1]}/affiliate/${rowData.id}`}
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
            case "actions": {
              return (
                <div className=" flex gap-2 justify-center ">
                  <Button
                    size="sm"
                    variant="flat"
                    color="success"
                    isIconOnly
                    as={Link}
                    href={`/${pathname?.split("/")[1]}/affiliate/registration/${
                      rowData.id
                    }`}
                  >
                    <Pen className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    isIconOnly
                    onPress={() => setRemove(rowData.id)}
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              );
            }
            default: {
              return value;
            }
          }
        }}
        loadingState={loading ? "loading" : "idle"}
        selectable
        tableData={tableData}
        setTableData={setTableData}
        btns={
          <>
            {/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  variant="flat"
                  endContent={<ChevronsUpDown strokeWidth={1} className="" />}
                >
                  Courses
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                selectionMode="multiple"
                classNames={{ base: "w-56" }}
                closeOnSelect={false}
                selectedKeys={tableData.courseId}
                onSelectionChange={(courseId) =>
                  setTableData((prev) => ({ ...prev, courseId }))
                }
              >
                {tableData.allCourse.map((v) => (
                  <DropdownItem key={v.id}>
                    {lang == "en" ? v.titleEn : v.titleAm}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
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
                {["active", "inactive", "pending"].map((v) => (
                  <DropdownItem key={v} className="capitalize ">
                    {v}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <CustomDatePicker
              date={tableData.date}
              setDate={(date) =>
                setTableData((prev) => ({ ...prev, date: date ?? prev.date }))
              }
              visibleMonths={2}
            />
            <Button
              size="sm"
              color="primary"
              endContent={<Plus className="size-4" />}
              as={Link}
              href={`/${pathname?.split("/")[1]}/affiliate/registration`}
            >
              Add New
            </Button>
            {/* <Button
              variant="flat"
              color="success"
              startContent={<DollarSign className="size-5" />}
              onPress={() => setTransfer(true)}
              isDisabled={Array.from(tableData.selectedKeys).length == 0}
            >
              Transfer
            </Button> */}
          </>
        }
      />
      {/* {transfer && (
        <TransferPayment
          selected={Array.from(tableData.selectedKeys).map((id) => ({
            id: `${id}`,
            income: 0,
          }))}
          refresh={refresh}
          onOpenChange={() => setTransfer(false)}
        />
      )} */}
      {remove && (
        <RemoveAffiliate
          id={remove}
          refresh={refresh}
          onOpenChange={() => setRemove(undefined)}
        />
      )}
    </ScrollablePageWrapper>
  );
}

function RemoveAffiliate({
  id,
  refresh,
  onOpenChange,
}: {
  id: string;
  refresh: () => void;
  onOpenChange: () => void;
}) {
  const params= useParams<{ lang: string}>();
      const lang = params?.lang || "en",
      
    { action, isPending } = useAction(removeAffiliate, undefined, {
      loading: lang == "en" ? "deleting affiliate" : "አስተዳዳሪን በመሰረዝ ላይ",
      success:
        lang == "en"
          ? "successfully deleted affiliate"
          : "አስተዳዳሪ በተሳካ ሁኔታ ተሰርዟል",
      error:
        lang == "en" ? "failed to delete affiliate" : "አስተዳዳሪን መሰረዝ አልተሳካም",
      onSuccess() {
        refresh();
        onOpenChange();
      },
    });

  return (
    <Modal
      isOpen={true}
      onOpenChange={onOpenChange}
      backdrop="blur"
      placement="center"
      classNames={{ wrapper: "p-5" }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-danger">
              {lang == "en" ? "Affiliate Deletion" : "የአስተዳዳሪ መሰረዝ"}
            </ModalHeader>
            <ModalBody>
              {lang == "en" ? (
                <span>
                  Are you sure you want to{" "}
                  <span className="text-danger">delete</span> the affiliate?
                </span>
              ) : (
                <span>
                  እርግጠኛ ነዎት አስተዳዳሪን <span className="text-danger">መሰረዝ</span>{" "}
                  ይፈልጋሉ?
                </span>
              )}
            </ModalBody>
            <ModalFooter className="grid gap-5 grid-cols-2">
              <Button variant="flat" onPress={() => onClose()}>
                {lang == "en" ? "Back" : "ተመለስ"}
              </Button>
              <Button
                color="danger"
                onPress={() => action(id)}
                isLoading={isPending}
              >
                {lang == "en" ? "Delete" : "ሰርዝ"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
