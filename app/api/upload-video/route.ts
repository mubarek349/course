import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "file");
const VIDEO_DIR = path.join(UPLOAD_DIR, "videos");

function getTimestampUUID(ext: string) {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}.${ext}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const chunk = formData.get("chunk") as File;
    const filename = formData.get("filename") as string;
    const chunkIndex = parseInt(formData.get("chunkIndex") as string);
    const totalChunks = parseInt(formData.get("totalChunks") as string);

    if (!chunk) {
      return NextResponse.json({ error: "No chunk provided" }, { status: 400 });
    }

    // Ensure directories exist
    if (!fs.existsSync(VIDEO_DIR)) {
      fs.mkdirSync(VIDEO_DIR, { recursive: true });
    }

    const chunkFolder = path.join(VIDEO_DIR, filename.replace(/\.[^/.]+$/, "") + "_chunks");
    if (!fs.existsSync(chunkFolder)) {
      fs.mkdirSync(chunkFolder, { recursive: true });
    }

    // Save chunk
    const chunkPath = path.join(chunkFolder, `chunk_${chunkIndex}`);
    const chunkBuffer = Buffer.from(await chunk.arrayBuffer());
    fs.writeFileSync(chunkPath, chunkBuffer);

    // If this is the last chunk, combine all chunks
    if (chunkIndex + 1 === totalChunks) {
      const baseName = filename.replace(/\.[^/.]+$/, "");
      const videoPath = path.join(VIDEO_DIR, `${baseName}.mp4`);
      const writeStream = fs.createWriteStream(videoPath);

      for (let i = 0; i < totalChunks; i++) {
        const chunkFilePath = path.join(chunkFolder, `chunk_${i}`);
        if (fs.existsSync(chunkFilePath)) {
          const chunkData = fs.readFileSync(chunkFilePath);
          writeStream.write(chunkData);
        }
      }
      writeStream.end();

      // Clean up chunk files
      fs.rmSync(chunkFolder, { recursive: true, force: true });

      return NextResponse.json({ success: true, filename: `${baseName}.mp4` });
    }

    return NextResponse.json({ success: true, filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
