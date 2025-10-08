import { useState, useEffect } from "react";
import { useClientIP } from "./useClientIP";

interface PaymentMethodData {
  paymentMethod: "chapa" | "stripe";
  currency: "ETB" | "USD";
  country: string;
  countryCode: string;
  isEthiopia: boolean;
  loading: boolean;
  error: string | null;
  ip: string;
  service: string;
}

export function usePaymentMethod(): PaymentMethodData {
  const [data, setData] = useState<PaymentMethodData>({
    paymentMethod: "chapa", // Default to Chapa
    currency: "ETB",
    country: "Ethiopia",
    countryCode: "ET",
    isEthiopia: true,
    loading: true,
    error: null,
    ip: "127.0.0.1",
    service: "fallback",
  });

  const { ip: clientIP, loading: ipLoading, error: ipError } = useClientIP();

  useEffect(() => {
    const detectPaymentMethod = async () => {
      try {
        setData((prev) => ({ ...prev, loading: true, error: null }));

        // Wait for IP detection to complete
        if (ipLoading) {
          return;
        }

        console.log("Detecting payment method for IP:", clientIP);

        const response = await fetch("/api/get-country");
        const result = await response.json();

        if (result.success) {
          setData({
            paymentMethod: result.paymentMethod,
            currency: result.currency,
            country: result.country,
            countryCode: result.countryCode,
            isEthiopia: result.isEthiopia,
            loading: false,
            error: null,
            ip: result.ip,
            service: result.service || "unknown",
          });
        } else {
          throw new Error(result.error || "Failed to detect country");
        }
      } catch (error) {
        console.error("Payment method detection error:", error);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    };

    detectPaymentMethod();
  }, [clientIP, ipLoading]);

  return data;
}
