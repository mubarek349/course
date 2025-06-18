"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AlignLeft, House } from "lucide-react";
import User from "./user";
import { BreadcrumbItem, Breadcrumbs, Button } from "@heroui/react";
import Link from "next/link";

export default function Header({
  setIsSide,
}: {
  setIsSide: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pathname = usePathname();

  return (
    <div className="py-2 px-2 md:pl-5 md:pr-10 grid max-md:gap-2 grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto] items-center">
      <Button
        isIconOnly
        variant="flat"
        color="primary"
        onPress={() => setIsSide((prev) => !prev)}
        className="md:hidden"
      >
        <AlignLeft className="" />
      </Button>
      <div className="">
        <Breadcrumbs
          variant="solid"
          color="primary"
          classNames={{ list: "bg-primary-100" }}
        >
          <BreadcrumbItem>
            <Link href="/">
              <House className="size-4" />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem
            as={Link}
            href={`/${pathname.split("/")[2]}`}
            className="capitalize"
          >
            {pathname.split("/")[2]}
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <User />
    </div>
  );
}
