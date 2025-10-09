"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAction from "@/hooks/useAction";
import { sendOTP } from "@/lib/action";
import { resetPassword } from "@/lib/action/user";
import CountrySelector from "@/components/CountrySelector";
import OTPInput from "@/components/OTPInput";
import { CButton } from "@/components/heroui";
import { Form, Input, Button } from "@heroui/react";

// Single form schema like registration
const resetPasswordSchema = z
  .object({
    countryCode: z.string().nonempty("Country code is required"),
    phoneNumber: z.string().nonempty("Phone number is required"),
    otp: z
      .string()
      .nonempty("OTP is required")
      .length(6, "OTP must be exactly 6 digits")
      .regex(/^\d{6}$/, "OTP must contain only numbers"),
    newPassword: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function Page() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang ?? "en";
  const router = useRouter();

  // State management like registration
  const [selectedCountry, setSelectedCountry] = useState("+251");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Single form like registration
  const { handleSubmit, register, formState, setValue, watch } =
    useForm<ResetPasswordFormData>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: {
        countryCode: "+251",
        phoneNumber: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
      },
    });

  // OTP action
  const { action: otpAction, isPending: otpPending } = useAction(
    sendOTP,
    undefined,
    {
      success: lang == "en" ? "OTP sent successfully!" : "OTP በተሳካ ሁኔታ ተልኳል!",
      error: lang == "en" ? "Failed to send OTP" : "OTP መላክ አልተሳካም",
    }
  );

  // Reset password action
  const { action: resetPasswordAction, isPending: resetPending } = useAction(
    resetPassword,
    undefined,
    {
      success:
        lang == "en"
          ? "Password reset successfully!"
          : "የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል!",
      error: lang == "en" ? "Failed to reset password" : "የይለፍ ቃል መቀየር አልተሳካም",
      onSuccess(state) {
        if (state.status) {
          router.push(`/${lang}/login`);
        }
      },
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

  // Handle form submission
  const handleFormSubmit = (data: ResetPasswordFormData) => {
    // Combine country code with phone number
    const fullPhoneNumber = `${data.countryCode}${data.phoneNumber}`;

    // Reset password with backend
    resetPasswordAction({
      phoneNumber: fullPhoneNumber,
      otp: data.otp,
      newPassword: data.newPassword,
    });
  };

  // Reset all forms
  const resetAllForms = () => {
    setOtp("");
    setIsOtpSent(false);
    setOtpTimer(0);
    setSelectedCountry("+251");
    setValue("countryCode", "+251");
    setValue("phoneNumber", "");
    setValue("otp", "");
    setValue("newPassword", "");
    setValue("confirmPassword", "");
  };

  return (
    <div className="h-dvh p-4 grid content-center md:justify-center">
      <div className="w-full md:w-96 py-10 px-5 md:px-10 bg-background shadow shadow-primary-200 rounded-xl">
        <div className="grid place-content-center mb-6">
          <Logo />
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {lang == "en" ? "Password Reset" : "የይለፍ ቃል ዳግም ማስቀመጥ"}
          </h1>
          <p className="text-lg text-gray-600 mb-1">
            {lang == "en" ? "Forgot your password?" : "የይለፍ ቃልዎን ረሳሁ?"}
          </p>
          <p className="text-sm text-gray-500">
            {lang == "en"
              ? "No worries! Enter your phone number and we'll help you reset it"
              : "ጭንቀት አይሁን! የስልክ ቁጥርዎን ያስገቡ እና እንረዳዎታለን"}
          </p>
        </div>

        {/* Reset All Button */}
        <div className="flex justify-end mb-4">
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onPress={resetAllForms}
            className="text-xs"
          >
            {lang == "en" ? "Reset All" : "ሁሉንም ዳግም ያስቀምጡ"}
          </Button>
        </div>

        <Form
          onSubmit={handleSubmit(handleFormSubmit)}
          validationErrors={Object.entries(formState.errors).reduce(
            (a, [key, { message }]) => {
              return { ...a, [key]: message };
            },
            {}
          )}
          className="grid gap-4"
        >
          {/* Country Selector */}
          <CountrySelector
            value={selectedCountry}
            onChange={handleCountryChange}
            placeholder={lang == "en" ? "Select Country" : "አገር ይምረጡ"}
            label={lang == "en" ? "Country" : "አገር"}
          />

          {/* Phone Number Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {lang == "en" ? "Phone Number" : "የስልክ ቁጥር"}
              </label>
            </div>
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
              <div className="flex gap-1">
                <Button
                  size="sm"
                  color="primary"
                  variant="bordered"
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {lang == "en" ? "New Password" : "አዲስ የይለፍ ቃል"}
              </label>
            </div>

            <Input
              color="primary"
              {...register("newPassword")}
              type="password"
              placeholder={lang == "en" ? "New Password" : "አዲስ የይለፍ ቃል"}
              variant="bordered"
            />

            <Input
              color="primary"
              {...register("confirmPassword")}
              type="password"
              placeholder={
                lang == "en" ? "Confirm New Password" : "አዲስ የይለፍ ቃል አረጋግጥ"
              }
              variant="bordered"
            />
          </div>

          <CButton
            type="submit"
            color="primary"
            isLoading={resetPending}
            className="mt-4"
            isDisabled={!isOtpSent || otp.length !== 6}
          >
            {lang == "en" ? "Reset Password" : "የይለፍ ቃል ዳግም ያስቀምጡ"}
          </CButton>
        </Form>
      </div>
    </div>
  );
}
