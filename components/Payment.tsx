"use client";

import { pay } from "@/lib/action/chapa";
import { payWithStripe } from "@/lib/action/stripe";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import PaymentMethodSelector from "./PaymentMethodSelector";
import StripeCheckout from "./StripeCheckout";

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
  const lang = params?.lang || "en";
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    "chapa" | "stripe" | null
  >(null);
  const formSchema = z.object({
    id: z.string({ message: "" }).nonempty("ID is required"),
    phoneNumber: z
      .string({ message: "" })
      .length(10, "Must be 10 digits")
      .regex(/^\d+$/, "Must contain only digits")
      .startsWith("0", "Must start with 0"),
    affiliateCode: z.string({ message: "" }).optional(),
  });

  const { handleSubmit, register, reset, formState } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id,
      phoneNumber: "",
      affiliateCode,
    },
  });

  const { action: chapaAction, isPending: chapaPending } = useAction(
    pay,
    undefined,
    {
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
    }
  );

  const { action: stripeAction, isPending: stripePending } = useAction(
    payWithStripe,
    undefined,
    {
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
    }
  );

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      reset();
      setShowMethodSelector(true);
      setShowPaymentForm(false);
      setShowStripeCheckout(false);
      setSelectedMethod(null);
    }
  }, [isOpen, reset]);

  const handleChapaSelect = () => {
    setSelectedMethod("chapa");
    setShowMethodSelector(false);
    setShowPaymentForm(true);
  };

  const handleStripeSelect = () => {
    setSelectedMethod("stripe");
    setShowMethodSelector(false);
    setShowStripeCheckout(true);
  };

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    if (selectedMethod === "chapa") {
      chapaAction(data);
    } else if (selectedMethod === "stripe") {
      stripeAction({ ...data, lang });
    }
  };

  const isPending = chapaPending || stripePending;

  return (
    <>
      {/* Payment Method Selector */}
      <PaymentMethodSelector
        isOpen={showMethodSelector}
        onOpenChange={() => {
          setShowMethodSelector(false);
          onOpenChange();
        }}
        onChapaSelect={handleChapaSelect}
        onStripeSelect={handleStripeSelect}
        title={title}
        price={price}
      />

      {/* Payment Form */}
      <Modal
        isOpen={showPaymentForm}
        onOpenChange={() => {
          setShowPaymentForm(false);
          setShowMethodSelector(true);
        }}
        scrollBehavior="outside"
        placement="top-center"
        classNames={{ wrapper: "p-5" }}
      >
        <Form
          onSubmit={handleSubmit(handleFormSubmit)}
          validationErrors={Object.entries(formState.errors).reduce(
            (a, [key, value]) => ({ ...a, [key]: value.message }),
            {}
          )}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  {lang === "en" ? "Course Payment" : "የትምህርት ክፍያ"} -{" "}
                  {selectedMethod === "chapa" ? "Chapa" : "Stripe"}
                </ModalHeader>
                <div className="px-5">
                  <p className="text-center">{title}</p>
                  <p className="text-2xl text-center font-bold ">{price} ETB</p>
                </div>
                <ModalBody>
                  <Input
                    {...register("phoneNumber")}
                    color="primary"
                    placeholder={lang == "en" ? "Phone Number" : "የስልክ ቁጥር"}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    onPress={() => {
                      setShowPaymentForm(false);
                      setShowMethodSelector(true);
                    }}
                    variant="flat"
                    className=""
                  >
                    {lang == "en" ? "Back" : "ይመለሱ"}
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={isPending}
                    className={""}
                  >
                    {lang == "en"
                      ? "Pay with " +
                        (selectedMethod === "chapa" ? "Chapa" : "Stripe")
                      : selectedMethod === "chapa"
                      ? "በቻፓ ይክፈሉ"
                      : "በስትራይፕ ይክፈሉ"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </Modal>

      <StripeCheckout
        isOpen={showStripeCheckout}
        onOpenChange={() => setShowStripeCheckout(false)}
        courseId={id}
        courseTitle={title}
        coursePrice={price}
        lang={lang}
      />
    </>
  );
}
