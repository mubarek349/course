"use client";

import useAction from "@/hooks/useAction";
import { removeInstructor } from "@/actions/manager/instuctor";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useParams } from "next/navigation";

export default function RemoveInstructor({
  id,
  refresh,
  onClose,
}: {
  id: string;
  refresh: () => void;
  onClose: () => void;
}) {
  const { action, isPending } = useAction(removeInstructor, undefined, {
      onSuccess() {
        refresh();
        onClose();
      },
    }),
    { lang } = useParams<{ lang: string }>();

  return (
    <Modal
      isOpen={true}
      onOpenChange={onClose}
      backdrop="blur"
      placement="center"
      classNames={{ wrapper: "p-5" }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-danger ">
              {lang == "en" ? "Instructor Deletion" : "የአስተዳዳሪ መሰረዝ"}
            </ModalHeader>
            <ModalBody className="py-5 text-center ">
              {lang == "en" ? (
                <span>
                  Are you sure you want to{" "}
                  <span className="text-danger">delete</span> the instructor?
                </span>
              ) : (
                <span>
                  እርግጠኛ ነዎት አስተዳዳሪን <span className="text-danger">መሰረዝ</span>{" "}
                  ይፈልጋሉ?
                </span>
              )}
            </ModalBody>
            <ModalFooter className="grid gap-5 grid-cols-2">
              <Button onPress={onClose} variant="flat">
                {lang == "en" ? "Back" : "ተመለስ"}
              </Button>
              <Button
                color="danger"
                isLoading={isPending}
                onPress={() => action(id)}
              >
                {lang == "en" ? "Delete" : "ሰርዝ"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
