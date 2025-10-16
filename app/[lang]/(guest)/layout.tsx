import React from "react";
import GuestHeader from "@/components/GuestHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <GuestHeader />
      <main className="w-full pt-16 sm:pt-20">{children}</main>
    </div>
  );
}
