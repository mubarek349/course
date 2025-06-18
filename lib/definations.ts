import { z } from "zod";
import {
  affiliateSchema,
  affiliateSchemaSelf,
  courseSchema,
  managerSchema,
  sellerSchema,
  studentSchema,
} from "./zodSchema";
import { Selection, SortDescriptor } from "@heroui/react";

export type TManager = z.infer<typeof managerSchema>;
export type TAffiliate = z.infer<typeof affiliateSchema>;
export type TAffiliateSelf = z.infer<typeof affiliateSchemaSelf>;
export type TSeller = z.infer<typeof sellerSchema>;
export type TStudent = z.infer<typeof studentSchema>;
export type TCourse = z.infer<typeof courseSchema>;

export type StateType =
  | { status: true; cause?: undefined; message?: undefined }
  | { status: false; cause: string; message: string }
  | undefined;

export type TTableData = {
  visibleColumns: Selection;
  selectedKeys: Selection;
  sortDescriptor: SortDescriptor;
  search: string;
  rowsPerPage: number;
  currentPage: number;
};

export type TTableColumns = {
  label: React.ReactNode;
  key: string;
  align?: "start" | "center" | "end";
  sortable?: boolean;
}[];
