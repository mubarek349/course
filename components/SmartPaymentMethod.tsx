"use client";

import React from "react";
import { usePaymentMethod } from "@/hooks/usePaymentMethod";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { CreditCard, Smartphone, MapPin } from "lucide-react";

interface SmartPaymentMethodProps {
  courseId: string;
  amount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPaymentInitiated?: (paymentData: any) => void;
}

export default function SmartPaymentMethod({
  courseId,
  amount,
  onPaymentInitiated,
}: SmartPaymentMethodProps) {
  const { paymentMethod, currency, country, loading, error } =
    usePaymentMethod();

  const handlePayment = async () => {
    try {
      if (paymentMethod === "chapa") {
        // Handle Chapa payment
        const paymentData = {
          courseId,
          amount,
          currency: "ETB",
          paymentType: "chapa",
          // Add Chapa-specific data here
        };

        console.log("Initiating Chapa payment:", paymentData);
        onPaymentInitiated?.(paymentData);

        // Call your Chapa payment function here
        // await initiateChapaPayment(paymentData);
      } else {
        // Handle Stripe payment
        const paymentData = {
          courseId,
          amount,
          currency: "USD",
          paymentType: "stripe",
          // Add Stripe-specific data here
        };

        console.log("Initiating Stripe payment:", paymentData);
        onPaymentInitiated?.(paymentData);

        // Call your Stripe payment function here
        // await initiateStripePayment(paymentData);
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardBody className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-gray-600">Detecting your location...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardBody className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">Unable to detect your location</p>
            <p className="text-sm text-gray-600 mb-4">
              Well show you the default payment method.
            </p>
            <Button color="primary" onClick={handlePayment} className="w-full">
              Continue with Chapa Payment
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            {paymentMethod === "chapa" ? (
              <Smartphone className="h-6 w-6 text-primary" />
            ) : (
              <CreditCard className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {paymentMethod === "chapa" ? "Chapa Payment" : "Stripe Payment"}
            </h3>
            <p className="text-sm text-gray-600">
              {paymentMethod === "chapa"
                ? "Mobile money payment for Ethiopia"
                : "International card payment"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <div className="space-y-4">
          {/* Location Info */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>Detected location: {country}</span>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Amount:</span>
              <span className="font-semibold">
                {currency} {amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Method:</span>
              <span className="text-sm">
                {paymentMethod === "chapa" ? "Mobile Money" : "Credit Card"}
              </span>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            color="primary"
            onClick={handlePayment}
            className="w-full"
            size="lg"
          >
            {paymentMethod === "chapa" ? "Pay with Chapa" : "Pay with Stripe"}
          </Button>

          {/* Additional Info */}
          <div className="text-xs text-gray-500 text-center">
            {paymentMethod === "chapa"
              ? "Secure mobile money payment via Chapa"
              : "Secure international payment via Stripe"}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
