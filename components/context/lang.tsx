"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(),
    router = useRouter();

  useEffect(() => {
    if (!["en", "am"].includes(pathname.split("/")[1])) {
      router.replace(`/en/`);
    }
  });

  return children;
}
