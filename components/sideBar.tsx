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
import { Moon, Sun } from "lucide-react";
import { Button } from "@heroui/react";

export default function SideBar({
  isSide,
  setIsSide,
  lists,
}: {
  isSide: boolean;
  setIsSide: React.Dispatch<React.SetStateAction<boolean>>;
  lists: { label: string; url: string; icon: React.ReactNode }[];
}) {
  const { lang } = useParams<{ lang: string }>(),
    pathname = usePathname(),
    selectedSegment = useSelectedLayoutSegment() || "",
    router = useRouter(),
    { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "z-50 absolute md:relative max-md:inset-0 max-md:bg-background/50 overflow-hidden- md:grid max-md:grid-cols-[1fr_auto] ",
        isSide ? "max-md:grid" : "max-md:hidden"
      )}
    >
      <div
        className={cn(
          " md:w-60 bg-primary-100 md:shadow-md md:shadow-primary/20 grid grid-rows-[auto_1fr_auto] "
        )}
      >
        <div className="h-36 pb-16 flex gap-1 justify-center items-center  ">
          <Image
            src={"/darulkubra.svg"}
            alt=""
            width={1000}
            height={1000}
            className="size-7  "
          />
          <Link
            href={"/"}
            className="text-xl font-[900] bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"
          >
            {lang == "en" ? "DARUL KUBRA" : "ዳሩል ኩብራ"}
          </Link>
        </div>
        <div className="px-5 grid gap-1 auto-rows-min">
          {lists.map(({ label, url, icon }, i) => (
            <Button
              key={i + ""}
              as={Link}
              href={`/${lang}/${url}`}
              onPress={() => setTimeout(() => setIsSide(false), 1100)}
              color={"primary"}
              size="sm"
              variant={selectedSegment == url ? "flat" : "light"}
              startContent={icon}
              className={"justify-start "}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="h-16 p-2 grid grid-cols-2 [&>*]:place-self-center  ">
          <Button
            isIconOnly
            color="primary"
            variant="flat"
            onPress={() =>
              setTheme((prev) => (prev == "light" ? "dark" : "light"))
            }
          >
            {theme == "dark" ? (
              <Sun className="size-6 stroke-warning-600 fill-warning-600 " />
            ) : (
              <Moon className="size-6 stroke-none fill-warning-600 " />
            )}
          </Button>
          <Button
            isIconOnly
            color="primary"
            variant="flat"
            onPress={() =>
              router.push(
                `/${lang == "en" ? "am" : "en"}/${pathname
                  .split("/")
                  .slice(2)
                  .join("/")}`
              )
            }
          >
            {lang == "en" ? "EN" : "አማ"}
          </Button>
        </div>
      </div>
      <div
        onClick={() => setIsSide(false)}
        className="md:hidden w-[25dvw] bg-black/20 backdrop-blur-sm  "
      />
    </div>
  );
}
