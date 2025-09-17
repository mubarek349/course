"use client";

import { pay } from "@/lib/action/chapa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import useAction from "@/hooks/useAction";
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";

export default function Payment({
  isOpen,
  id,
  onOpenChange,
  affiliateCode,
  title,
  price,
}: {
  isOpen: boolean;
  id: string;
  onOpenChange: () => void;
  affiliateCode?: string;
  title: string;
  price: number;
}) {
 const params = useParams<{ lang: string }>();
              const lang = params?.lang || "en",
    formSchema = z.object({
      id: z.string({ message: "" }).nonempty("ID is required"),
      fullName: z.string({ message: "" }).nonempty("Name is required"),
      gender: z.enum(["Female", "Male"], { message: "Gender is required" }),
      phoneNumber: z
        .string({ message: "" })
        .length(10, "Must be 10 digits")
        .regex(/^\d+$/, "Must contain only digits")
        .startsWith("0", "Must start with 0"),
      affiliateCode: z.string({ message: "" }).optional(),
      // firstName: z.string({ message: "" }).nonempty("First Name is required"),
      // fatherName: z.string({ message: "" }).nonempty("Father Name is required"),
      // lastName: z.string({ message: "" }).nonempty("Last Name is required"),
      // age: z
      //   .string({ message: "" })
      //   .length(2, "Must be 2 digits")
      //   .regex(/^\d+$/, "Must contain only digits"),
      // country: z.string({ message: "" }).nonempty("Country is required"),
      // region: z.string({ message: "" }).nonempty("Region is required"),
      // city: z.string({ message: "" }).nonempty("City is required"),
    }),
    { handleSubmit, register, reset, formState } = useForm<
      z.infer<typeof formSchema>
    >({
      resolver: zodResolver(formSchema),
      defaultValues: {
        id,
        fullName: "",
        gender: "Female",
        phoneNumber: "",
        affiliateCode,
      },
    }),
    { action, isPending } = useAction(pay, undefined, {
      loading: lang == "en" ? "initializing Payment" : "ክፍያን ማስጀመር",
      success: lang == "en" ? "Payment starting completed" : "ክፍያ መጀመሩ ተጠናቀቀ",
      error: lang == "en" ? "Failed to initiate payment" : "ክፍያ ማስጀመር አልተሳካም",
      onSuccess(state) {
        if (state.status) {
          router.push(state.url);
        } else {
          onOpenChange();
        }
      },
    }),
    router = useRouter();

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="outside"
      placement="top-center"
      classNames={{ wrapper: "p-5" }}
    >
      <Form
        onSubmit={handleSubmit(action)}
        validationErrors={Object.entries(formState.errors).reduce(
          (a, [key, value]) => ({ ...a, [key]: value.message }),
          {}
        )}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {lang ? "Course Payment" : "የትምህርት ክፍያ"}
              </ModalHeader>
              <div className="px-5">
                <p className="text-center">{title}</p>
                <p className="text-2xl text-center font-bold ">{price} ETB</p>
              </div>
              <ModalBody>
                <Input
                  {...register("fullName")}
                  color="primary"
                  placeholder={lang == "en" ? "Full Name" : "ሙሉ ስም"}
                />
                <Select
                  {...register("gender")}
                  color="primary"
                  placeholder={lang == "en" ? "Gender" : "ፆታ"}
                  disallowEmptySelection
                >
                  <SelectItem key={"Female"}>Female</SelectItem>
                  <SelectItem key={"Male"}>Male</SelectItem>
                </Select>
                <Input
                  {...register("phoneNumber")}
                  color="primary"
                  placeholder={lang == "en" ? "Telegram number" : "የቴሌግራም ቁጥር"}
                />
                {/* <Input
                  {...register("fatherName")}
                  color="primary"
                  label={lang == "en" ? "Father Name" : "የአባት ስም"}
                />
                <Input
                  {...register("lastName")}
                  color="primary"
                  label={lang == "en" ? "Last Name" : "የአያት ስም"}
                />
                <Input
                  {...register("country")}
                  color="primary"
                  label={lang == "en" ? "Country" : "ሀገር"}
                />
                <Input
                  {...register("region")}
                  color="primary"
                  label={lang == "en" ? "Region" : "ክልል"}
                />
                <Input
                  {...register("city")}
                  color="primary"
                  label={lang == "en" ? "City" : "ከተማ"}
                />
                <Input
                  {...register("age")}
                  color="primary"
                  label={lang == "en" ? "Age" : "እድሜ"}
                /> */}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose} variant="flat" className="">
                  {lang == "en" ? "Back" : "ይመለሱ"}
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isPending}
                  className={""}
                >
                  {lang == "en" ? "Next" : "ቀጣይ"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Form>
    </Modal>
  );
}
