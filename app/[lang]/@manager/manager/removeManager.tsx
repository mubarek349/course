import { removeManager } from "@/actions/manager/manager";
import useAction from "@/hooks/useAction";
import { useParams } from "next/navigation";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { CButton } from "@/components/heroui";

export function RemoveManager({
  id,
  refresh,
  onOpenChange,
}: {
  id: string;
  refresh: () => void;
  onOpenChange: () => void;
}) {
  const { lang } = useParams<{ lang: string }>(),
    { action, isPending } = useAction(removeManager, undefined, {
      onSuccess({ status }) {
        if (status) {
          refresh();
          onOpenChange();
        }
      },
    });
  return (
    <Modal
      isOpen
      onOpenChange={onOpenChange}
      placement="center"
      classNames={{ wrapper: "p-5" }}
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-danger">
              {lang == "en" ? "Manager Deletion" : "አስተዳዳሪ መሰረዝ"}
            </ModalHeader>
            <ModalBody>
              {lang == "en" ? (
                <p>
                  Are you sure, do you want to{" "}
                  <span className="text-danger">delete</span> the manager?
                </p>
              ) : (
                <p>
                  እርግጠኛ ነህ፣ አስተዳዳሪውን <span className="text-danger">መሰረዝ</span>{" "}
                  ትፈልጋለህ?
                </p>
              )}
            </ModalBody>
            <ModalFooter className="grid gap-5 grid-cols-2">
              <CButton variant="flat" onPress={onClose}>
                {lang == "en" ? "Back" : "ተመለስ"}
              </CButton>
              <CButton
                color="danger"
                onPress={() => action(id)}
                isLoading={isPending}
              >
                {lang == "en" ? "Delete" : "ሰርዝ"}
              </CButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
