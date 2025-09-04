"use client";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-primary mb-4" size={48} />
      <span className="text-lg font-medium text-primary">
        Loading your dashboard...
      </span>
    </div>
  );
}
