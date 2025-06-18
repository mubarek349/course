"use client";

import useData from "@/hooks/useData";
import { getCourses, toggleCourseStatus } from "@/actions/manager/course";
import React, { useState } from "react";
import { Pen, Plus, Trash } from "lucide-react";
import useAction from "@/hooks/useAction";
import { removeCourse } from "@/actions/manager/course";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Selection,
} from "@heroui/react";
import CustomTable from "@/components/ui/custom-table";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { TTableData } from "@/lib/definations";

export default function Page() {
  const { lang } = useParams<{ lang: string }>(),
    pathname = usePathname(),
    [tableData, setTableData] = useState<TTableData & { status: Selection }>({
      search: "",
      selectedKeys: new Set([]),
      visibleColumns: "all",
      sortDescriptor: {
        column: "title",
        direction: "ascending",
      },
      rowsPerPage: 50,
      currentPage: 1,
      status: new Set([]),
    }),
    { data, loading, refresh } = useData({
      func: getCourses,
      args: [tableData],
    }),
    [toggle, setToggle] = useState<string>(),
    [remove, setRemove] = useState<string>();

  return (
    <div className="overflow-hidden">
      <CustomTable
        columns={[
          { label: "Thumbnail", key: "thumbnail" },
          { label: "Title", key: "title" },
          { label: "Sale", key: "sale", sortable: true },
          { label: "Affiliate Sale", key: "affiliateSale", sortable: true },
          { label: "Affiliate Income", key: "affiliateIncome", sortable: true },
          { label: "Seller Sale", key: "sellerSale", sortable: true },
          { label: "Seller Income", key: "sellerIncome", sortable: true },
          { label: "Status", key: "status", align: "center" },
          { label: "Actions", key: "actions", align: "center" },
        ]}
        data={{
          list: data?.list ?? [],
          totalData: data?.totalData ?? 0,
          totalPage: data?.totalPage ?? 1,
        }}
        loadingState={loading ? "loading" : "idle"}
        RenderCell={({ rowData, columnKey }) => {
          const cellValue =
            rowData[columnKey as keyof NonNullable<typeof data>["list"][0]];
          switch (columnKey) {
            case "thumbnail":
              return (
                <div className="rounded-xl overflow-hidden">
                  {
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      onClick={({ currentTarget }) => {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else if (document.fullscreenEnabled) {
                          currentTarget.requestFullscreen();
                        }
                      }}
                      alt=""
                      src={rowData.thumbnail}
                      className="size-10"
                    />
                  }
                </div>
              );
            case "title":
              return (
                <Button
                  size="sm"
                  variant="light"
                  className="max-w-80 justify-start"
                  as={Link}
                  href={`${pathname}/${rowData.id}`}
                >
                  {lang == "en" ? rowData.titleEn : rowData.titleAm}
                </Button>
              );
            case "status": {
              return (
                <div className="grid place-content-center">
                  <Button
                    size="sm"
                    variant="light"
                    color={rowData.status ? "success" : "danger"}
                    onPress={() => setToggle(rowData.id)}
                    className=""
                  >
                    {rowData.status ? "Active" : "InActive"}
                  </Button>
                </div>
              );
            }
            case "actions":
              return (
                <div className="relative flex justify-center items-center gap-2 ">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="success"
                    as={Link}
                    href={`${pathname}/registration/${rowData.id}`}
                  >
                    <Pen className="size-4" />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="danger"
                    onPress={() => setRemove(rowData.id)}
                    className=""
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              );
            default:
              return String(cellValue);
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
                  {Array.from(tableData.status).length == 1
                    ? Array.from(tableData.status)
                    : "status"}
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
              as={Link}
              href={`${pathname}/registration`}
            >
              <span className="">Add New</span>
            </Button>
          </>
        }
      />
      {toggle && (
        <ToggleCourse
          id={toggle}
          onClose={() => setToggle(undefined)}
          refresh={refresh}
        />
      )}
      {remove && (
        <RemoveCourse
          id={remove}
          onClose={() => setRemove(undefined)}
          refresh={refresh}
        />
      )}
    </div>
  );
}

function ToggleCourse({
  id,
  refresh,
  onClose,
}: {
  id: string;
  refresh: () => void;
  onClose: () => void;
}) {
  const { lang } = useParams<{ lang: string }>(),
    { action } = useAction(toggleCourseStatus, undefined, {
      loading: lang == "en" ? "toggle status course" : "ትምህርትን ኢ-ንቁ ማድረግ ላይ",
      success:
        lang == "en"
          ? "successfully toggled course status"
          : "ትምህርት በተሳካ ሁኔታ ኢ-ንቁ ሆኗል",
      error:
        lang == "en" ? "failed to toggle status course" : "ትምህርትን ኢ-ንቁ አልተሳካም",
      onSuccess({ status }) {
        if (status) {
          refresh();
          onClose();
        }
      },
    });

  return (
    <Modal
      isOpen={true}
      onOpenChange={() => onClose()}
      placement="center"
      classNames={{ wrapper: "p-5" }}
      backdrop="blur"
    >
      <ModalContent className="">
        {(onClose) => (
          <>
            <ModalHeader className=" ">
              {lang == "en" ? "Course Status Toggle" : "የትምህርት ኢ-ንቁ"}
            </ModalHeader>
            <ModalBody className="py-5 text-center ">
              {lang == "en" ? (
                <span>
                  Are you sure, you want to
                  <span className="text-primary"> toggle status </span> of the
                  course?
                </span>
              ) : (
                <span>
                  እርግጠኛ ነዎት ትምህርቱን
                  <span className="text-primary"> ኢ-ንቁ </span>
                  ማድረግ ይፈልጋሉ?
                </span>
              )}
            </ModalBody>
            <ModalFooter className="grid gap-2 grid-cols-2">
              <Button variant="flat" onPress={onClose} className="">
                {lang == "en" ? "Back" : "ተመለስ"}
              </Button>
              <Button
                color="primary"
                onPress={action.bind(undefined, id)}
                className=""
              >
                {lang == "en" ? "Toggle" : "ኢ-ንቁ"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
function RemoveCourse({
  id,
  onClose,
  refresh,
}: {
  id: string;
  onClose: () => void;
  refresh: () => void;
}) {
  const { lang } = useParams<{ lang: string }>(),
    { action } = useAction(removeCourse, undefined, {
      loading: lang == "en" ? "deleting course" : "ትምህርትን በመሰረዝ ላይ",
      success:
        lang == "en" ? "successfully deleted course" : "ትምህርት በተሳካ ሁኔታ ተሰርዟል",
      error: lang == "en" ? "failed to delete course" : "ትምህርትን መሰረዝ አልተሳካም",
      onSuccess() {
        refresh();
        onClose();
      },
    });

  return (
    <Modal
      isOpen={true}
      onOpenChange={() => onClose()}
      placement="center"
      backdrop="blur"
      classNames={{ wrapper: "p-5" }}
    >
      <ModalContent className="">
        {(onClose) => (
          <>
            <ModalHeader className="text-danger ">
              {lang == "en" ? "Course Deletion" : "የትምህርት መሰረዝ"}
            </ModalHeader>
            <ModalBody className="py-5 text-center ">
              {lang == "en" ? (
                <span>
                  Are you sure, you want to
                  <span className="text-danger"> delete </span>
                  the course?
                </span>
              ) : (
                <span>
                  እርግጠኛ ነዎት ትምህርቱን
                  <span className="text-danger"> መሰረዝ </span>
                  ይፈልጋሉ?
                </span>
              )}
            </ModalBody>
            <ModalFooter className="grid gap-2 grid-cols-2">
              <Button variant="flat" onPress={onClose}>
                {lang == "en" ? "Back" : "ተመለስ"}
              </Button>
              <Button color="danger" onPress={() => action(id)}>
                {lang == "en" ? "Delete" : "ሰርዝ"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
