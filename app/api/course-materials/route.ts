"use server";

import { addCourseMaterials } from "@/lib/action/courseMaterials";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    // Get session to verify authentication
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Only allow instructors and managers to upload materials
    if (!session || !session.user || !session.user.role) {
      return NextResponse.json(
        { error: "Unauthorized - missing session data" },
        { status: 401 }
      );
    }
    
    const userRole = session.user.role;
    if (userRole !== Role.instructor && userRole !== Role.manager) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { courseId, materials } = body;
    
    // Validate required fields
    if (!courseId || !materials || !Array.isArray(materials)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Validate each material
    for (const material of materials) {
      if (!material.name || !material.url || !material.type) {
        return NextResponse.json(
          { error: "Each material must have name, url, and type" },
          { status: 400 }
        );
      }
    }
    
    // Add materials to database
    const result = await addCourseMaterials(courseId, materials);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to save materials" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: "Materials uploaded successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error in course-materials API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}