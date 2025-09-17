"use client";

import useAction from "@/hooks/useAction";
import { redirectToBot } from "@/lib/action";
import { verifyPayment } from "@/lib/action/chapa";
import { Button, Spinner } from "@heroui/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
  const params = useParams<{ lang: string; tx_ref?: string }>();
  const lang = params?.lang || "en";
  const tx_ref = params?.tx_ref;
  const router = useRouter();
  const { action, isPending, state } = useAction(verifyPayment, undefined, {
    onSuccess(state) {
      console.log(state);
    },
  });
  const { action: redirectAction, isPending: redirectPending } = useAction(
    redirectToBot,
    undefined
  );

  useEffect(() => {
    if (tx_ref) {
      action(tx_ref);
    }
  }, [tx_ref]);

  // Handle case where tx_ref is not available
  if (!tx_ref) {
    return (
      <div className="h-dvh grid gap-y-4 place-content-center">
        <p className="text-danger-600">
          {lang == "en" ? "Invalid payment reference" : "ዋጋ የሌለው የክፍያ ማመልከቻ"}
        </p>
        <Button
          variant="flat"
          color="primary"
          as={Link}
          href={`/${lang}/course`}
        >
          {lang == "en" ? "Go to Courses" : "ወደ ኮርሶች ይሂዱ"}
        </Button>
      </div>
    );
  }

  return (
    <div className="h-dvh grid gap-y-4 place-content-center ">
      {isPending ? (
        <>
          <p className="text-warning-600">
            {lang == "en" ? "verifying Payment" : "ክፍያን ማረጋገጥ"}
          </p>
          <Spinner className="" />
        </>
      ) : state ? (
        state.status ? (
          <>
            <p className="text-success-600">
              {lang == "en" ? "Payment is Successful" : "ክፍያው የተሳካ ነው"}
            </p>
            <Button
              variant="flat"
              color="primary"
              onPress={() => redirectAction()}
              isLoading={redirectPending}
            >
              {lang == "en" ? "Continue Learning" : "መማርዎን ይቀጥሉ"}
            </Button>
          </>
        ) : (
          <>
            <p className="text-danger-600">
              {lang == "en" ? "Payment is Failed" : "ክፍያ አልተሳካም"}
            </p>
            <Button color="primary" onPress={() => router.refresh()}>
              {lang == "en" ? "Recheck" : "ደግመው የረጋግጡ"}
            </Button>
            <Button
              variant="flat"
              color="primary"
              as={Link}
              href={`/${lang}/course`}
            >
              {lang == "en" ? "Retry" : "እንደገና ይሞክሩ"}
            </Button>
          </>
        )
      ) : (
        ""
      )}
    </div>
  );
}