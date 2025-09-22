import React from "react";
import GuestHeader from "@/components/GuestHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <GuestHeader />
      <main className="pt-16 px-4 md:px-8 pb-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
