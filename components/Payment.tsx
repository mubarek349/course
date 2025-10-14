"use client";

import { pay } from "@/lib/action/chapa";
import { payWithStripe } from "@/lib/action/stripe";
import { getCurrentUserPhoneNumber } from "@/lib/action";
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
  birrPrice,
  dolarPrice,
}: {
  isOpen: boolean;
  id: string;
  onOpenChange: () => void;
  affiliateCode?: string;
  title: string;
  price: number;
  birrPrice: number;
  dolarPrice: number;
}) {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    "chapa" | "stripe" | null
  >(null);
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>("");
  const [, setIsLoadingUser] = useState(false);
  const [authError, setAuthError] = useState<string>("");

  const formSchema = z.object({
    id: z.string({ message: "" }).nonempty("ID is required"),
    phoneNumber: z
      .string({ message: "" })
      .min(9, "Must be at least 9 digits")
      .max(20, "Must be at most 20 digits")
      .regex(/^\+?\d+$/, "Must contain only digits with optional + prefix"),
    affiliateCode: z.string({ message: "" }).optional(),
  });

  const { handleSubmit, register, reset, formState, setValue } = useForm<
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

  // Fetch user phone number when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUserPhoneNumber();
      reset();
      setShowMethodSelector(true);
      setShowPaymentForm(false);
      setShowStripeCheckout(false);
      setSelectedMethod(null);
    }
  }, [isOpen, reset]);

  const fetchUserPhoneNumber = async () => {
    setIsLoadingUser(true);
    setAuthError("");
    try {
      const result = await getCurrentUserPhoneNumber();
      if (result.status && result.phoneNumber) {
        setUserPhoneNumber(result.phoneNumber);
        setValue("phoneNumber", result.phoneNumber);
      } else {
        setAuthError(
          lang === "en"
            ? "Please login to purchase courses"
            : "እባክዎ ኮርሶችን ለመግዛት ይግቡ"
        );
      }
    } catch (error) {
      console.error("Error fetching user phone number:", error);
      setAuthError(
        lang === "en"
          ? "Failed to get user information"
          : "የተጠቃሚ መረጃ ማግኘት አልተሳካም"
      );
    } finally {
      setIsLoadingUser(false);
    }
  };

  const handleChapaSelect = () => {
    if (!userPhoneNumber) {
      setAuthError(
        lang === "en"
          ? "Please login to purchase courses"
          : "እባክዎ ኮርሶችን ለመግዛት ይግቡ"
      );
      return;
    }
    setSelectedMethod("chapa");
    setShowMethodSelector(false);
    setShowPaymentForm(true);
  };

  const handleStripeSelect = () => {
    if (!userPhoneNumber) {
      setAuthError(
        lang === "en"
          ? "Please login to purchase courses"
          : "እባክዎ ኮርሶችን ለመግዛት ይግቡ"
      );
      return;
    }
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
        birrPrice={birrPrice}
        dolarPrice={dolarPrice}
      />

      {/* Auth Error Message */}
      {authError && (
        <Modal
          isOpen={!!authError}
          onClose={() => setAuthError("")}
          placement="top-center"
        >
          <ModalContent>
            <ModalHeader>
              {lang === "en" ? "Authentication Required" : "ማረጋገጥ ያስፈልጋል"}
            </ModalHeader>
            <ModalBody>
              <p className="text-red-600">{authError}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => {
                  setAuthError("");
                  router.push(`/${lang}/login`);
                }}
              >
                {lang === "en" ? "Go to Login" : "ወደ መግቢያ ይሂዱ"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

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
            {() => (
              <>
                <ModalHeader>
                  {lang === "en" ? "Course Payment" : "የትምህርት ክፍያ"} -{" "}
                  {selectedMethod === "chapa" ? "Chapa" : "Stripe"}
                </ModalHeader>
                <div className="px-5">
                  <p className="text-center">{title}</p>
                  <p className="text-2xl text-center font-bold ">
                    {selectedMethod === "chapa"
                      ? `${birrPrice} ETB`
                      : `$${dolarPrice} USD`}
                  </p>
                </div>
                <ModalBody>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      {lang === "en" ? "Phone Number" : "የስልክ ቁጥር"}
                    </p>
                    <p className="text-lg font-semibold">{userPhoneNumber}</p>
                  </div>
                  <Input
                    {...register("phoneNumber")}
                    color="primary"
                    placeholder={lang == "en" ? "Phone Number" : "የስልክ ቁጥር"}
                    value={userPhoneNumber}
                    isReadOnly
                    isDisabled
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
        birrPrice={birrPrice}
        dolarPrice={dolarPrice}
        lang={lang}
        userPhoneNumber={userPhoneNumber}
      />
    </>
  );
}
