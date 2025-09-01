import React from "react";
import { Play, Pause, ChevronRight, ChevronLeft } from "lucide-react";

interface ControlsProps {
  playing: boolean;
  onPlayPause: () => void;
  onSkip: (seconds: number) => void;
  onSpeedChange: () => void;
  speed: number;
}

export default function Controls({
  playing,
  onPlayPause,
  onSkip,
  onSpeedChange,
  speed,
}: ControlsProps) {
  return (
    <div
      className="controls"
      style={{ display: "flex", alignItems: "center", gap: 8 }}
    >
      <button
        onClick={() => onSkip(-10)}
        title="Skip Back 10s"
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 20,
          cursor: "pointer",
          padding: 6,
        }}
      >
        <ChevronLeft />
      </button>
      <button
        onClick={onPlayPause}
        title={playing ? "Pause" : "Play"}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 24,
          cursor: "pointer",
          padding: 6,
        }}
      >
        {playing ? <Pause /> : <Play />}
      </button>
      <button
        onClick={() => onSkip(10)}
        title="Skip Forward 10s"
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 20,
          cursor: "pointer",
          padding: 6,
        }}
      >
        <ChevronRight />
      </button>
      <button
        onClick={onSpeedChange}
        title="Change Speed"
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 16,
          cursor: "pointer",
          padding: "4px 8px",
        }}
      >
        {speed}x
      </button>
    </div>
  );
}
