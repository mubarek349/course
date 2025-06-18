import { UserRound } from "lucide-react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { changePassword } from "@/lib/action/user";
import useAction from "@/hooks/useAction";
import { useEffect } from "react";
import { unauthentic } from "@/lib/action/user";
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@heroui/react";
import { useParams } from "next/navigation";

export default function User() {
  const { lang } = useParams<{ lang: string }>(),
    formSchema = z.object({
      password: z.string({ message: "" }).nonempty("Password is required"),
      confirmPassword: z
        .string({ message: "" })
        .nonempty("ConfirmPassword is required"),
    }),
    { handleSubmit, register, formState, reset } = useForm<
      z.infer<typeof formSchema>
    >({
      resolver: zodResolver(formSchema),
      defaultValues: { password: "", confirmPassword: "" },
    }),
    { action } = useAction(changePassword, undefined, {
      loading: lang == "en" ? "Changing password" : "የይለፍ ቃል በመቀየር ላይ",
      success:
        lang == "en"
          ? "Password changed successfully"
          : "የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል።",
      error:
        lang == "en" ? "Failed to change password" : "የይለፍ ቃል መቀየር አልተሳካም።",
    }),
    { action: logout } = useAction(unauthentic, undefined, {
      loading: lang == "en" ? "Logging out" : "በመውጣት ላይ",
      success: lang == "en" ? "Successfully logged out" : "በተሳካ ሁኔታ ወጥቷል።",
      error: lang == "en" ? "Logged out failed" : "መውጣት አልተሳካም።",
    }),
    { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen]);

  return (
    <div className="">
      <Popover placement="bottom">
        <PopoverTrigger className="p-2 rounded-full bg-primary/40 border border-primary/40">
          <UserRound className="size-10 " />
        </PopoverTrigger>
        <PopoverContent className="grid gap-1 py-2">
          <Button variant="light" onPress={onOpen} className="">
            {lang == "en" ? "Change Password" : "የይለፍ ቃል ቀይር"}
          </Button>
          <Button
            variant="light"
            color="danger"
            onPress={() => logout()}
            className=""
          >
            {lang == "en" ? "Logout" : "ውጣ"}
          </Button>
        </PopoverContent>
      </Popover>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <Form
          onSubmit={handleSubmit(action)}
          validationErrors={Object.entries(formState.errors).reduce(
            (a, [key, value]) => {
              return { ...a, [key]: value.message };
            },
            {}
          )}
        >
          <ModalContent className="">
            {(onClose) => (
              <>
                <ModalHeader>
                  {lang == "en" ? "Password Change" : "የይለፍ ቃል ቀይር"}
                </ModalHeader>
                <ModalBody className="">
                  <Input {...register("password")} placeholder="Password" />
                  <Input
                    {...register("confirmPassword")}
                    placeholder="Confirm Password"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Back
                  </Button>
                  <Button color="primary" type="submit">
                    Change
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </Modal>
    </div>
  );
}
