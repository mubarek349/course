"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@heroui/react";

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  onChange?: (otp: string) => void;
  value?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  label?: string;
}

export default function OTPInput({
  length = 6,
  onComplete,
  onChange,
  value = "",
  disabled = false,
  className = "",
  placeholder = "Enter OTP",
  label = "OTP Code",
}: OTPInputProps) {
  const [otp, setOtp] = useState(value);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setOtp(value);
  }, [value]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers and limit to 1 character
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 1);

    const newOtp = otp.split("");
    newOtp[index] = numericValue;
    const updatedOtp = newOtp.join("");

    setOtp(updatedOtp);
    onChange?.(updatedOtp);

    // Move to next input if value is entered
    if (numericValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete if OTP is complete
    if (updatedOtp.length === length && !updatedOtp.includes("")) {
      onComplete?.(updatedOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Allow: backspace, delete, tab, escape, enter, arrows, home, end
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ];

    // Allow numbers (0-9)
    const isNumber = e.key >= "0" && e.key <= "9";

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    const isCtrlKey =
      e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase());

    if (!allowedKeys.includes(e.key) && !isNumber && !isCtrlKey) {
      e.preventDefault();
      return;
    }

    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = otp.split("");
        newOtp[index] = "";
        const updatedOtp = newOtp.join("");
        setOtp(updatedOtp);
        onChange?.(updatedOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    // Only allow numbers and limit to 6 digits
    const numericData = pastedData.replace(/[^0-9]/g, "").slice(0, length);
    const newOtp = numericData.padEnd(length, "");
    setOtp(newOtp);
    onChange?.(newOtp);

    // Focus the last filled input or the first empty one
    const lastFilledIndex = Math.min(numericData.length - 1, length - 1);
    inputRefs.current[lastFilledIndex]?.focus();

    if (newOtp.length === length && !newOtp.includes("")) {
      onComplete?.(newOtp);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex gap-2 justify-center">
        {Array.from({ length }, (_, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={otp[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            placeholder=""
            className="w-12 h-12 text-center text-lg font-semibold"
            color="primary"
            variant="bordered"
            size="lg"
            maxLength={1}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]"
            classNames={{
              input: "text-center text-lg font-semibold",
              inputWrapper: "w-12 h-12",
            }}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 text-center">{placeholder}</p>
    </div>
  );
}
