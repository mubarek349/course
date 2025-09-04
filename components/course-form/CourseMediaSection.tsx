"use client";
import { cn } from "@/lib/utils";
import Player from "../stream/Player";
import ThumbnailUpload from "../ThumbnailUpload";
import VideoUploadButton from "../VideoUploadButton";

interface CourseMediaSectionProps {
  lang: string;
  thumbnail: string;
  video: string;
  selectedVideoFile: File | null;
  isUploading: boolean;
  isThumbnailUploading: boolean;
  onThumbnailSelect: (file: File) => void;
  onThumbnailRemove: () => void;
  onVideoSelect: (file: File) => void;
  onVideoRemove: () => void;
  hasVideoError: boolean;
}

export default function CourseMediaSection({
  lang,
  thumbnail,
  video,
  selectedVideoFile,
  isUploading,
  isThumbnailUploading,
  onThumbnailSelect,
  onThumbnailRemove,
  onVideoSelect,
  onVideoRemove,
  hasVideoError,
}: CourseMediaSectionProps) {
  // Priority: selectedVideoFile (uploaded) > video (database)
  const videoSrc = selectedVideoFile 
    ? URL.createObjectURL(selectedVideoFile)
    : video
    ? video.startsWith('/api/videos/') 
      ? video.replace('/api/videos/', '') 
      : video
    : null;

  return (
    <div className="grid gap-2">
      <div className="grid gap-2 md:gap-5 grid-cols-1 md:grid-cols-2">
        <ThumbnailUpload
          currentThumbnail={thumbnail || "/darulkubra.png"}
          onImageSelect={onThumbnailSelect}
          onImageRemove={onThumbnailRemove}
          lang={lang}
          disabled={isThumbnailUploading}
        />
        {videoSrc ? (
          <Player 
            src={videoSrc}
            type={selectedVideoFile ? "url" : "local"}
            title="Melaverse video player" 
            key={selectedVideoFile ? 'uploaded' : 'database'}
          />
        ) : (
          <div
            className={cn(
              "w-full aspect-video rounded-xl",
              hasVideoError
                ? "border border-danger-300 bg-danger-100"
                : "bg-primary-100"
            )}
          />
        )}
      </div>
      <VideoUploadButton
        lang={lang}
        selectedVideo={selectedVideoFile}
        onVideoSelect={onVideoSelect}
        onVideoRemove={onVideoRemove}
        disabled={isUploading}
      />
    </div>
  );
}
