import { removeStudent } from "@/actions/manager/student";
import useAction from "@/hooks/useAction";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useParams } from "next/navigation";

export default function RemoveStudent({
  id,
  refresh,
  onOpenChange,
}: {
  id: string;
  refresh: () => void;
  onOpenChange: () => void;
}) {
  const params = useParams<{ lang: string }>();
          const lang = params?.lang || "en",
        
    { action, isPending } = useAction(removeStudent, undefined, {
      success:
        lang == "en" ? "successfully deleted student" : "ተማሪ በተሳካ ሁኔታ ተሰርዟል",
      error: lang == "en" ? "failed to delete student" : "ተማሪን መሰረዝ አልተሳካም",
      onSuccess() {
        refresh();
        onOpenChange();
      },
    });

  return (
    <Modal
      isOpen={true}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
      classNames={{ wrapper: "p-5" }}
    >
      <ModalContent className="p-5 bg-background">
        {(onClose) => (
          <>
            <ModalHeader className="text-center text-danger ">
              {lang == "en" ? "Student Deletion" : "የተማሪ መሰረዝ"}
            </ModalHeader>
            <ModalBody className="py-5 text-center ">
              {lang == "en" ? (
                <span>
                  Are you sure you want to{" "}
                  <span className="text-danger">delete</span> the student?
                </span>
              ) : (
                <span>
                  እርግጠኛ ነዎት ተማሪን <span className="text-danger">መሰረዝ</span>{" "}
                  ይፈልጋሉ?
                </span>
              )}
            </ModalBody>
            <ModalFooter className="grid gap-5 grid-cols-2">
              <Button variant="flat" onPress={onClose}>
                {lang == "en" ? "Back" : "ተመለስ"}
              </Button>
              <Button
                color="danger"
                onPress={() => action(id)}
                isLoading={isPending}
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
