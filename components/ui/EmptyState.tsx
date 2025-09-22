"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@heroui/react";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
};

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      {icon && (
        <div className="mb-4 text-neutral-400 dark:text-neutral-600">
          <div className="size-16 flex items-center justify-center">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && (
        <Button
          color="primary"
          variant="flat"
          onPress={action.onClick}
          className="btn-primary"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
