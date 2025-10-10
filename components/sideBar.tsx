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
  isCollapsed,
  setIsCollapsed,
}: {
  isSide: boolean;
  setIsSide: React.Dispatch<React.SetStateAction<boolean>>;
  lists: { label: string; url: string; icon: React.ReactNode }[];
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  const pathname = usePathname();
  const selectedSegment = useSelectedLayoutSegment() || "";
  const router = useRouter();
  const { theme, setTheme } = useTheme();
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
          className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "transition-all duration-300",
          "md:z-50 max-md:z-[60]", // Higher z-index for mobile to appear above header
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
            "bg-gradient-to-b from-white/98 via-white/95 to-white/90 dark:from-gray-900/98 dark:via-gray-800/95 dark:to-gray-900/90 backdrop-blur-xl border-r border-gray-200/60 dark:border-gray-700/60 shadow-xl dark:shadow-2xl grid grid-rows-[auto_1fr_auto] h-full transition-all duration-300 relative overflow-hidden",
            "before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-50/30 before:via-transparent before:to-purple-50/20 dark:before:from-blue-950/20 dark:before:via-transparent dark:before:to-purple-950/10 before:pointer-events-none",
            "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.02)_0%,transparent_50%)] dark:after:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.01)_0%,transparent_50%)] after:pointer-events-none",
            isCollapsed ? "md:w-20" : "md:w-72",
            "max-md:w-80"
          )}
        >
          {/* Header Section */}
          <div
            className={cn(
              "relative flex items-center justify-between p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-900/50 dark:to-gray-900/30",
              isCollapsed && "md:justify-center md:px-4"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-3 transition-all duration-300",
                isCollapsed && "md:justify-center"
              )}
            >
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300" />
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-2 shadow-lg">
                  <Image
                    src="/darulkubra.svg"
                    alt="Darul Kubra Logo"
                    width={32}
                    height={32}
                    className="size-8 transition-transform duration-300 group-hover:scale-110 filter brightness-0 invert"
                  />
                </div>
              </div>
              {!isCollapsed && (
                <Link
                  href="/"
                  className="text-xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent hover:from-blue-600 hover:via-purple-600 hover:to-blue-600 dark:hover:from-blue-400 dark:hover:via-purple-400 dark:hover:to-blue-400 transition-all duration-300"
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
              className="md:hidden text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-200 rounded-lg"
            >
              <X className="size-5" />
            </Button>

            {/* Collapse Button - Desktop Only */}
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all duration-200 rounded-lg"
            >
              {isCollapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </Button>
          </div>

          {/* Navigation Section */}
          <div className="flex-1 overflow-y-auto scrollbar-hide bg-gradient-to-b from-transparent via-gray-50/30 to-gray-100/50 dark:from-transparent dark:via-gray-800/30 dark:to-gray-900/50">
            <nav className="p-4 space-y-3">
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
                      variant="light"
                      size="md"
                      startContent={
                        <div
                          className={cn(
                            "transition-all duration-200",
                            isActive
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-600 dark:text-gray-400"
                          )}
                        >
                          {icon}
                        </div>
                      }
                      className={cn(
                        "w-full justify-start font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-xl",
                        isCollapsed && "md:justify-center md:px-0",
                        isActive
                          ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200/50 dark:border-blue-800/50 shadow-lg dark:shadow-xl text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:shadow-md dark:hover:shadow-lg hover:text-gray-900 dark:hover:text-gray-100"
                      )}
                    >
                      {!isCollapsed && (
                        <span className="truncate text-sm font-semibold">
                          {label}
                        </span>
                      )}
                    </Button>
                  </Tooltip>
                );
              })}
            </nav>
          </div>

          {/* Footer Section */}
          <div className="p-4 border-t border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-900/50 dark:to-gray-900/30">
            <div
              className={cn(
                "flex gap-3",
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
                  variant="light"
                  color="secondary"
                  size="sm"
                  onPress={() => setTheme(theme === "light" ? "dark" : "light")}
                  startContent={
                    theme === "dark" ? (
                      <Sun className="size-4 text-amber-500" />
                    ) : (
                      <Moon className="size-4 text-indigo-600 dark:text-indigo-400" />
                    )
                  }
                  className="transition-all duration-200 hover:scale-105 active:scale-95 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {!isCollapsed && (
                    <span className="text-xs font-semibold">
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
                  variant="light"
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
                  className="transition-all duration-200 hover:scale-105 active:scale-95 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
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
