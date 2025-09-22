"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AlertTriangle, Mail } from "lucide-react";
import { Button } from "@heroui/react";

export default function Page() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="card p-8 md:p-12 max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mb-4">
            <AlertTriangle className="size-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
            {lang === "en" ? "Account Inactive" : "መለያ ኢንቁ"}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {lang === "en" ? (
              <>
                Your account is temporarily inactive.
                <br />
                Please contact our support team for assistance.
              </>
            ) : (
              <>
                መለያዎ ለጊዜው ኢንቁ ሆኗል።
                <br />
                እባክዎን የድጋፍ ቡድናችንን ያነጋግሩ።
              </>
            )}
          </p>
        </div>
        
        <Button
          color="primary"
          variant="flat"
          startContent={<Mail className="size-4" />}
          className="w-full"
        >
          {lang === "en" ? "Contact Support" : "ድጋፍ ያግኙ"}
        </Button>
      </div>
    </div>
  );
}
