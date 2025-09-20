import { NextRequest, NextResponse } from "next/server";
import { addCourseMaterials } from "@/lib/action/courseMaterials";

export async function POST(request: NextRequest) {
  try {
    const { courseId, materials } = await request.json();

    if (!courseId || !materials || !Array.isArray(materials)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    const result = await addCourseMaterials(courseId, materials);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in course-materials API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}