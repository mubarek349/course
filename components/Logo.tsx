"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Logo() {
  const { lang } = useParams<{ lang: string }>();

  return (
    <Link href={`/${lang}/`} className="w-fit flex gap-2 px-1 md:px-4 py-1">
      <Image
        src={"/darulkubra.png"}
        alt=""
        height={1000}
        width={1000}
        className="size-10"
      />
      <p className="content-center text-2xl font-[900] bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
        {lang == "en" ? "DARULKUBRA" : "ዳሩልኩብራ"}
      </p>
    </Link>
  );
}
