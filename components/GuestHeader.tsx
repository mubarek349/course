"use client";

import { AlignLeft, Moon, Sun, X } from "lucide-react";
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
    <div className="h-16 z-40 fixed top-0 inset-x-0 md:backdrop-blur-3xl shadow flex ">
      <div
        className={cn(
          "z-50 md:flex-1 flex  ",
          side ? "max-md:fixed inset-x-0 left-0 max-md:h-dvh" : "max-md:hidden"
        )}
      >
        <div className="max-md:max-w-80 max-md:w-[80%] md:flex-1 p-2 bg-background/50 max-md:backdrop-blur-3xl max-md:shadow-md flex max-md:flex-col gap-x-4 gap-y-2 max-md:divide-y divide-primary-700/30 ">
          <Logo />
          <div className="flex-1 max-md:p-10 flex max-md:flex-col max-md:gap-y-4 md:gap-x-4 items-center md:justify-center">
            {links.map(({ label, url }, i) => (
              <div
                key={i + ""}
                className={cn("relative max-md:w-full md:min-w-40 grid ")}
              >
                <CButton
                  as={Link}
                  color="primary"
                  variant={(selectedSegment || "") === url ? "flat" : "light"}
                  href={`/${lang}/` + url}
                  onClick={() => setTimeout(() => setSide(false), 300)}
                  className={"z-10"}
                >
                  {label}
                </CButton>
              </div>
            ))}
          </div>
          <div className="max-md:p-5 grid grid-cols-2 gap-x-4 items-center">
            <CButton
              isIconOnly
              variant="flat"
              color="warning"
              onClick={() =>
                setTheme((prev) => (prev == "light" ? "dark" : "light"))
              }
            >
              {theme == "dark" ? (
                <Sun className="size-5 " />
              ) : (
                <Moon className="size-5 " />
              )}
            </CButton>
            <CButton
              isIconOnly
              color="primary"
              variant="flat"
              as={Link}
              href={`/${lang == "en" ? "am" : "en"}/${(pathname ?? "")
                .split("/")
                .slice(2)
                .join("/")}`}
              className="btn-light-primary size-10 place-self-center rounded-xl "
            >
              {lang == "en" ? "አማ" : "En"}
            </CButton>
          </div>
        </div>
        <div
          onClick={() => setSide(false)}
          className="md:hidden flex-1 bg-foreground/30 "
        />
      </div>

      <div className="max-md:flex-1 bg-background/50 max-md:backdrop-blur-3xl p-2 flex gap-4 items-center max-md:justify-between">
        <CButton
          isIconOnly
          variant="flat"
          color="primary"
          onClick={() => setSide((prev) => !prev)}
          className="md:hidden"
        >
          {side ? <X className="size-8" /> : <AlignLeft className="size-8" />}
        </CButton>
        <div className="gap-2">
          <CButton
            color="primary"
            variant="flat"
            as={Link}
            href={`/${lang}/login`}
            className="btn-light-primary w-30 ml-3"
          >
            {lang == "en" ? "Login" : "መግቢያ"}
          </CButton>
          <CButton
            color="primary"
            variant="flat"
            as={Link}
            href={`/${lang}/signup`}
            className="bg-red-200 w-30 ml-3"
          >
            {lang == "en" ? "Sign Up" : "መዝግብ"}
          </CButton>
        </div>
      </div>
    </div>
  );
}
