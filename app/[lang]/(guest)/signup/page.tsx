"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAction from "@/hooks/useAction";
import { signupWithOTP } from "@/lib/action/user";
import { sendOTP } from "@/lib/action";
import CountrySelector from "@/components/CountrySelector";
import OTPInput from "@/components/OTPInput";

// Ensure signup returns StateType:
// type StateType = { status: true; message: string } | { status: false; cause: string; message: string };
import { CButton } from "@/components/heroui";
import { Form, Input, Button } from "@heroui/react";

const formSchema = z.object({
  countryCode: z.string({ message: "" }).nonempty("Country code is required"),
  phoneNumber: z.string({ message: "" }).nonempty("Phone number is required"),
  otp: z
    .string({ message: "" })
    .nonempty("OTP is required")
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
  password: z.string({ message: "" }).nonempty("Password is required"),
  confirmPassword: z
    .string({ message: "" })
    .nonempty("confirm password  is matched"),
});

export default function Page() {
  const params = useParams<{ lang: string }>(),
    lang = params?.lang ?? "en",
    searchParams = useSearchParams(),
    router = useRouter(),
    [selectedCountry, setSelectedCountry] = useState("+251"),
    [otp, setOtp] = useState(""),
    [isOtpSent, setIsOtpSent] = useState(false),
    [otpTimer, setOtpTimer] = useState(0),
    { handleSubmit, register, formState, setValue, watch } = useForm<
      z.infer<typeof formSchema>
    >({
      resolver: zodResolver(formSchema),
      defaultValues: {
        countryCode: "+251",
        phoneNumber: "",
        otp: "",
        password: "",
        confirmPassword: "",
      },
    }),
    // router = useRouter(),
    { action, isPending } = useAction(signupWithOTP, undefined, {
      onSuccess(state) {
        if (state.status) {
          // router.replace(`/${lang}/`);
        } else {
        }
      },
      success: lang == "en" ? "Successfully registered" : "በተሳካ ሁኔታ ተመዝግበዋል",
      error: lang == "en" ? "Registration failed" : "መመዝገብ አልተሳካም",
    }),
    { action: otpAction, isPending: otpPending } = useAction(
      sendOTP,
      undefined,
      {
        success: lang == "en" ? "OTP sent successfully!" : "OTP በተሳካ ሁኔታ ተልኳል!",
        error: lang == "en" ? "Failed to send OTP" : "OTP መላክ አልተሳካም",
      }
    );

  // OTP Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Handle country selection
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setValue("countryCode", countryCode);
  };

  // Handle OTP change
  const handleOtpChange = (otpValue: string) => {
    setOtp(otpValue);
    setValue("otp", otpValue);
  };

  // Handle Get OTP
  const handleGetOtp = () => {
    const phoneNumber = watch("phoneNumber");
    const countryCode = watch("countryCode");

    if (!phoneNumber) {
      alert(
        lang === "en" ? "Please enter phone number first" : "እባክዎ የስልክ ቁጥር ያስገቡ"
      );
      return;
    }

    // Combine country code with phone number
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    // Send OTP using backend
    otpAction({ phoneNumber: fullPhoneNumber });

    // Set UI state
    setIsOtpSent(true);
    setOtpTimer(60); // 60 seconds timer
  };

  useEffect(() => {
    const phoneNumber = searchParams?.get("u"),
      password = searchParams?.get("p"),
      confirmPassword = searchParams?.get("cp");
    if (phoneNumber && password && confirmPassword) {
      action({
        countryCode: selectedCountry,
        phoneNumber,
        otp: "",
        password,
        confirmPassword,
      });
    }
  }, []);

  return (
    <div className="h-dvh p-4 grid content-center md:justify-center">
      <Form
        onSubmit={handleSubmit(action)}
        validationErrors={Object.entries(formState.errors).reduce(
          (a, [key, { message }]) => {
            return { ...a, [key]: message };
          },
          {}
        )}
        className="w-full md:w-96 py-10 px-5 md:px-10 bg-background shadow shadow-primary-200 rounded-xl grid gap-5"
      >
        <div className="grid place-content-center">
          <Logo />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">
          {lang == "en" ? "Student Registration" : "የተማሪ መመዝገቢያ"}
        </h2>
        <div className="grid gap-4 auto-rows-min">
          {/* Country Selector */}
          <CountrySelector
            value={selectedCountry}
            onChange={handleCountryChange}
            placeholder={lang == "en" ? "Select Country" : "አገር ይምረጡ"}
            label={lang == "en" ? "Country" : "አገር"}
          />

          {/* Phone Number Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {lang == "en" ? "Phone Number" : "የስልክ ቁጥር"}
            </label>
            <div className="flex gap-2">
              <div className="w-20">
                <Input
                  color="primary"
                  value={selectedCountry}
                  readOnly
                  className="text-center font-semibold"
                  variant="bordered"
                />
              </div>
              <Input
                color="primary"
                {...register("phoneNumber")}
                placeholder={lang == "en" ? "Phone number" : "የስልክ ቁጥር"}
                className="flex-1"
                variant="bordered"
              />
            </div>
          </div>

          {/* OTP Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {lang == "en" ? "OTP Verification" : "OTP ማረጋገጫ"}
              </label>
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onPress={handleGetOtp}
                isDisabled={otpTimer > 0}
                isLoading={otpPending}
                className="text-xs"
              >
                {otpTimer > 0
                  ? `${otpTimer}s`
                  : lang == "en"
                  ? "Get OTP"
                  : "OTP ያግኙ"}
              </Button>
            </div>

            <OTPInput
              value={otp}
              onChange={handleOtpChange}
              onComplete={handleOtpChange}
              disabled={!isOtpSent}
              placeholder={
                lang == "en" ? "Enter 6-digit OTP" : "6-ዲጂት OTP ያስገቡ"
              }
              label=""
              length={6}
            />
          </div>

          {/* Password Fields */}
          <Input
            color="primary"
            {...register("password")}
            type="password"
            placeholder={lang == "en" ? "Password" : "የይለፍ ቃል"}
            variant="bordered"
          />
          <Input
            color="primary"
            {...register("confirmPassword")}
            type="password"
            placeholder={lang == "en" ? "Confirm Password" : "የይለፍ ቃል አረጋግጥ"}
            variant="bordered"
          />

          <CButton
            type="submit"
            color="primary"
            isLoading={isPending}
            className="mt-4"
            isDisabled={!isOtpSent || otp.length !== 6}
          >
            {lang == "en" ? "Sign up" : "ይመዝገቡ"}
          </CButton>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {lang == "en" ? (
              <>
                If you have an account, please{" "}
                <button
                  type="button"
                  onClick={() => router.push(`/${lang}/login`)}
                  className="text-primary hover:underline font-medium"
                >
                  login
                </button>
              </>
            ) : (
              <>
                መለያ ካላችሁ{" "}
                <button
                  type="button"
                  onClick={() => router.push(`/${lang}/login`)}
                  className="text-primary hover:underline font-medium"
                >
                  ይግቡ
                </button>
              </>
            )}
          </p>
        </div>
      </Form>
    </div>
  );
}
