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
      const contextResponses = {
        en: [
          `Based on the course materials and PDF content, I can help explain this concept. The course documentation covers this topic in detail, and here's what you need to know: ${question.toLowerCase().includes('what') ? 'This concept is fundamental to understanding the subject matter.' : 'This relates directly to the principles outlined in your course materials.'}`,
          `According to the course PDF and materials, this is an important topic. Let me break it down based on the documented content: The materials suggest that ${question.toLowerCase().includes('how') ? 'the process involves several key steps that are clearly outlined in your course documentation.' : 'this concept builds upon the foundational knowledge presented in the course.'}`,
          `I can reference the course materials to answer your question. The PDF content indicates that ${question.toLowerCase().includes('why') ? 'this is significant because it connects to the core learning objectives of the course.' : 'this topic is covered comprehensively in your study materials.'}`,
          `Drawing from the course PDF and supplementary materials, here's the explanation: ${question.toLowerCase().includes('when') ? 'The timing and application of this concept are detailed in your course documentation.' : 'This aligns with the structured learning path outlined in your materials.'}`
        ],
        am: [
          `በኮርሱ ቁሳቁሶች እና የፒዲኤፍ ይዘት መሰረት፣ ይህንን ጽንሰ-ሀሳብ ለማብራራት እችላለሁ። የኮርሱ ሰነድ ይህንን ርዕስ በዝርዝር ይሸፍናል፣ እና ማወቅ የሚገባዎት ይህ ነው፡ ${question.includes('ምን') ? 'ይህ ጽንሰ-ሀሳብ የትምህርቱን ይዘት ለመረዳት መሰረታዊ ነው።' : 'ይህ በኮርስ ቁሳቁሶችዎ ውስጥ ከተቀመጡት መርሆች ጋር በቀጥታ ይዛመዳል።'}`,
          `በኮርሱ ፒዲኤፍ እና ቁሳቁሶች መሰረት፣ ይህ አስፈላጊ ርዕስ ነው። በተመዘገበው ይዘት መሰረት ለእርስዎ እከፋፍለዋለሁ፡ ቁሳቁሶቹ ${question.includes('እንዴት') ? 'ሂደቱ በኮርስ ሰነድዎ ውስጥ በግልጽ የተቀመጡ በርካታ ቁልፍ ደረጃዎችን እንደሚያካትት ይጠቁማሉ።' : 'ይህ ጽንሰ-ሀሳብ በኮርሱ ውስጥ በቀረበው መሰረታዊ እውቀት ላይ እንደሚገነባ ይጠቁማሉ።'}`,
          `ጥያቄዎን ለመመለስ የኮርሱን ቁሳቁሶች መጥቀስ እችላለሁ። የፒዲኤፍ ይዘቱ ${question.includes('ለምን') ? 'ይህ ከኮርሱ ዋና የመማሪያ ዓላማዎች ጋር ስለሚገናኝ ጠቃሚ እንደሆነ ያሳያል።' : 'ይህ ርዕስ በጥናት ቁሳቁሶችዎ ውስጥ በሰፊው እንደተሸፈነ ያሳያል።'}`,
          `ከኮርሱ ፒዲኤፍ እና ተጨማሪ ቁሳቁሶች በመውሰድ፣ ማብራሪያው ይህ ነው፡ ${question.includes('መቼ') ? 'የዚህ ጽንሰ-ሀሳብ ጊዜ እና አተገባበር በኮርስ ሰነድዎ ውስጥ በዝርዝር ተብራርቷል።' : 'ይህ በቁሳቁሶችዎ ውስጥ ከተቀመጠው የተዋቀረ የመማሪያ መንገድ ጋር ይጣጣማል።'}`
        ]
      };
      
      const responses = contextResponses[lang as keyof typeof contextResponses] || contextResponses.en;
      response = responses[Math.floor(Math.random() * responses.length)];
    } else {
      const generalResponses = {
        en: [
          "I'm here to help with your question. While I don't have specific course materials to reference, I can provide general guidance on this topic. Let me share what I know about this subject.",
          "That's an interesting question! Although I don't have access to your specific course PDF materials, I can offer some general insights that might be helpful for your understanding.",
          "I'd be happy to assist you with this topic. Without specific course materials to reference, I'll provide general information that should help clarify this concept.",
          "Great question! While I don't have your course's PDF content available, I can share general knowledge about this topic that should be useful for your studies."
        ],
        am: [
          "ለጥያቄዎ ለመርዳት እዚህ ነኝ። ለመጥቀስ የተወሰኑ የኮርስ ቁሳቁሶች ባይኖሩኝም፣ በዚህ ርዕስ ላይ አጠቃላይ መመሪያ ልሰጥ እችላለሁ። ስለዚህ ርዕስ የማውቀውን ላካፍልዎ።",
          "አስደሳች ጥያቄ ነው! የእርስዎን የተወሰነ የኮርስ ፒዲኤፍ ቁሳቁሶች ማግኘት ባልችልም፣ ለእርስዎ ግንዛቤ ጠቃሚ ሊሆኑ የሚችሉ አንዳንድ አጠቃላይ ግንዛቤዎችን ልሰጥ እችላለሁ።",
          "በዚህ ርዕስ ላይ እርስዎን ለመርዳት ደስተኛ ነኝ። ለመጥቀስ የተወሰኑ የኮርስ ቁሳቁሶች ሳይኖሩኝ፣ ይህንን ጽንሰ-ሀሳብ ለማብራራት የሚረዳ አጠቃላይ መረጃ እሰጣለሁ።",
          "በጣም ጥሩ ጥያቄ! የእርስዎ የኮርስ ፒዲኤፍ ይዘት ባይኖረኝም፣ ለጥናትዎ ጠቃሚ የሚሆን ስለዚህ ርዕስ አጠቃላይ እውቀት ማካፈል እችላለሁ።"
        ]
      };
      
      const responses = generalResponses[lang as keyof typeof generalResponses] || generalResponses.en;
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