"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useParams } from "next/navigation";
import React from "react";

interface PaymentMethodSelectorProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onChapaSelect: () => void;
  onStripeSelect: () => void;
  title: string;
  price: number;
  birrPrice: number;
  dolarPrice: number;
}

export default function PaymentMethodSelector({
  isOpen,
  onOpenChange,
  onChapaSelect,
  onStripeSelect,
  title,
  price,
  birrPrice,
  dolarPrice,
}: PaymentMethodSelectorProps) {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="outside"
      placement="top-center"
      classNames={{ wrapper: "p-5" }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {lang === "en" ? "Choose Payment Method" : "የክፍያ ዘዴ ይምረጡ"}
            </ModalHeader>
            <div className="px-5">
              <p className="text-center text-lg font-semibold">{title}</p>
              <div className="text-center space-y-1">
                <p className="text-sm text-gray-600">
                  {lang === "en"
                    ? "Choose payment method to see price"
                    : "የዋጋ መጠን ለማየት የክፍያ ዘዴ ይምረጡ"}
                </p>
              </div>
            </div>
            <ModalBody>
              <div className="space-y-4">
                <div className="text-center text-sm text-gray-600 mb-4">
                  {lang === "en"
                    ? "Please select your preferred payment method:"
                    : "እባክዎ የሚመርጡትን የክፍያ ዘዴ ይምረጡ:"}
                </div>

                {/* Chapa Payment Option */}
                <Button
                  color="primary"
                  variant="bordered"
                  className="w-full h-auto min-h-16 flex items-center justify-between p-4"
                  onPress={() => {
                    onChapaSelect();
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">
                        C
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Chapa</div>
                      <div className="text-xs text-gray-500">
                        {lang === "en"
                          ? "Mobile & Bank Transfer"
                          : "ሞባይል እና ባንክ ሽያጭ"}
                      </div>
                      <div className="text-sm font-bold text-green-600 mt-1">
                        {birrPrice} ETB
                      </div>
                    </div>
                  </div>
                  <div className="text-green-600">→</div>
                </Button>

                {/* Stripe Payment Option */}
                <Button
                  color="primary"
                  variant="bordered"
                  className="w-full h-auto min-h-16 flex items-center justify-between p-4"
                  onPress={() => {
                    onStripeSelect();
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">S</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Stripe</div>
                      <div className="text-xs text-gray-500">
                        {lang === "en"
                          ? "Card & Digital Wallet"
                          : "ካርድ እና ዲጂታል የሚያያዝ"}
                      </div>
                      <div className="text-sm font-bold text-blue-600 mt-1">
                        ${dolarPrice} USD
                      </div>
                    </div>
                  </div>
                  <div className="text-blue-600">→</div>
                </Button>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose} variant="flat">
                {lang === "en" ? "Cancel" : "ይሰርዙ"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
