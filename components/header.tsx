"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AlignLeft, ChevronRight } from "lucide-react";
import User from "./user";
import { Button } from "@heroui/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Header({
  setIsSide,
  isCollapsed = false,
}: {
  setIsSide: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapsed?: boolean;
}) {
  const pathname = usePathname();
  const pathSegments = pathname?.split("/").filter(Boolean) || [];

  // Generate breadcrumb items from path
  const breadcrumbItems = [
    // { label: "Home", href: "/", icon: <House className="size-4" /> },
    ...pathSegments.slice(1).map((segment, index) => ({
      label:
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      href: `/${pathSegments.slice(0, index + 2).join("/")}`,
      icon: undefined,
    })),
  ];

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm transition-all duration-300",
      isCollapsed ? "md:left-20 md:w-[calc(100%-5rem)]" : "md:left-72 md:w-[calc(100%-18rem)]"
    )}>
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobile Menu Button */}
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onPress={() => setIsSide((prev) => !prev)}
          className="md:hidden text-neutral-600 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-all duration-200"
        >
          <AlignLeft className="size-5" />
        </Button>

        {/* Breadcrumbs */}
        <div className="flex-1 flex items-center min-w-0">
          <nav className="flex items-center space-x-1 text-sm text-neutral-600 dark:text-neutral-400">
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={item.href}>
                {index > 0 && (
                  <ChevronRight className="size-4 text-neutral-400 dark:text-neutral-600 flex-shrink-0" />
                )}
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-200 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-700 dark:hover:text-brand-300 truncate",
                    index === breadcrumbItems.length - 1
                      ? "text-brand-700 dark:text-brand-300 font-medium"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  )}
                >
                  {index === 0 && item.icon}
                  <span className="truncate">{item.label}</span>
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-2">
          <User />
        </div>
      </div>
    </header>
  );
}
