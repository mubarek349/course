/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import formidable from "formidable";

const UPLOAD_DIR = path.join(process.cwd(), "fuad");
const COURSE_DIR = path.join(UPLOAD_DIR, "course");

export const config = {
  api: {
    bodyParser: false,
    bodySizeLimit: "100mb",
  },
};

function parseForm(req: any): Promise<{ fields: any; files: any }> {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err: any, fields: any, files: any) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

function getTimestampUUID(ext: string) {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}.${ext}`;
}

export async function POST(req: NextRequest) {
  const nodeReq = req;
  const { fields, files } = await parseForm(nodeReq);
  let { filename, chunkIndex, totalChunks } = fields;

  console.log("Received file fields:", Object.keys(files));

  if (Array.isArray(filename)) filename = filename[0];
  if (Array.isArray(chunkIndex)) chunkIndex = chunkIndex[0];
  if (Array.isArray(totalChunks)) totalChunks = totalChunks[0];

  let chunkFile = files.chunk;
  if (Array.isArray(chunkFile)) {
    chunkFile = chunkFile[0];
  }

  if (!chunkFile || !chunkFile.filepath) {
    console.error("Chunk file missing or invalid:", chunkFile);
    return NextResponse.json(
      {
        error: "Chunk file missing or invalid",
        receivedFields: Object.keys(files),
      },
      { status: 400 }
    );
  }

  let ext = "mp4";
  if (chunkFile.originalFilename) {
    const parts = chunkFile.originalFilename.split(".");
    if (parts.length > 1) ext = parts.pop() as string;
  }
  if (!filename || filename === "") {
    filename = getTimestampUUID(ext);
  }
  const chunkFolder = path.join(
    COURSE_DIR,
    filename.replace(/\.[^/.]+$/, "") + "_chunks"
  );
  if (!fs.existsSync(chunkFolder)) {
    fs.mkdirSync(chunkFolder, { recursive: true });
  }
  const chunkPath = path.join(chunkFolder, `chunk_${chunkIndex}`);
  const readStream = fs.createReadStream(chunkFile.filepath);
  const writeStream = fs.createWriteStream(chunkPath);
  await new Promise<void>((resolve, reject) => {
    readStream.pipe(writeStream);
    writeStream.on("finish", () => resolve());
    writeStream.on("error", reject);
    readStream.on("error", reject);
  });

  if (parseInt(chunkIndex) + 1 === parseInt(totalChunks)) {
    const baseName = filename.replace(/\.[^/.]+$/, "");
    const videoPath = path.join(COURSE_DIR, `${baseName}.mp4`);
    const finalWriteStream = fs.createWriteStream(videoPath);
    try {
      for (let i = 0; i < parseInt(totalChunks); i++) {
        const chunkFilePath = path.join(chunkFolder, `chunk_${i}`);
        if (!fs.existsSync(chunkFilePath)) {
          console.error("Missing chunk file:", chunkFilePath);
          continue;
        }
        const chunk = fs.readFileSync(chunkFilePath);
        finalWriteStream.write(chunk);
      }
      finalWriteStream.end();
      await new Promise<void>((resolve, reject) => {
        finalWriteStream.on("finish", () => resolve());
        finalWriteStream.on("error", (err) => {
          console.error("finalWriteStream error:", err);
          reject(err);
        });
      });
      fs.rmSync(chunkFolder, { recursive: true, force: true });
    } catch (err) {
      console.error("Error joining chunks:", err);
      return NextResponse.json(
        { error: "Error joining chunks", details: err },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, filename: `${baseName}.mp4` });
  }
  return NextResponse.json({ success: true, filename });
}
