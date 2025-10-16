"use client";

import { Moon, Sun } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useTheme } from "next-themes";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import Logo from "./Logo";

export default function GuestHeader() {
  const { lang = "en" } = useParams<{ lang: string }>() ?? {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const selectedSegment = useSelectedLayoutSegment();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const links = useMemo(
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
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      className="border-b"
      isBordered
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-8" justify="center">
        {links.map((item) => (
          <NavbarItem
            key={item.url}
            isActive={(selectedSegment || "") === item.url}
          >
            <Link
              href={`/${lang}/${item.url}`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        {/* Theme Toggle */}
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            color="warning"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </Button>
        </NavbarItem>

        {/* Language Switcher */}
        <NavbarItem>
          <Link
            href={`/${lang == "en" ? "am" : "en"}/${(pathname ?? "")
              .split("/")
              .slice(2)
              .join("/")}`}
          >
            <Button isIconOnly color="primary" variant="flat">
              {lang == "en" ? "አማ" : "En"}
            </Button>
          </Link>
        </NavbarItem>

        {/* Login/Signup - Desktop */}
        <NavbarItem className="hidden md:flex">
          <Link href={`/${lang}/login`}>
            <Button variant="light" color="primary">
              {lang == "en" ? "Login" : "መግቢያ"}
            </Button>
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Link href={`/${lang}/signup`}>
            <Button color="primary">{lang == "en" ? "Sign Up" : "መዝግብ"}</Button>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {links.map((item, index) => (
          <NavbarMenuItem key={`${item.url}-${index}`}>
            <Link
              className="w-full text-lg"
              href={`/${lang}/${item.url}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <div className="flex flex-col gap-2 pt-4 border-t w-full">
            <Link href={`/${lang}/login`} className="w-full">
              <Button variant="light" color="primary" fullWidth>
                {lang == "en" ? "Login" : "መግቢያ"}
              </Button>
            </Link>
            <Link href={`/${lang}/signup`} className="w-full">
              <Button color="primary" fullWidth>
                {lang == "en" ? "Sign Up" : "መዝግብ"}
              </Button>
            </Link>
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
