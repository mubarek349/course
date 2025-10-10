"use client";
import React from "react";

interface CustomSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function CustomSpinner({
  size = 32,
  color = "#fff",
  className = "",
}: CustomSpinnerProps) {
  const segments = 8;
  const segmentAngle = 360 / segments;

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: size,
        height: size,
        animation: "spin 1s linear infinite",
      }}
    >
      {Array.from({ length: segments }, (_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: `${size * 0.08}px`,
            height: `${size * 0.25}px`,
            backgroundColor: color,
            borderRadius: `${size * 0.04}px`,
            transformOrigin: "0 0",
            transform: `
              translate(-50%, -50%) 
              rotate(${index * segmentAngle}deg) 
              translateY(-${size * 0.375}px)
            `,
          }}
        />
      ))}
    </div>
  );
}
