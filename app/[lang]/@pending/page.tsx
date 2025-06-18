"use client";

import React from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const { lang } = useParams<{ lang: string }>();
  return (
    <div className="grid place-content-center">
      <div className="p-10 bg-primary-100 rounded-xl grid gap-5">
        <h1 className="text-4xl font-bold text-center text-warning">
          {lang == "en" ? "Pending" : ""}
        </h1>
        <p className="text-center">
          {lang == "en" ? (
            <>
              Your account is currently pending,
              <br />
              Please wait for approval
            </>
          ) : (
            <>
              መለያዎ በአሁኑ ጊዜ በመጠባበቅ ላይ ነው,
              <br />
              እባክዎ እስኪፀድቅልዎት ይጠብቁ
            </>
          )}
        </p>
      </div>
    </div>
  );
}
