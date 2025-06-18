"use client";

import React, { useEffect } from "react";

export default function Page({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.log("ERROR >> ", error);
  }, [error]);
  return (
    <div className="grid place-content-center">
      <h2>Something went wrong!</h2>
      <p className="">{JSON.stringify(error)}</p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
