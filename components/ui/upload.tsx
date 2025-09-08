"use client";
import React, { useState } from "react";

const CHUNK_SIZE = 512 * 1024; // 512KB

function getTimestampUUID(ext: string) {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}.${ext}`;
}

function Upload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [uuidFilename, setUuidFilename] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Generate UUID/timestamp filename
    const ext = file.name.split(".").pop() || "mp4";
    const uuidName = getTimestampUUID(ext);
    setUuidFilename(uuidName);

    setIsUploading(true);
    const chunkSize = CHUNK_SIZE;
    const total = Math.ceil(file.size / chunkSize);
    setTotalChunks(total);

    for (let i = 0; i < total; i++) {
      const start = i * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("filename", uuidName);
      formData.append("chunkIndex", i.toString());
      formData.append("totalChunks", total.toString());

      await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(Math.round(((i + 1) / total) * 100));
      setCurrentChunk(i + 1);
    }

    setIsUploading(false);
    alert("Upload complete!");
    setCurrentChunk(0);
    setTotalChunks(0);
  };

  return (
    <div>
      <h1>Video Upload</h1>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        disabled={isUploading}
        multiple={false}
      />
      {uuidFilename && (
        <div>
          <strong>Upload filename:</strong> {uuidFilename}
        </div>
      )}
      {isUploading && (
        <div>
          <p>
            Uploading: {uploadProgress}% ({currentChunk}/{totalChunks} chunks)
          </p>
          <progress value={uploadProgress} max={100} />
        </div>
      )}
    </div>
  );
}

export default Upload;
