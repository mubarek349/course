"use client";
import { useState, useRef } from "react";
import { CButton } from "./heroui";
import { Upload, Video, X } from "lucide-react";

interface VideoUploadButtonProps {
  onVideoSelect: (file: File) => void;
  onVideoRemove: () => void;
  selectedVideo?: File | null;
  lang: string;
  disabled?: boolean;
}

export default function VideoUploadButton({
  onVideoSelect,
  onVideoRemove,
  selectedVideo,
  lang,
  disabled = false,
}: VideoUploadButtonProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("video/")) {
      onVideoSelect(file);
    } else {
      alert(lang === "en" ? "Please select a video file" : "እባክዎ የቪዲዮ ፋይል ይምረጡ");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
        disabled={disabled}
      />

      {selectedVideo ? (
        <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Video className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium text-sm">{selectedVideo.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedVideo.size)}</p>
            </div>
          </div>
          <CButton
            isIconOnly
            size="sm"
            variant="light"
            color="danger"
            onClick={onVideoRemove}
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </CButton>
        </div>
      ) : (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragOver ? "border-primary bg-primary/5" : "border-primary/30"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary hover:bg-primary/5"}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {lang === "en" ? "Upload Video" : "ቪዲዮ ይስቀሉ"}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {lang === "en" 
              ? "Drag and drop your video file here, or click to browse"
              : "የቪዲዮ ፋይልዎን እዚህ ይጎትቱ እና ይጣሉ፣ ወይም ለማሰስ ይጫኑ"
            }
          </p>
          <CButton
            color="primary"
            variant="flat"
            startContent={<Upload className="w-4 h-4" />}
            disabled={disabled}
          >
            {lang === "en" ? "Choose File" : "ፋይል ይምረጡ"}
          </CButton>
        </div>
      )}
    </div>
  );
}