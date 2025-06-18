import React from "react";
import { cn } from "@/lib/utils";

type THeaderCell<T> = {
  [K in keyof T]: {
    label: React.ReactNode;
    key?: K;
    cell?: (v: T[K], i: number, row: T) => React.ReactNode;
    children?: (THeaderCell<T> | undefined)[];
  };
}[keyof T];

export default function Table<T>({
  header,
  data,
  className,
}: {
  header: (THeaderCell<T> | undefined)[];
  data: T[];
  className?: string;
}) {
  return (
    <div className={cn("relative h-full overflow-auto ", className)}>
      <table className="min-w-fit w-full ">
        <thead
          className={cn(
            "sticky top-0 backdrop-blur-3xl rounded-md shadow shadow-primary-600/30 "
          )}
        >
          <tr className="rounded-t-md">
            {((value) =>
              value.map((v, i) => (
                <th
                  rowSpan={v?.children ? 1 : 2}
                  colSpan={v?.children ? v.children.length : 1}
                  key={i + ""}
                  className={cn(
                    "p-2 font-normal bg-white  ",
                    i == 0
                      ? `rounded-tl-md ${!v?.children ? "rounded-bl-md" : ""}`
                      : i == value.length - 1
                      ? `rounded-tr-md ${!v?.children ? "rounded-br-md" : ""}`
                      : "border-x"
                  )}
                >
                  {v?.label}
                </th>
              )))(header.filter((v) => !!v))}
          </tr>
          <tr className="rounded-b-md">
            {((value) =>
              value.map((v, i) => (
                <th
                  key={i + ""}
                  className={cn(
                    "p-2 font-normal bg-white ",
                    i == 0
                      ? header[0]?.children
                        ? "rounded-bl-md"
                        : ""
                      : i == value.length - 1
                      ? header[header.length - 1]?.children
                        ? "rounded-br-md "
                        : ""
                      : "border-x"
                  )}
                >
                  {v?.label}
                </th>
              )))(
              header
                .map((v) => v?.children)
                .filter((v) => !!v)
                .reduce((a, c) => [...a, ...c], [])
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-primary-600/30">
          {data.map((value, index) => (
            <tr key={index + ""} className="hover:bg-primary-700/5 [&>*]:p-2 ">
              {header
                .filter((v) => !!v)
                .map((row, i) =>
                  row?.children ? (
                    <>
                      {row.children
                        .filter((v) => !!v)
                        .map((v, i) => (
                          <td key={i + ""} className="p-2 ">
                            {v?.cell
                              ? v.cell(value[v.key!], i, value)
                              : (value[v!.key!] as string)}
                          </td>
                        ))}
                    </>
                  ) : (
                    <td key={i + ""} className="p-2 ">
                      {row?.cell
                        ? row.cell(value[row.key!], index, value)
                        : (value[row!.key!] as string)}
                    </td>
                  )
                )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
