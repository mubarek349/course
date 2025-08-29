"use client";
import { useState } from "react";

interface VideoUploadProps {
  onUploadSuccess?: () => void;
}

export default function VideoUpload({ onUploadSuccess }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [titleEn, setTitleEn] = useState("");
  const [titleAm, setTitleAm] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!titleEn || !titleAm) {
      alert("Please fill in both titles");
      return;
    }

    setUploading(true);
    try {
      const response = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Video uploaded successfully!");
        setTitleEn("");
        setTitleAm("");
        (e.target as HTMLFormElement).reset();
        onUploadSuccess?.();
      } else {
        alert("Upload failed");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Upload error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload Video</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title (English)</label>
          <input
            type="text"
            name="titleEn"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title (Amharic)</label>
          <input
            type="text"
            name="titleAm"
            value={titleAm}
            onChange={(e) => setTitleAm(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Video File</label>
          <input
            type="file"
            name="video"
            accept="video/*"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}