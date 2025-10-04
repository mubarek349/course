"use client";

import { useTheme } from "next-themes";
import {
  useParams,
  usePathname,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Moon, Sun, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button, Tooltip } from "@heroui/react";
import { useState, useEffect } from "react";

export default function SideBar({
  isSide,
  setIsSide,
  lists,
}: {
  isSide: boolean;
  setIsSide: React.Dispatch<React.SetStateAction<boolean>>;
  lists: { label: string; url: string; icon: React.ReactNode }[];
}) {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  const pathname = usePathname();
  const selectedSegment = useSelectedLayoutSegment() || "";
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isSide && (
        <div
          onClick={() => setIsSide(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "z-50 transition-all duration-300",
          // Desktop styles - Fixed positioning
          "md:fixed md:left-0 md:top-0 md:flex md:flex-col md:h-screen",
          isCollapsed ? "md:w-20" : "md:w-72",
          // Mobile styles
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:w-80 max-md:transform",
          isSide ? "max-md:translate-x-0" : "max-md:-translate-x-full"
        )}
      >
        <div
          className={cn(
            "bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-xl border-r border-neutral-200/50 dark:border-neutral-800/50 shadow-soft grid grid-rows-[auto_1fr_auto] h-full transition-all duration-300",
            isCollapsed ? "md:w-20" : "md:w-72",
            "max-md:w-80"
          )}
        >
          {/* Header Section */}
          <div
            className={cn(
              "flex items-center justify-between p-6 border-b border-neutral-200/50 dark:border-neutral-800/50",
              isCollapsed && "md:justify-center md:px-4"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-3 transition-all duration-300",
                isCollapsed && "md:justify-center"
              )}
            >
              <div className="relative">
                <Image
                  src="/darulkubra.svg"
                  alt="Darul Kubra Logo"
                  width={32}
                  height={32}
                  className="size-8 transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-400 to-brand-600 rounded-full opacity-20 blur-sm" />
              </div>
              {!isCollapsed && (
                <Link
                  href="/"
                  className="text-lg font-bold bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 bg-clip-text text-transparent hover:from-brand-700 hover:to-brand-900 dark:hover:from-brand-300 dark:hover:to-brand-500 transition-all duration-300"
                >
                  {lang === "en" ? "DARUL KUBRA" : "ዳሩል ኩብራ"}
                </Link>
              )}
            </div>

            {/* Close Button - Mobile Only */}
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => setIsSide(false)}
              className="md:hidden text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <X className="size-5" />
            </Button>

            {/* Collapse Button - Desktop Only */}
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex text-neutral-600 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </Button>
          </div>

          {/* Navigation Section */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <nav className="p-4 space-y-2">
              {lists.map(({ label, url, icon }, i) => {
                const isActive = selectedSegment === url;
                return (
                  <Tooltip
                    key={i}
                    content={label}
                    placement="right"
                    isDisabled={!isCollapsed}
                    delay={500}
                  >
                    <Button
                      as={Link}
                      href={`/${lang}/${url}`}
                      onPress={() => setTimeout(() => setIsSide(false), 300)}
                      variant={isActive ? "flat" : "light"}
                      color={isActive ? "primary" : "default"}
                      size="md"
                      startContent={
                        <div
                          className={cn(
                            "transition-colors duration-200",
                            isActive
                              ? "text-brand-600 dark:text-brand-400"
                              : "text-neutral-600 dark:text-neutral-400"
                          )}
                        >
                          {icon}
                        </div>
                      }
                      className={cn(
                        "w-full justify-start font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                        isCollapsed && "md:justify-center md:px-0",
                        isActive &&
                          "bg-brand-50/50 dark:bg-brand-950/50 border-brand-200/50 dark:border-brand-800/50 shadow-inner-soft"
                      )}
                    >
                      {!isCollapsed && (
                        <span className="truncate text-sm">{label}</span>
                      )}
                    </Button>
                  </Tooltip>
                );
              })}
            </nav>
          </div>

          {/* Footer Section */}
          <div className="p-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
            <div
              className={cn(
                "flex gap-2",
                isCollapsed ? "flex-col" : "flex-row"
              )}
            >
              <Tooltip
                content={
                  theme === "dark"
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"
                }
                placement="right"
                isDisabled={!isCollapsed}
              >
                <Button
                  isIconOnly={isCollapsed}
                  variant="flat"
                  color="secondary"
                  size="sm"
                  onPress={() => setTheme(theme === "light" ? "dark" : "light")}
                  startContent={
                    theme === "dark" ? (
                      <Sun className="size-4 text-amber-500" />
                    ) : (
                      <Moon className="size-4 text-brand-600" />
                    )
                  }
                  className="transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {!isCollapsed && (
                    <span className="text-xs">
                      {theme === "dark" ? "Light" : "Dark"}
                    </span>
                  )}
                </Button>
              </Tooltip>

              <Tooltip
                content={`Switch to ${lang === "en" ? "Amharic" : "English"}`}
                placement="right"
                isDisabled={!isCollapsed}
              >
                <Button
                  isIconOnly={isCollapsed}
                  variant="flat"
                  color="secondary"
                  size="sm"
                  onPress={() =>
                    router.push(
                      `/${lang === "en" ? "am" : "en"}/${pathname
                        ?.split("/")
                        .slice(2)
                        .join("/")}`
                    )
                  }
                  className="transition-all duration-200 hover:scale-105 active:scale-95 font-semibold"
                >
                  <span className="text-xs font-bold">
                    {lang === "en" ? "አማ" : "EN"}
                  </span>
                  {!isCollapsed && (
                    <span className="text-xs opacity-70 ml-1">
                      {lang === "en" ? "አማርኛ" : "English"}
                    </span>
                  )}
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
