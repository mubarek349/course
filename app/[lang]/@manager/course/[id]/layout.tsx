"use client";

import React from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const selectedSegment = pathname?.split("/") || [];
  const segment4 = selectedSegment[4] || "";

  // Ensure we have enough segments to avoid undefined errors
  const basePath =
    selectedSegment.length >= 4 ? selectedSegment.slice(1, 4).join("/") : "";

  return (
    <div className="max-md:flex flex-col-reverse md:grid grid-rows-[auto_1fr] overflow-hidden">
      <div className="max-md:pt-2 pb-2">
        <div className="md:w-fit p-1 bg-primary-100 rounded-xl grid gap-1 grid-cols-2">
          {[
            { label: "Overview", url: "" },
            { label: "Detail", url: "detail" },
          ].map(({ label, url }, i) => (
            <Button
              key={i}
              size={"sm"}
              variant={segment4 == url ? "flat" : "light"}
              color="primary"
              as={Link}
              href={`/${basePath}/${url}`}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
