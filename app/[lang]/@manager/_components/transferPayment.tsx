import useAction from "@/hooks/useAction";
import { transferPayment } from "@/lib/action/chapa";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

export function TransferPayment({
  selected,
  refresh,
  onOpenChange,
}: {
  selected: { id: string; income: number }[];
  refresh: () => void;
  onOpenChange: () => void;
}) {
  const { action, isPending } = useAction(transferPayment, undefined, {
    onSuccess(state) {
      if (state.status) {
        refresh();
        onOpenChange();
      }
    },
  });

  return (
    <Modal>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Payment Transfer</ModalHeader>
            <ModalBody className="p-5 text-center">
              <p className="">
                Are you sure? do you want to transfer this month{" "}
                <span className="font-bold text-success">income</span> for
                selected affiliates?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Back
              </Button>
              <Button
                color="primary"
                onPress={() => action(selected)}
                isLoading={isPending}
              >
                Transfer
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
