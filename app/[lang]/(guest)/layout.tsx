import React from "react";
import GuestHeader from "@/components/GuestHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-auto">
      <GuestHeader />
      {children}
    </div>
  );
}
