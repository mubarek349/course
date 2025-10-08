"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import SmartPaymentMethod from "@/components/SmartPaymentMethod";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { RefreshCw, Globe } from "lucide-react";

export default function TestPaymentPage() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePaymentInitiated = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paymentData: any
  ) => {
    console.log("Payment initiated:", paymentData);
    alert(
      `Payment initiated: ${paymentData.paymentType} - ${paymentData.currency} ${paymentData.amount}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {lang === "en"
                  ? "Payment Method Detection Test"
                  : "የክፍያ ዘዴ ማወቅ ሙከራ"}
              </h1>
              <p className="text-gray-600 mt-2">
                {lang === "en"
                  ? "Test the automatic payment method detection based on your IP address"
                  : "በአይፒ አድራሻዎ ላይ በመመስረት የራስ-ሰር የክፍያ ዘዴ ማወቅን ይሞክሩ"}
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              startContent={<RefreshCw className="h-4 w-4" />}
              variant="bordered"
            >
              {lang === "en" ? "Refresh Detection" : "ማወቅን አድስ"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Payment Component */}
          <div key={refreshKey}>
            <SmartPaymentMethod
              courseId="test-course-123"
              amount={500}
              onPaymentInitiated={handlePaymentInitiated}
            />
          </div>

          {/* Info Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  {lang === "en" ? "How it works" : "እንዴት እንደሚሰራ"}
                </h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">
                    {lang === "en" ? "Detection Process:" : "የማወቅ ሂደት:"}
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>
                      {lang === "en"
                        ? "Get your IP address from request headers"
                        : "አይፒ አድራሻዎን ከጥያቄ ራስ-ገዝ ያግኙ"}
                    </li>
                    <li>
                      {lang === "en"
                        ? "Use IP geolocation service to detect country"
                        : "አገርን ለማወቅ የአይፒ አካባቢ አገልግሎት ይጠቀሙ"}
                    </li>
                    <li>
                      {lang === "en"
                        ? "Show Chapa for Ethiopia, Stripe for others"
                        : "ለኢትዮጵያ ቻፓ፣ ለሌሎች ስትራይፕ አሳይ"}
                    </li>
                  </ol>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">
                    {lang === "en" ? "Payment Methods:" : "የክፍያ ዘዴዎች:"}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">
                        <strong>Ethiopia:</strong> Chapa (Mobile Money) - ETB
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">
                        <strong>International:</strong> Stripe (Credit Card) -
                        USD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">
                    {lang === "en" ? "Testing:" : "ሙከራ:"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {lang === "en"
                      ? "In development, we use a test Ethiopian IP. In production, real IP detection works automatically."
                      : "በልማት ውስጥ፣ የሙከራ ኢትዮጵያዊ አይፒ እንጠቀማለን። በምርት ውስጥ፣ እውነተኛ አይፒ ማወቅ በራስ-ሰር ይሰራል።"}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* API Test Section */}
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              {lang === "en" ? "API Test" : "ኤፒአይ ሙከራ"}
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {lang === "en"
                  ? "Test the country detection API directly:"
                  : "የአገር ማወቅ ኤፒአይን በቀጥታ ይሞክሩ:"}
              </p>
              <Button
                onClick={async () => {
                  try {
                    const response = await fetch("/api/get-country");
                    const data = await response.json();
                    console.log("Country detection result:", data);
                    alert(
                      `Country: ${data.country}\nPayment: ${data.paymentMethod}\nCurrency: ${data.currency}`
                    );
                  } catch (error) {
                    console.error("API test error:", error);
                    alert("API test failed");
                  }
                }}
                color="primary"
                variant="bordered"
              >
                {lang === "en" ? "Test API" : "ኤፒአይ ይሞክሩ"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
