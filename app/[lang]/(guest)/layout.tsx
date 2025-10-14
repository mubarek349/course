import React from "react";
import GuestHeader from "@/components/GuestHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <GuestHeader />
      <main className="w-full">{children}</main>
    </div>
  );
}
