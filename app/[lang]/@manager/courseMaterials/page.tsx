import { Card, CardBody } from "@heroui/react";
import { Book } from "lucide-react";
import { CourseMaterialsSelector } from "@/components/course-materials-selector";
import { getCourses } from "@/actions/manager/course-materials";

  const CourseMaterialsPage = async () => {
  console.log("CourseMaterialsPage1");
  
  try {
    const result = await getCourses();
    console.log("CourseMaterialsPage result:", result);
    
    if (!result.success) {
      console.error("Error in getCourses:", result.message);      
      return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-600 text-lg font-semibold mb-2">
                  Failed to load course packages
                </div>
                <div className="text-red-500 text-sm">
                  {result.message || "Unknown error occurred"}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const courseList = result.data || [];

    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Course Materials</h1>
                  <p className="text-sm sm:text-base text-slate-600 mt-1">
                    Upload and manage course materials including PDFs, presentations, documents, and other resources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
              {courseList.length > 0 ? (
                <CourseMaterialsSelector coursePackages={courseList} />
              ) : (
                <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
                  <CardBody className="flex flex-col items-center justify-center py-16">
                    <div className="rounded-full bg-slate-100 p-6 mb-4">
                      <Book className="h-12 w-12 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No Course Packages Found</h3>
                    <p className="text-slate-600 text-center max-w-md">
                      Create course packages first to upload and manage course materials.
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  } catch (error) {
    console.error("Unexpected error in CourseMaterialsPage:", error);
    return (
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-red-600 text-lg font-semibold mb-2">
                Unexpected error occurred
              </div>
              <div className="text-red-500 text-sm">
                Please try refreshing the page
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CourseMaterialsPage;