import React from "react";
import { Volume, VolumeOff } from "lucide-react";

interface VolumeControlProps {
  volume: number; // 0 to 1
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  muted,
  onVolumeChange,
  onMuteToggle,
}) => {
  return (
    <div
      className="volume-control"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMuteToggle();
        }}
        style={{
          background: "rgba(59, 130, 246, 0.6)",
          border: "none",
          color: "#fff",
          padding: 4,
          borderRadius: 4,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {muted || volume === 0 ? <VolumeOff size={20} /> : <Volume size={20} />}
      </button>
      <div
        style={{
          position: "relative",
          width: 60,
          height: 8,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Background bar (darker sky blue) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 8,
            width: "100%",
            background: "rgba(59, 130, 246, 0.3)", // Darker sky blue background
            borderRadius: 4,
            zIndex: 0,
          }}
        />
        {/* Volume bar (sky blue) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 8,
            width: `${(muted ? 0 : volume) * 100}%`,
            background: "rgba(59, 130, 246, 0.8)", // Sky blue
            borderRadius: 4,
            zIndex: 1,
          }}
        />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => {
            e.stopPropagation();
            onVolumeChange(Number(e.target.value));
          }}
          style={{
            width: "100%",
            background: "transparent",
            position: "relative",
            zIndex: 2,
            height: 8,
            margin: 0,
            padding: 0,
            cursor: "pointer",
            outline: "none",
            WebkitAppearance: "none",
            appearance: "none",
            WebkitTapHighlightColor: "transparent", // Fix iPhone touch
            touchAction: "manipulation", // Fix iPhone touch
          }}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
