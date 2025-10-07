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
      "fixed top-0 z-50 w-full border-b border-gray-200/60 dark:border-slate-600/60 bg-gradient-to-r from-white/95 via-white/98 to-white/95 dark:from-slate-900/95 dark:via-slate-800/98 dark:to-slate-900/95 backdrop-blur-xl shadow-lg dark:shadow-black/20 transition-all duration-300",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-50/10 before:via-transparent before:to-indigo-50/10 dark:before:from-blue-950/5 dark:before:via-transparent dark:before:to-indigo-950/5 before:pointer-events-none",
      "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.08)_1px,transparent_0)] dark:after:bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.03)_1px,transparent_0)] after:[background-size:16px_16px] after:opacity-50 after:pointer-events-none",
      isCollapsed ? "md:left-20 md:w-[calc(100%-5rem)]" : "md:left-72 md:w-[calc(100%-18rem)]"
    )}>
      <div className="relative flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobile Menu Button */}
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onPress={() => setIsSide((prev) => !prev)}
          className="md:hidden text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all duration-200 rounded-lg"
        >
          <AlignLeft className="size-5" />
        </Button>

        {/* Breadcrumbs */}
        <div className="flex-1 flex items-center min-w-0">
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={item.href}>
                {index > 0 && (
                  <ChevronRight className="size-4 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                )}
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:shadow-md dark:hover:shadow-lg truncate font-medium",
                    index === breadcrumbItems.length - 1
                      ? "text-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-950/50 shadow-sm dark:shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
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
