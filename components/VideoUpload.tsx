"use client";
import React, { useState, useRef } from "react";

const CHUNK_SIZE = 512 * 1024; // 512KB

function getTimestampUUID(ext: string) {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}.${ext}`;
}

export default function VideoUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [uuidFilename, setUuidFilename] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

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

      await fetch("/api/upload", {
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
    setSelectedFile(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Video Upload</h2>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="w-full p-2 border rounded mb-4"
      />
      {selectedFile && (
        <div className="mb-2 text-sm text-gray-700">
          <strong>Selected file:</strong> {selectedFile.name}
        </div>
      )}
      {uuidFilename && (
        <div className="mb-2 text-xs text-gray-500">
          <strong>Upload filename:</strong> {uuidFilename}
        </div>
      )}
      {isUploading && (
        <div className="mb-2">
          <p className="text-sm text-blue-600 font-medium">
            Uploading: {uploadProgress}% ({currentChunk}/{totalChunks} chunks)
          </p>
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
