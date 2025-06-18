"use client";

import { toggleStatus } from "@/actions/common/user";
import useAction from "@/hooks/useAction";
import { useParams } from "next/navigation";
import { Button } from "@heroui/react";

export default function UserStatusToggle({
  id,
  status,
  refresh,
}: {
  id: string;
  status: "pending" | "active" | "inactive";
  refresh: () => void;
}) {
  const { action, isPending } = useAction(toggleStatus, undefined, {
      onSuccess() {
        refresh();
      },
    }),
    { lang } = useParams<{ lang: string }>();

  return (
    <div className="grid place-content-center">
      <Button
        size="sm"
        variant="light"
        color={
          status === "active"
            ? "success"
            : status === "inactive"
            ? "danger"
            : "warning"
        }
        isLoading={isPending}
        onPress={() =>
          action({ id, status: status === "active" ? "inactive" : "active" })
        }
      >
        <span className="">
          {status === "active"
            ? lang == "en"
              ? "Active"
              : "ንቁ"
            : status === "inactive"
            ? lang == "en"
              ? "InActive"
              : "ኢ-ንቁ"
            : lang == "en"
            ? "Pending"
            : "በመጠባበቅ ላይ"}
        </span>
      </Button>
    </div>
  );
}
