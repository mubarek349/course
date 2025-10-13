import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file received" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 100000);
    const fileExtension = file.name.split(".").pop() || "unknown";
    const filename = `${timestamp}-${randomNum}.${fileExtension}`;

    const uploadDir = join(process.cwd(), "docs", "materials");
    await mkdir(uploadDir, { recursive: true });
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/api/files/materials/${filename}`,
      name: file.name,
      type: fileExtension,
    });
  } catch (error) {
    console.error("Error uploading material:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}