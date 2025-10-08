"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useClientIP } from "@/hooks/useClientIP";
import { usePaymentMethod } from "@/hooks/usePaymentMethod";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { RefreshCw, Globe, Wifi, WifiOff } from "lucide-react";

export default function DebugIPPage() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  const [refreshKey, setRefreshKey] = useState(0);

  const { ip: clientIP, loading: ipLoading, error: ipError } = useClientIP();
  const {
    paymentMethod,
    currency,
    country,
    isEthiopia,
    loading: paymentLoading,
    error: paymentError,
    service,
  } = usePaymentMethod();

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const testIPDetection = async () => {
    try {
      console.log("Testing IP detection...");
      const response = await fetch("/api/get-ip");
      const data = await response.json();
      console.log("IP Detection Result:", data);
      alert(`IP: ${data.ip}\nIs Localhost: ${data.isLocalhost}`);
    } catch (error) {
      console.error("IP test error:", error);
      alert("IP test failed");
    }
  };

  const testCountryDetection = async () => {
    try {
      console.log("Testing country detection...");
      const response = await fetch("/api/get-country");
      const data = await response.json();
      console.log("Country Detection Result:", data);
      alert(
        `Country: ${data.country}\nPayment: ${data.paymentMethod}\nCurrency: ${data.currency}`
      );
    } catch (error) {
      console.error("Country test error:", error);
      alert("Country test failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {lang === "en" ? "IP Detection Debug" : "አይፒ ማወቅ ማስተካከያ"}
              </h1>
              <p className="text-gray-600 mt-2">
                {lang === "en"
                  ? "Debug IP detection and VPN support"
                  : "አይፒ ማወቅን እና ቪፒኤን ድጋፍን ያስተካክሉ"}
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              startContent={<RefreshCw className="h-4 w-4" />}
              variant="bordered"
            >
              {lang === "en" ? "Refresh" : "አድስ"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* IP Detection */}
          <Card key={refreshKey}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Wifi className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  {lang === "en" ? "IP Detection" : "አይፒ ማወቅ"}
                </h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {ipLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm text-gray-600">
                      {lang === "en" ? "Detecting IP..." : "አይፒ እያወቅን..."}
                    </span>
                  </div>
                ) : ipError ? (
                  <div className="text-red-600">
                    <WifiOff className="h-4 w-4 inline mr-2" />
                    Error: {ipError}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">IP Address:</span>
                      <span className="font-mono text-sm">{clientIP}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Is Localhost:</span>
                      <span
                        className={
                          clientIP === "127.0.0.1"
                            ? "text-orange-600"
                            : "text-green-600"
                        }
                      >
                        {clientIP === "127.0.0.1" ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={testIPDetection}
                  color="primary"
                  variant="bordered"
                  size="sm"
                >
                  {lang === "en" ? "Test IP API" : "አይፒ ኤፒአይ ይሞክሩ"}
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Payment Method Detection */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  {lang === "en" ? "Payment Method" : "የክፍያ ዘዴ"}
                </h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {paymentLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm text-gray-600">
                      {lang === "en"
                        ? "Detecting payment method..."
                        : "የክፍያ ዘዴ እያወቅን..."}
                    </span>
                  </div>
                ) : paymentError ? (
                  <div className="text-red-600">
                    <WifiOff className="h-4 w-4 inline mr-2" />
                    Error: {paymentError}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Country:</span>
                      <span className="font-semibold">{country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Payment Method:</span>
                      <span
                        className={`font-semibold ${
                          paymentMethod === "chapa"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {paymentMethod?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Currency:</span>
                      <span className="font-semibold">{currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Is Ethiopia:</span>
                      <span
                        className={
                          isEthiopia ? "text-green-600" : "text-blue-600"
                        }
                      >
                        {isEthiopia ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Service:</span>
                      <span className="text-sm text-gray-600">{service}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={testCountryDetection}
                  color="primary"
                  variant="bordered"
                  size="sm"
                >
                  {lang === "en" ? "Test Country API" : "አገር ኤፒአይ ይሞክሩ"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* VPN Testing Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              {lang === "en" ? "VPN Testing Instructions" : "ቪፒኤን ሙከራ መመሪያዎች"}
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  {lang === "en"
                    ? "How to test with VPN:"
                    : "ቪፒኤን በመጠቀም እንዴት ይሞክሩ:"}
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>
                    {lang === "en"
                      ? "Connect to a VPN server in a different country"
                      : "በተለያየ አገር ውስጥ ቪፒኤን አገልጋይ ይገናኙ"}
                  </li>
                  <li>
                    {lang === "en"
                      ? "Refresh this page and check the IP detection"
                      : "ይህን ገጽ አድስ እና አይፒ ማወቅን ያረጋግጡ"}
                  </li>
                  <li>
                    {lang === "en"
                      ? "The payment method should change based on the VPN location"
                      : "የክፍያ ዘዴ በቪፒኤን አካባቢ ላይ በመመስረት መለወጥ አለበት"}
                  </li>
                </ol>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">
                  {lang === "en" ? "Expected Results:" : "የሚጠበቁ ውጤቶች:"}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>
                      <strong>Ethiopia VPN:</strong> Chapa Payment (ETB)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>
                      <strong>Other Countries VPN:</strong> Stripe Payment (USD)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
