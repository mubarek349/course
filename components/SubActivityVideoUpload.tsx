"use client";
import { useState } from "react";
import { Button } from "@heroui/react";
import { Upload, Video, Trash } from "lucide-react";

interface SubActivityVideoUploadProps {
  lang: string;
  onVideoSelect: (filename: string) => void;
  onVideoRemove: () => void;
  hasVideo: boolean;
}

export default function SubActivityVideoUpload({
  lang,
  onVideoSelect,
  onVideoRemove,
  hasVideo,
}: SubActivityVideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputId = `video-upload-${Math.random().toString(36).substr(2, 9)}`;

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert(lang === "en" ? "Please select a video file" : "እባክዎ የቪዲዮ ፋይል ይምረጡ");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const ext = file.name.split(".").pop() || "mp4";
      const filename = `${Date.now()}-${Math.floor(Math.random() * 100000)}.${ext}`;
      const chunkSize = 512 * 1024;
      const total = Math.ceil(file.size / chunkSize);

      for (let i = 0; i < total; i++) {
        const start = i * chunkSize;
        const end = Math.min(file.size, start + chunkSize);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("filename", filename);
        formData.append("chunkIndex", i.toString());
        formData.append("totalChunks", total.toString());

        await fetch("/api/upload-video", {
          method: "POST",
          body: formData,
        });

        setUploadProgress(Math.round(((i + 1) / total) * 100));
      }

      onVideoSelect(filename.replace(/\.[^/.]+$/, "") + ".mp4");
    } catch {
      alert(lang === "en" ? "Upload failed" : "መስቀል አልተሳካም");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-2">
      {hasVideo ? (
        <div className="flex items-center justify-between bg-success/10 p-2 rounded">
          <span className="text-sm text-success">
            {lang === "en" ? "Video uploaded" : "ቪዲዮ ተስቅሏል"}
          </span>
          <Button
            type="button"
            size="sm"
            variant="light"
            color="danger"
            onPress={() => {
              const confirmMessage =
                lang === "en"
                  ? "Are you sure you want to delete this video?"
                  : "ይህን ቪዲዮ መሰረዝ እርግጠኛ ነዎት?";
              if (confirm(confirmMessage)) {
                onVideoRemove();
              }
            }}
            isDisabled={isUploading}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-primary-300 rounded-lg p-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <Video className="size-8 text-primary-500" />
            <p className="text-sm text-gray-600">
              {lang === "en" ? "Upload sub-activity video" : "የንዑስ እንቅስቃሴ ቪዲዮ ይስቀሉ"}
            </p>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileSelect(file);
                  e.target.value = '';
                }
              }}
              className="hidden"
              id={inputId}
              disabled={isUploading}
            />
            <Button
              type="button"
              size="sm"
              color="primary"
              variant="bordered"
              onPress={() => {
                const input = document.getElementById(inputId) as HTMLInputElement;
                input?.click();
              }}
              isDisabled={isUploading}
            >
              <Upload className="size-4" />
              {lang === "en" ? "Choose Video" : "ቪዲዮ ምረጥ"}
            </Button>
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="flex flex-col gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-primary font-medium">
              {lang === "en" ? "Uploading" : "ስቀል በሂደት ላይ"}: {uploadProgress}%
            </span>
          </div>
          <progress
            value={uploadProgress}
            max={100}
            className="w-full h-2 rounded bg-gray-200"
          />
        </div>
      )}
    </div>
  );
}