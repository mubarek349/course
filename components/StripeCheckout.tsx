"use client";

import { useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeCheckoutProps {
  isOpen: boolean;
  onOpenChange: () => void;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  dolarPrice: number;
  lang: string;
}

function CheckoutForm({
  courseId,
  courseTitle,
  // coursePrice,
  dolarPrice,
  phoneNumber,
  affiliateCode,
  lang,
  onSuccess,
}: {
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  dolarPrice: number;
  phoneNumber: string;
  affiliateCode?: string;
  lang: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    try {
      // 1. CALL BACKEND TO CREATE PAYMENT INTENT
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: dolarPrice,
          courseId,
          phoneNumber,
          affiliateCode,
          lang,
        }),
      });

      let clientSecret, error;
      try {
        const responseData = await res.json();
        clientSecret = responseData.clientSecret;
        error = responseData.error;
      } catch (jsonError) {
        console.error("Failed to parse Stripe API response:", jsonError);
        setMessage("Failed to process payment. Please try again.");
        setLoading(false);
        return;
      }

      if (error) {
        setMessage(error);
        setLoading(false);
        return;
      }

      // 2. CONFIRM PAYMENT WITH PAYMENT ELEMENT
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/${lang}/student/mycourse`,
        },
        redirect: 'if_required',
      });

      if (result.error) {
        setMessage(result.error.message || "Payment failed ❌");
      } else if (result.paymentIntent?.status === "succeeded") {
        setMessage("Payment successful ✅");
        // Update order status in database
        await updateOrderStatus(courseId, phoneNumber);
        onSuccess();
      }
    } catch {
      setMessage("Payment failed. Please try again.");
    }

    setLoading(false);
  };

  const updateOrderStatus = async (courseId: string, phoneNumber: string) => {
    try {
      // Validate inputs before making the request
      if (!courseId || !phoneNumber) {
        console.error("Missing courseId or phoneNumber");
        return;
      }

      // Call API to update order status with Stripe payment details
      const response = await fetch("/api/update-order-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          courseId,
          phoneNumber,
          paymentType: "stripe",
          amount: dolarPrice,
          currency: "USD",
        }),
      });

      if (!response.ok) {
        console.error("Response not OK:", response.status, response.statusText);

        let errorData;
        try {
          const responseText = await response.text();
          console.log("Response text:", responseText);

          if (responseText) {
            errorData = JSON.parse(responseText);
          } else {
            errorData = { error: "Empty response from server" };
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          errorData = {
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
        }

        console.error("Failed to update order status:", errorData);
        throw new Error(
          `HTTP ${response.status}: ${errorData.error || "Unknown error"}`
        );
      }

      const result = await response.json();
      console.log("Order status updated successfully:", result);
    } catch (error) {
      console.error("Error updating order status:", error);
      // You might want to show a user-friendly error message here
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold">{courseTitle}</h3>
        <p className="text-2xl font-bold text-green-600">${dolarPrice} USD</p>
        <p className="text-sm text-gray-600">Phone: {phoneNumber}</p>
      </div>

      <div className="p-3 border rounded-md bg-white">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      <Button
        type="submit"
        color="primary"
        isLoading={loading}
        isDisabled={!stripe || loading}
        className="w-full"
      >
        {loading ? "Processing..." : `Pay $${dolarPrice} USD`}
      </Button>

      {message && (
        <p
          className={`text-center text-sm ${
            message.includes("successful") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default function StripeCheckout({
  isOpen,
  onOpenChange,
  courseId,
  courseTitle,
  coursePrice,
  dolarPrice,
  lang,
}: StripeCheckoutProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [checkingUser, setCheckingUser] = useState(false);
  const router = useRouter();

  const checkUserExists = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      return;
    }

    setCheckingUser(true);
    try {
      const response = await fetch("/api/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const { exists } = await response.json();
      setUserExists(exists);

      if (exists) {
        setShowCardForm(true);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setCheckingUser(false);
    }
  };

  const handleSuccess = () => {
    onOpenChange();
    router.push(`/${lang}/student/mycourse`);
  };

  // const resetForm = () => {
  //   setPhoneNumber("");
  //   setAffiliateCode("");
  //   setShowCardForm(false);
  //   setUserExists(false);
  // };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {lang === "en" ? "Stripe Payment" : "ስትራይፕ ክፍያ"}
            </ModalHeader>

            {!showCardForm ? (
              <>
                <ModalBody>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <h3 className="font-semibold">{courseTitle}</h3>
                      <p className="text-2xl font-bold text-green-600">
                        ${dolarPrice} USD
                      </p>
                    </div>

                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={lang === "en" ? "Phone Number" : "የስልክ ቁጥር"}
                      color="primary"
                      onBlur={checkUserExists}
                    />

                    <Input
                      value={affiliateCode}
                      onChange={(e) => setAffiliateCode(e.target.value)}
                      placeholder={
                        lang === "en"
                          ? "Affiliate Code (Optional)"
                          : "የተጋራ ኮድ (አማራጭ)"
                      }
                      color="primary"
                    />

                    {!userExists && phoneNumber && (
                      <p className="text-red-600 text-sm">
                        {lang === "en"
                          ? "Please register with this phone number before ordering the course"
                          : "እባክዎ ኮርሱን ከመያዝ በፊት በዚህ ስልክ ቁጥር ይመዝገቡ"}
                      </p>
                    )}
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button variant="flat" onPress={onClose}>
                    {lang === "en" ? "Cancel" : "ይሰርዙ"}
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => checkUserExists()}
                    isLoading={checkingUser}
                    isDisabled={!phoneNumber || phoneNumber.length !== 10}
                  >
                    {lang === "en" ? "Continue to Payment" : "ወደ ክፍያ ይቀጥሉ"}
                  </Button>
                </ModalFooter>
              </>
            ) : (
              <>
                <ModalBody>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      courseId={courseId}
                      courseTitle={courseTitle}
                      coursePrice={coursePrice}
                      dolarPrice={dolarPrice}
                      phoneNumber={phoneNumber}
                      affiliateCode={affiliateCode}
                      lang={lang}
                      onSuccess={handleSuccess}
                    />
                  </Elements>
                </ModalBody>

                <ModalFooter>
                  <Button variant="flat" onPress={() => setShowCardForm(false)}>
                    {lang === "en" ? "Back" : "ይመለሱ"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}