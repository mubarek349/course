"use client";

import { registerInstructor } from "@/actions/manager/instuctor";
import { CInput } from "@/components/heroui";
import useAction from "@/hooks/useAction";
import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  id: z.string({ message: "" }).optional(),
  firstName: z.string({ message: "" }).nonempty("First name is required"),
  fatherName: z.string({ message: "" }).nonempty("Father name is required"),
  lastName: z.string({ message: "" }).nonempty("Last name is required"),
  phoneNumber: z
    .string({ message: "" })
    .length(10, "Must be 10 digits")
    .regex(/^\d+$/, "Must contain only digits")
    .startsWith("0", "Must start with 0"),
  password: z.string({ message: "" }).optional(),
});

export type TFormSchema = z.infer<typeof formSchema>;
export type TRequiredFormSchema = Omit<TFormSchema, "password"> &
  Required<Pick<TFormSchema, "id">>;

export default function Registration({
  registration,
  onClose,
  refresh,
}: {
  registration: true | TRequiredFormSchema | undefined;
  onClose: () => void;
  refresh: () => void;
}) {
  const params= useParams<{ lang: string}>();
        const lang = params?.lang || "en",
          { handleSubmit, register, formState, setValue, reset } = useForm<
      z.infer<typeof formSchema>
    >({
      resolver: zodResolver(formSchema),
      defaultValues: {
        firstName: "",
        fatherName: "",
        lastName: "",
        phoneNumber: "",
        password: "",
      },
    }),
    onOpenChange = useCallback(() => {
      reset();
      onClose();
    }, []),
    { action, isPending } = useAction(registerInstructor, undefined, {
      onSuccess() {
        refresh();
        onOpenChange();
      },
    });

  useEffect(() => {
    if (registration && registration !== true) {
      Object.entries(registration).forEach(([name, value]) => {
        setValue(name as keyof typeof registration, value);
      });
    }
  }, [registration]);

  return (
    <Modal
      isOpen={!!registration}
      onOpenChange={onOpenChange}
      backdrop="blur"
      classNames={{ wrapper: "p-5" }}
      placement="center"
    >
      <Form
        onSubmit={handleSubmit(action)}
        className="w-96 p-5 bg-background rounded-md grid gap-2 "
        validationErrors={Object.entries(formState.errors).reduce(
          (a, [key, value]) => ({ ...a, [key]: value.message }),
          {}
        )}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl text-center font-bold">
                {lang == "en" ? "Instructor Registration" : "የአስተዳዳሪ ምዝገባ"}
              </ModalHeader>
              <ModalBody>
                <CInput
                  {...register("firstName")}
                  label={lang == "en" ? "First Name" : "የመጀመሪያ ስም"}
                />
                <CInput
                  {...register("fatherName")}
                  label={lang == "en" ? "Father Name" : "የአባት ስም"}
                />
                <CInput
                  {...register("lastName")}
                  label={lang == "en" ? "Last Name" : "የአያት ስም"}
                />
                <CInput
                  {...register("phoneNumber")}
                  label={lang == "en" ? "Phone Number" : "ስልክ ቁጥር"}
                />
                <CInput
                  {...register("password")}
                  label={lang == "en" ? "Password" : "የይለፍ ቃል"}
                />
              </ModalBody>
              <ModalFooter className="grid gap-2 grid-cols-2">
                <Button variant="flat" onPress={onClose} className="w-full">
                  {lang == "en" ? "Back" : "ተመለስ"}
                </Button>
                <Button
                  color="primary"
                  className=""
                  type="submit"
                  isLoading={isPending}
                >
                  {lang == "en" ? "Submit" : "መዝግብ"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Form>
    </Modal>
  );
}
