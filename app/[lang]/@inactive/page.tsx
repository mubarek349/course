"use client";

import React from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const params= useParams<{ lang: string }>();
    const lang = params?.lang || "en";
    return (
    <div className="grid place-content-center">
      <div className="p-10 bg-primary-100 rounded-xl grid gap-5">
        <h1 className="text-4xl font-bold text-center text-danger">
          {lang == "en" ? "InActive" : "ኢ-ንቁ"}
        </h1>
        <p className="text-center">
          {lang == "en" ? (
            <>
              Your account is temporarily inactive,
              <br />
              Please contact the Support Center for more information
            </>
          ) : (
            <>
              መለያዎ ለጊዜው ኢንቁ ሆኗል,
              <br />
              ለበለጠ መረጃ እባክዎን የድጋፍ ማእከልን ያነጋግሩ
            </>
          )}
        </p>
      </div>
    </div>
  );
}
