"use client";

import { AlignLeft, Globe2, LogIn, Moon, Sun, UserPlus, X } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useTheme } from "next-themes";
import { CButton } from "./heroui";
import Logo from "./Logo";

export default function GuestHeader() {
  const { lang = "en" } = useParams<{ lang: string }>() ?? {},
    [side, setSide] = useState(false),
    selectedSegment = useSelectedLayoutSegment(),
    { theme, setTheme } = useTheme(),
    pathname = usePathname(),
    links = useMemo(
      () => [
        { label: lang == "en" ? "Home" : "መነሻ", url: "" },
        // { label: lang == "en" ? "Online Education" : "ኦንላይን ትምህርት", url: "online" },
        // {
        //   label: lang == "en" ? "Education" : "ትምህርት",
        //   url: "course",
        // },
        // { label: lang == "en" ? "About" : "ስለ እኛ", url: "about" },
        {
          label: lang == "en" ? "Affiliate Registration" : "ተባባሪ",
          url: "affiliate",
        },
      ],
      [lang]
    );

  return (
    <header className="h-16 sm:h-20 z-50 fixed top-0 inset-x-0 bg-background/80 dark:bg-background/90 backdrop-blur-xl border-b border-divider dark:border-white/10 shadow-lg dark:shadow-2xl dark:shadow-black/20">
      {/* Desktop & Mobile Container */}
      <div className="h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex-shrink-0 z-50">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-2">
          {links.map(({ label, url }, i) => {
            const isActive = (selectedSegment || "") === url;
            return (
              <Link
                key={i}
                href={`/${lang}/` + url}
                className={cn(
                  "relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300",
                  isActive
                    ? "text-primary-600 dark:text-primary-400 bg-primary-100/80 dark:bg-primary-900/30"
                    : "text-foreground/70 dark:text-foreground/60 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-default-100 dark:hover:bg-white/5"
                )}
              >
                {/* Active Indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400 rounded-full" />
                )}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme Toggle */}
          <CButton
            isIconOnly
            variant="light"
            size="md"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="hover:bg-warning-100 dark:hover:bg-warning-900/20 transition-all duration-300 group"
          >
            {theme === "dark" ? (
              <Sun className="size-5 text-warning-500 group-hover:rotate-180 transition-transform duration-500" />
            ) : (
              <Moon className="size-5 text-warning-600 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </CButton>

          {/* Language Toggle */}
          <CButton
            isIconOnly
            variant="light"
            size="md"
            as={Link}
            href={`/${lang === "en" ? "am" : "en"}/${(pathname ?? "").split("/").slice(2).join("/")}`}
            className="hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-all duration-300 group"
          >
            <div className="flex items-center gap-1">
              <Globe2 className="size-4 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                {lang === "en" ? "አማ" : "En"}
              </span>
            </div>
          </CButton>

          {/* Divider */}
          <div className="w-px h-8 bg-divider dark:bg-white/10" />

          {/* Login */}
          <CButton
            variant="light"
            size="md"
            as={Link}
            href={`/${lang}/login`}
            startContent={<LogIn className="size-4" />}
            className="hover:bg-primary-100 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold transition-all duration-300"
          >
            {lang === "en" ? "Login" : "መግቢያ"}
          </CButton>

          {/* Sign Up */}
          <CButton
            variant="flat"
            size="md"
            as={Link}
            href={`/${lang}/signup`}
            startContent={<UserPlus className="size-4" />}
            className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-indigo-600 hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-700 dark:hover:to-indigo-700 text-white font-bold shadow-lg hover:shadow-xl dark:shadow-primary-900/50 transition-all duration-300 hover:scale-105"
          >
            {lang === "en" ? "Sign Up" : "መዝግብ"}
          </CButton>
        </div>

        {/* Mobile Menu Button */}
        <CButton
          isIconOnly
          variant="light"
          size="lg"
          onClick={() => setSide((prev) => !prev)}
          className="md:hidden hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-all duration-300"
        >
          {side ? (
            <X className="size-6 text-primary-600 dark:text-primary-400" />
          ) : (
            <AlignLeft className="size-6 text-primary-600 dark:text-primary-400" />
          )}
        </CButton>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-40 w-full transition-transform duration-300 ease-in-out",
          side ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full">
          {/* Menu Content */}
          <div className="w-[85%] max-w-sm h-full bg-background dark:bg-background/95 backdrop-blur-2xl border-r border-divider dark:border-white/10 shadow-2xl overflow-y-auto">
            {/* Mobile Logo */}
            <div className="p-6 border-b border-divider dark:border-white/10">
              <Logo />
            </div>

            {/* Mobile Navigation Links */}
            <nav className="p-4 space-y-2">
              {links.map(({ label, url }, i) => {
                const isActive = (selectedSegment || "") === url;
                return (
                  <Link
                    key={i}
                    href={`/${lang}/` + url}
                    onClick={() => setTimeout(() => setSide(false), 300)}
                    className={cn(
                      "block w-full px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-indigo-600 text-white shadow-lg dark:shadow-primary-900/50"
                        : "bg-default-100 dark:bg-white/5 text-foreground/70 dark:text-foreground/60 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Actions */}
            <div className="p-4 space-y-3 border-t border-divider dark:border-white/10 mt-4">
              {/* Theme Toggle */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-warning-100/50 dark:bg-warning-900/20">
                <div className="flex-1 flex items-center gap-3">
                  {theme === "dark" ? (
                    <Sun className="size-5 text-warning-500" />
                  ) : (
                    <Moon className="size-5 text-warning-600" />
                  )}
                  <span className="text-sm font-medium text-foreground/80 dark:text-foreground/70">
                    {lang === "en" ? "Theme" : "ገጽታ"}
                  </span>
                </div>
                <CButton
                  size="sm"
                  variant="flat"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="bg-warning-200 dark:bg-warning-800/50 font-semibold"
                >
                  {theme === "dark"
                    ? lang === "en"
                      ? "Light"
                      : "ብሩህ"
                    : lang === "en"
                    ? "Dark"
                    : "ጨለማ"}
                </CButton>
              </div>

              {/* Language Toggle */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-100/50 dark:bg-primary-900/20">
                <div className="flex-1 flex items-center gap-3">
                  <Globe2 className="size-5 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-medium text-foreground/80 dark:text-foreground/70">
                    {lang === "en" ? "Language" : "ቋንቋ"}
                  </span>
                </div>
                <CButton
                  size="sm"
                  variant="flat"
                  as={Link}
                  href={`/${lang === "en" ? "am" : "en"}/${(pathname ?? "").split("/").slice(2).join("/")}`}
                  className="bg-primary-200 dark:bg-primary-800/50 font-bold"
                >
                  {lang === "en" ? "አማርኛ" : "English"}
                </CButton>
              </div>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="p-4 space-y-3 border-t border-divider dark:border-white/10 mt-4">
              <CButton
                variant="flat"
                size="lg"
                as={Link}
                href={`/${lang}/login`}
                startContent={<LogIn className="size-5" />}
                onClick={() => setTimeout(() => setSide(false), 300)}
                className="w-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold"
              >
                {lang === "en" ? "Login" : "መግቢያ"}
              </CButton>
              <CButton
                variant="flat"
                size="lg"
                as={Link}
                href={`/${lang}/signup`}
                startContent={<UserPlus className="size-5" />}
                onClick={() => setTimeout(() => setSide(false), 300)}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-indigo-600 text-white font-bold shadow-lg dark:shadow-primary-900/50"
              >
                {lang === "en" ? "Sign Up" : "መዝግብ"}
              </CButton>
            </div>
          </div>

          {/* Overlay */}
          <div
            onClick={() => setSide(false)}
            className="flex-1 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          />
        </div>
      </div>
    </header>
  );
}
