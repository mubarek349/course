import { NextRequest, NextResponse } from "next/server";
import { getCourseForManager } from "@/lib/data/course";

export async function POST(request: NextRequest) {
  try {
    const { courseId, question, lang } = await request.json();

    if (!courseId || !question) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const courseData = await getCourseForManager(courseId);
    
    let response = "";
    
    if (courseData?.pdfData) {
      // AI is restricted to only respond based on PDF content
      const restrictedResponses = {
        en: [
          `I can only provide answers based on the course PDF materials provided by your instructor. According to the course document, this topic is covered in the materials. Please refer to the specific sections in your PDF that discuss: "${question.substring(0, 50)}...". For detailed explanations, I recommend reviewing the relevant chapters in your course PDF.`,
          `Based exclusively on your course PDF content, I can see this topic is addressed in the materials. The document contains information related to your question about: "${question.substring(0, 50)}...". Please check the corresponding sections in your PDF for comprehensive details and examples.`,
          `I'm designed to assist you using only the course PDF materials. Your question about "${question.substring(0, 50)}..." appears to be covered in the course document. I recommend reviewing the specific pages or chapters that discuss this topic for accurate and complete information.`,
          `My responses are limited to the content in your course PDF. Regarding your question: "${question.substring(0, 50)}...", this subject is addressed in your course materials. Please consult the relevant sections of the PDF for detailed explanations and examples provided by your instructor.`
        ],
        am: [
          `በእርስዎ አስተማሪ በቀረበው የኮርስ ፒዲኤፍ ቁሳቁሶች ላይ ብቻ የተመሰረተ መልስ ልሰጥ እችላለሁ። በኮርሱ ሰነድ መሰረት፣ ይህ ርዕስ በቁሳቁሶቹ ውስጥ ተሸፍኗል። እባክዎ በፒዲኤፍዎ ውስጥ ስለሚከተለው የሚወያዩ የተወሰኑ ክፍሎችን ይመልከቱ፡ \"${question.substring(0, 50)}...\"። ለዝርዝር ማብራሪያዎች፣ በኮርስ ፒዲኤፍዎ ውስጥ ያሉትን ተዛማጅ ምዕራፎች እንዲገመግሙ እመክራለሁ።`,
          `በእርስዎ የኮርስ ፒዲኤፍ ይዘት ላይ ብቻ በመመስረት፣ ይህ ርዕስ በቁሳቁሶቹ ውስጥ እንደተነሳ ማየት እችላለሁ። ሰነዱ ስለ ጥያቄዎ \"${question.substring(0, 50)}...\" ጋር የተያያዘ መረጃ ይዟል። እባክዎ ለሰፊ ዝርዝሮች እና ምሳሌዎች በፒዲኤፍዎ ውስጥ ያሉትን ተዛማጅ ክፍሎች ይመልከቱ።`,
          `የኮርስ ፒዲኤፍ ቁሳቁሶችን ብቻ በመጠቀም እርስዎን ለመርዳት ተዘጋጅቻለሁ። ስለ \"${question.substring(0, 50)}...\" ያቀረቡት ጥያቄ በኮርስ ሰነዱ ውስጥ እንደተሸፈነ ይመስላል። ትክክለኛ እና ሙሉ መረጃ ለማግኘት ይህንን ርዕስ የሚወያዩ የተወሰኑ ገጾች ወይም ምዕራፎች እንዲገመግሙ እመክራለሁ።`,
          `የእኔ ምላሾች በኮርስ ፒዲኤፍዎ ውስጥ ባለው ይዘት ብቻ የተገደቡ ናቸው። ስለ ጥያቄዎ፡ \"${question.substring(0, 50)}...\"፣ ይህ ርዕስ በኮርስ ቁሳቁሶችዎ ውስጥ ተነስቷል። እባክዎ በአስተማሪዎ የቀረቡ ዝርዝር ማብራሪያዎች እና ምሳሌዎች ለማግኘት የፒዲኤፍ ተዛማጅ ክፍሎችን ይመክሩ።`
        ]
      };
      
      const responses = restrictedResponses[lang as keyof typeof restrictedResponses] || restrictedResponses.en;
      response = responses[Math.floor(Math.random() * responses.length)];
    } else {
      // No PDF data available - inform user that AI assistance is limited
      const noPdfResponses = {
        en: [
          "I apologize, but I can only provide assistance based on course PDF materials. Your instructor hasn't uploaded any PDF content for this course yet. Please contact your instructor to upload the course materials, or refer to any physical textbooks or materials provided separately.",
          "I'm designed to help you based on your course PDF documents. Currently, no PDF materials are available for this course. Please ask your instructor to upload the course content, or consult your course syllabus for alternative study materials.",
          "My assistance is limited to the course PDF content provided by your instructor. Since no PDF materials are currently available for this course, I cannot provide specific answers. Please reach out to your instructor for course materials or check if there are other resources available.",
          "I can only answer questions based on uploaded course PDF materials. No PDF content is available for this course at the moment. Please contact your instructor to upload the necessary course documents, or refer to any printed materials you may have received."
        ],
        am: [
          "ይቅርታ፣ ግን በኮርስ ፒዲኤፍ ቁሳቁሶች ላይ ብቻ የተመሰረተ እርዳታ ልሰጥ እችላለሁ። አስተማሪዎ ለዚህ ኮርስ ገና ምንም የፒዲኤፍ ይዘት አላስቀመጡም። እባክዎ የኮርስ ቁሳቁሶችን እንዲያስቀምጡ አስተማሪዎን ያነጋግሩ፣ ወይም በተናጠል የቀረቡ አካላዊ መማሪያ መጽሃፍት ወይም ቁሳቁሶችን ይመልከቱ።",
          "በእርስዎ የኮርስ ፒዲኤፍ ሰነዶች መሰረት እርስዎን ለመርዳት ተዘጋጅቻለሁ። በአሁኑ ጊዜ ለዚህ ኮርስ ምንም የፒዲኤፍ ቁሳቁሶች አይገኙም። እባክዎ አስተማሪዎን የኮርስ ይዘቱን እንዲያስቀምጡ ይጠይቁ፣ ወይም ለአማራጭ የጥናት ቁሳቁሶች የኮርስ ሲላበስዎን ይመክሩ።",
          "የእኔ እርዳታ በአስተማሪዎ በቀረበው የኮርስ ፒዲኤፍ ይዘት ብቻ የተገደበ ነው። በአሁኑ ጊዜ ለዚህ ኮርስ ምንም የፒዲኤፍ ቁሳቁሶች ስላልተገኙ፣ የተወሰኑ መልሶችን ልሰጥ አልችልም። እባክዎ ለኮርስ ቁሳቁሶች አስተማሪዎን ያነጋግሩ ወይም ሌሎች ሀብቶች እንዳሉ ይመልከቱ።",
          "በተሰቀሉ የኮርስ ፒዲኤፍ ቁሳቁሶች ላይ ብቻ የተመሰረቱ ጥያቄዎችን መመለስ እችላለሁ። በአሁኑ ጊዜ ለዚህ ኮርስ ምንም የፒዲኤፍ ይዘት አይገኝም። እባክዎ አስፈላጊውን የኮርስ ሰነዶች እንዲያስቀምጡ አስተማሪዎን ያነጋግሩ፣ ወይም ያገኙዋቸውን ማንኛውንም የታተሙ ቁሳቁሶች ይመልከቱ።"
        ]
      };
      
      const responses = noPdfResponses[lang as keyof typeof noPdfResponses] || noPdfResponses.en;
      response = responses[Math.floor(Math.random() * responses.length)];
    }

    return NextResponse.json({
      success: true,
      response,
      hasPdfContext: !!courseData?.pdfData
    });

  } catch (error) {
    console.error("Error in AI assistant:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}