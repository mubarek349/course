"use client";

import React from "react";
import PageContainer from "./PageContainer";

type ScrollablePageWrapperProps = {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
};

export default function ScrollablePageWrapper({ 
  children, 
  className,
  maxWidth = "xl"
}: ScrollablePageWrapperProps) {
  return (
    <PageContainer maxWidth={maxWidth} className={className}>
      {children}
    </PageContainer>
  );
}
