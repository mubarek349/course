import React from "react";
import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="h-dvh grid place-content-center bg-gradient-to-br from-background via-background to-primary-50/30 dark:from-background dark:via-background dark:to-primary-950/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed top-20 right-20 w-32 h-32 bg-primary-100/30 dark:bg-primary-900/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-40 h-40 bg-success-100/30 dark:bg-success-900/20 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="relative z-10 text-center space-y-4">
        <Spinner 
          size="lg" 
          color="primary"
          classNames={{
            circle1: "border-b-primary-500 dark:border-b-primary-400",
            circle2: "border-b-success-500 dark:border-b-success-400"
          }}
        />
        <p className="text-sm font-medium text-foreground/70 dark:text-foreground/60 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
