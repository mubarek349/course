"use client";

import React from "react";
import { Button, Link } from "@heroui/react";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(),
    selectedSegment = pathname.split("/");
  return (
    <div className="max-md:flex flex-col-reverse md:grid grid-rows-[auto_1fr] overflow-hidden">
      <div className="max-md:pt-2 pb-2">
        <div className="md:w-fit p-1 bg-primary-100 rounded-xl grid gap-1 grid-cols-2">
          {[
            { label: "Overview", url: "" },
            { label: "Detail", url: "detail" },
          ].map(({ label, url }, i) => (
            <Button
              key={i + ""}
              size={"sm"}
              variant={(selectedSegment[4] ?? "") == url ? "flat" : "light"}
              color="primary"
              as={Link}
              href={`/${selectedSegment.slice(1, 4).join("/")}/${
                selectedSegment[4] ? url : url
              }`}
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
