import { getCourseForManager } from "@/lib/data/course";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { courseId, lang = "en" } = await req.json();

    console.log("Chat API - courseId:", courseId);
    
    let reply = "";

    if (courseId) {
      const courseData = await getCourseForManager(courseId);
      console.log("Chat API - courseData found:", !!courseData);
      console.log("Chat API - pdfData exists:", !!courseData?.pdfData);
      
      if (courseData?.pdfData) {
        reply =
          lang === "en"
            ? "I can only provide assistance based on your course PDF materials. Please refer to the specific sections in your course document that relate to your question. For detailed explanations, consult the relevant chapters in your PDF materials."
            : "በእርስዎ የኮርስ ፒዲኤፍ ቁሳቁሶች መሰረት ብቻ እርዳታ ልሰጥ እችላለሁ። እባክዎ ከጥያቄዎ ጋር የሚዛመዱ በኮርስ ሰነድዎ ውስጥ ያሉ የተወሰኑ ክፍሎችን ይመልከቱ። ለዝርዝር ማብራሪያዎች፣ በፒዲኤፍ ቁሳቁሶችዎ ውስጥ ያሉ ተዛማጅ ምዕራፎችን ይመክሩ።";
      } else {
        reply =
          lang === "en"
            ? "I can only provide assistance based on course PDF materials. Your instructor hasn't uploaded any PDF content for this course yet. Please contact your instructor to upload the course materials."
            : "በኮርስ ፒዲኤፍ ቁሳቁሶች መሰረት ብቻ እርዳታ ልሰጥ እችላለሁ። አስተማሪዎ ለዚህ ኮርስ ገና ምንም የፒዲኤፍ ይዘት አላስቀመጡም። እባክዎ አስተማሪዎን የኮርስ ቁሳቁሶችን እንዲያስቀምጡ ያነጋግሩ።";
      }
    } else {
      reply =
        lang === "en"
          ? "I can only provide assistance based on course materials. Please specify a course to get help with your studies."
          : "በኮርስ ቁሳቁሶች መሰረት ብቻ እርዳታ ልሰጥ እችላለሁ። ለጥናትዎ እርዳታ ለማግኘት ኮርስ ይግለጹ።";
    }

    // Return our restricted response directly instead of using OpenAI
    return NextResponse.json({
      reply: { role: "assistant", content: reply },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
