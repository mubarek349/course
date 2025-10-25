/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CourseFor from "./courseFor";
import useData from "@/hooks/useData";
import { courseRegistration } from "@/lib/action/course";
import { getChannels, getCourseForManager } from "@/lib/data/course";
import { TCourse } from "@/lib/definations";
import { getEntries } from "@/lib/utils";
import { courseSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import ActivityManager, { TQuestion } from "@/components/ActivityManager";
import CourseMediaSection from "@/components/course-form/CourseMediaSection";
import CourseBasicInfo from "@/components/course-form/CourseBasicInfo";
import CourseSettings from "@/components/course-form/CourseSettings";
// import { Prisma } from "@prisma/client";
import {
  Button,
  Link,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Progress,
} from "@heroui/react";
import { getInstructorsList } from "@/actions/manager/instuctor";
import {
  BookOpen,
  Users,
  CheckSquare,
  Settings,
  Save,
  ArrowLeft,
  FileText,
  File,
} from "lucide-react";
import { useState } from "react";
import FinalExamManager from "@/components/FinalExamManager";
import { toast } from "sonner";

export default function Page() {
  const params = useParams<{ lang: string; id: string }>();
  const lang = params?.lang || "en";
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
 
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [finalExamQuestions, setFinalExamQuestions] = useState<TQuestion[]>([]);

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";
  const router = useRouter();
  const { handleSubmit, register, setValue, formState, watch } = useForm<TCourse>({
      resolver: zodResolver(courseSchema),
      defaultValues: {
        titleEn: "",
        titleAm: "",
        aboutEn: "",
        aboutAm: "",
        instructorId: "",
        thumbnail: "",
        video: "",
        price: 0,
        dolarPrice: 0,
        birrPrice: 0,
        level: "beginner",
        duration: "01:09",
        language: "Amharic",
        certificate: false,
        requirement: [],
        courseFor: [],
        activity: [],
        courseMaterials: [], // Ensure courseMaterials is an array
        accessAm: "በሞባይል ፣ በኮምፒተር ላይ መጠቀም",
        accessEn: "Access on mobile, computer",
        instructorRate: 0,
        sellerRate: 0,
        affiliateRate: 0,
        channelId: "",
        finalExamQuestions: [],
      },
    });

  const isEditing = id && id !== "unknown";

  const { data: channels, loading: channelsLoading, } = useData({
    func: getChannels,
    args: [],
  });

  const { data: instructors, loading: instructorsLoading } = useData({
    func: getInstructorsList,
    args: [],
  });

  const { loading: courseLoading } = useData({
    func: getCourseForManager,
    args: [isEditing ? id : "unknown"],
    onSuccess(data) {
      if (data && isEditing && !isDataLoaded) {
        getEntries(data).forEach(([name, value]) => {
          if (
            value !== null &&
            value !== undefined &&
            name !== "id" &&
            name !== "finalExamQuestions" &&
            name !== "activity" &&
            name !== "courseMaterials" // Skip courseMaterials, we'll handle it separately
          ) {
            if (value && typeof value === "object" && "toNumber" in value) {
              setValue(name as keyof TCourse, Number(value), {
                shouldValidate: false,
              });
            } else {
              setValue(name as keyof TCourse, value, { shouldValidate: false });
            }
          }
        });

        // Handle courseMaterials - convert string to array if needed
        if (data.courseMaterials !== null && data.courseMaterials !== undefined) {
          if (typeof data.courseMaterials === 'string') {
            // It's a comma-separated string, parse it to array of objects
            const urls = data.courseMaterials
              .split(',')
              .map(url => url.trim())
              .filter(url => url.length > 0);
            
            const materialsArray = urls.map(url => {
              // Extract filename from URL
              const filename = url.split('/').pop() || 'file';
              // Determine type from extension
              const extension = filename.split('.').pop()?.toLowerCase() || '';
              let type = 'file';
              if (['pdf'].includes(extension)) type = 'pdf';
              else if (['doc', 'docx'].includes(extension)) type = 'document';
              else if (['ppt', 'pptx'].includes(extension)) type = 'presentation';
              else if (['xls', 'xlsx'].includes(extension)) type = 'spreadsheet';
              else if (['mp4', 'avi', 'mov'].includes(extension)) type = 'video';
              else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) type = 'image';
              else if (['zip', 'rar'].includes(extension)) type = 'archive';
              
              return {
                name: filename,
                url: url,
                type: type
              };
            });
            
            setValue("courseMaterials", materialsArray, { shouldValidate: false });
          } else if (Array.isArray(data.courseMaterials)) {
            // It's already an array
            setValue("courseMaterials", data.courseMaterials, { shouldValidate: false });
          } else {
            // Unknown type, set to empty array
            setValue("courseMaterials", [], { shouldValidate: false });
          }
        } else {
          // Null or undefined, set to empty array
          setValue("courseMaterials", [], { shouldValidate: false });
        }

        // Handle activity data separately since it requires proper type alignment
        if (data.activity) {
          const transformedActivity = data.activity.map((activity: any) => ({
            titleEn: activity.titleEn,
            titleAm: activity.titleAm,
            subActivity: activity.subActivity,
            questions:
              activity.questions?.map((q: any) => ({
                question: q.question,
                options: q.options,
                answers: q.answers,
                explanation: q.explanation || undefined, // Convert null to undefined
              })) || [],
          }));
          setValue("activity", transformedActivity, { shouldValidate: false });
        }

        if (data.video) {
          setVideoPreviewUrl(data.video);
        }

     

        if (data && "finalExamQuestions" in data && data.finalExamQuestions) {
          setFinalExamQuestions(data.finalExamQuestions as TQuestion[]);
          setValue(
            "finalExamQuestions",
            data.finalExamQuestions as TQuestion[],
            { shouldValidate: false }
          );
        }

        setValue("id", data.id, { shouldValidate: false });
        setIsDataLoaded(true);
      }
    },
  });

  const handleVideoSelect = (file: File) => {
    setSelectedVideoFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
    setValue("video", file.name, { shouldValidate: false, shouldDirty: true });
    if (!watch("thumbnail")) {
      setValue("thumbnail", "/darulkubra.png", { shouldValidate: false });
    }
  };

 

  const handleFormSubmit = async (data: TCourse) => {
    console.log("🚀 Form submission started", {
      isEditing,
      data: {
        ...data,
      },
      formState: {
        isValid: formState.isValid,
        isDirty: formState.isDirty,
        errors: formState.errors,
      },
    });
    
    const loadingToast = toast.loading(
      lang === "en"
        ? isEditing
          ? "Updating course..."
          : "Creating course..."
        : isEditing
        ? "ኮርስ በማዘመን ላይ..."
        : "ኮርስ በመፍጠር ላይ..."
    );
    
    setIsUploading(true);
    try {
      if (selectedVideoFile) {
        console.log("📹 Processing new video file:", selectedVideoFile.name);
        const ext = selectedVideoFile.name.split(".").pop() || "mp4";
        const uuidName = `${Date.now()}-${Math.floor(
          Math.random() * 100000
        )}.${ext}`;
        const CHUNK_SIZE = 512 * 1024;
        const chunkSize = CHUNK_SIZE;
        const total = Math.ceil(selectedVideoFile.size / chunkSize);

        for (let i = 0; i < total; i++) {
          const start = i * chunkSize;
          const end = Math.min(selectedVideoFile.size, start + chunkSize);
          const chunk = selectedVideoFile.slice(start, end);

          const formData = new FormData();
          formData.append("chunk", chunk);
          formData.append("filename", uuidName);
          formData.append("chunkIndex", i.toString());
          formData.append("totalChunks", total.toString());

          await fetch("/api/upload-video", {
            method: "POST",
            body: formData,
          });
        }
        data.video = uuidName.replace(/\.[^/.]+$/, "") + ".mp4";
        console.log("✅ Video processed:", data.video);
      } else {
        console.log("📹 No new video file selected, keeping existing video");
      }

      data.finalExamQuestions = finalExamQuestions;
      
      // Convert courseMaterials array back to comma-separated string for database
      if (data.courseMaterials && Array.isArray(data.courseMaterials)) {
        // Extract URLs and join with commas
        const materialsString = data.courseMaterials
          .map(material => material.url)
          .filter(url => url && url.length > 0)
          .join(',');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data as any).courseMaterials = materialsString;
      }
      
      // Ensure ID is set for updates
      if (isEditing && id) {
        data.id = id;
      }

      console.log("📤 Calling server action with data:", {
        id: data.id,
        isEditing,
        titleEn: data.titleEn,
        titleAm: data.titleAm,
        instructorId: data.instructorId,
        channelId: data.channelId,
        dolarPrice: data.dolarPrice,
        birrPrice: data.birrPrice,
        finalExamQuestionsCount: finalExamQuestions.length,
      });

      // First, register/update the course
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log("📤 About to call action with data:", data);
      const result: any = await courseRegistration({ status: false, cause: "", message: "" }, data);

      console.log("📥 Server action result:", result);

      toast.dismiss(loadingToast);

      if (result.status) {
        // Success
        toast.success(
          lang === "en"
            ? isEditing
              ? "Course updated successfully!"
              : "Course created successfully!"
            : isEditing
            ? "ኮርስ በተሳካ ሁኔታ ተዘምኗል!"
            : "ኮርስ በተሳካ ሁኔታ ተፈጠረ!"
        );
        
        // Reset form state
        setSelectedVideoFile(null);
        setVideoPreviewUrl("");
        
        // Navigate to course list
        setTimeout(() => {
          router.push(`/${lang}/course`);
        }, 500);
      } else {
        // Error
        toast.error(
          lang === "en"
            ? isEditing
              ? "Failed to update course. Please try again."
              : "Failed to create course. Please try again."
            : isEditing
            ? "ኮርስ ማዘመን አልተሳካም። እባክዎ እንደገና ይሞክሩ።"
            : "ኮርስ መፍጠር አልተሳካም። እባክዎ እንደገና ይሞክሩ።",
          {
            description: result.message || result.cause
          }
        );
      }

      return result;
    } catch (error) {
      console.error("❌ Form submission error:", error);
      toast.dismiss(loadingToast);
      toast.error(
        lang === "en"
          ? "An unexpected error occurred"
          : "ያልተጠበቀ ስህተት ተፈጥሯል"
      );
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoRemove = () => {
    const confirmMessage =
      lang === "en"
        ? "Are you sure you want to delete this video?"
        : "ይህን ቪዲዮ መሰረዝ እርግጠኛ ነዎት?";
    if (confirm(confirmMessage)) {
      setSelectedVideoFile(null);
      setVideoPreviewUrl("");
      setValue("video", "", { shouldValidate: false, shouldDirty: true });
      setValue("thumbnail", "", { shouldValidate: false, shouldDirty: true });
    }
  };

  const handleThumbnailSelect = async (file: File) => {
    setIsThumbnailUploading(true);
    try {
      const formData = new FormData();
      formData.append("thumbnail", file);
      const response = await fetch("/api/upload-thumbnail", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        setValue("thumbnail", result.thumbnailUrl);
      } else {
        alert(lang === "en" ? "Upload failed" : "መስቀል አልተሳካም");
      }
    } catch {
      alert(lang === "en" ? "Upload error" : "የመስቀል ስህተት");
    } finally {
      setIsThumbnailUploading(false);
    }
  };

  const handleThumbnailRemove = () => {
    setValue("thumbnail", "", { shouldValidate: false, shouldDirty: true });
  };

  const formProgress = [
    {
      label: lang === "en" ? "Basic Info" : "መሰረታዊ መረጃ",
      completed: !!(watch("titleEn") && watch("titleAm")),
    },
    {
      label: lang === "en" ? "Media" : "ሚዲያ",
      completed: !!(watch("thumbnail") && watch("video")),
    },
    {
      label: lang === "en" ? "Details" : "ዝርዝሮች",
      completed: !!(watch("courseFor").length && watch("requirement").length),
    },
    {
      label: lang === "en" ? "Activities" : "እንቅስቃሴዎች",
      completed: !!watch("activity").length,
    },
  ];
  const completedSteps = formProgress.filter((step) => step.completed).length;
  const progressPercentage = (completedSteps / formProgress.length) * 100;

  // Show loading state while essential data is loading
  if (channelsLoading || instructorsLoading || (isEditing && courseLoading)) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="p-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="text-lg font-medium text-gray-700">
              {lang === "en" ? "Loading course data..." : "የኮርስ መረጃ በመጫን ላይ..."}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    instructors &&
    channels && (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-3 sm:px-6 lg:px-8 py-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8">
          {/* Header Section */}
          <div className="relative">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                      <BookOpen className="size-6 lg:size-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        {isEditing
                          ? lang === "en"
                            ? "Edit Course"
                            : "ኮርስ አርትዕ"
                          : lang === "en"
                          ? "Create New Course"
                          : "አዲስ ኮርስ ፍጠር"}
                      </h1>
                      <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                        {lang === "en"
                          ? "Design and structure your course content with our comprehensive creation tools"
                          : "በእኛ ሁሉን አቀፍ የመፈጠሪያ መሳሪያዎች ኮርስዎን ይንደፉ እና ያዋቅሩ"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center lg:items-end gap-3">
                    <div className="text-center lg:text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        <p className="text-sm font-semibold text-gray-700">
                          {Math.round(progressPercentage)}%{" "}
                          {lang === "en" ? "Complete" : "ተጠናቅቋል"}
                        </p>
                      </div>
                      <Progress
                        value={progressPercentage}
                        size="md"
                        className="w-32 lg:w-40"
                        classNames={{
                          track: "bg-gray-200",
                          indicator:
                            "bg-gradient-to-r from-primary-500 to-primary-600",
                        }}
                      />
                    </div>

                    {/* Progress Steps */}
                    <div className="flex gap-2 mt-2">
                      {formProgress.map((step, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            step.completed
                              ? "bg-primary-500 shadow-md"
                              : "bg-gray-200"
                          }`}
                          title={step.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="space-y-6 lg:space-y-8">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                    <BookOpen className="size-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                      {lang === "en" ? "Course Information" : "የኮርስ መረጃ"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {lang === "en"
                        ? "Essential course details and media content"
                        : "አስፈላጊ የኮርስ ዝርዝሮች እና የሚዲያ ይዘት"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <Divider className="bg-gradient-to-r from-blue-200 to-indigo-200" />
              <CardBody className="p-6 lg:p-8 space-y-6 lg:space-y-8">
                <CourseMediaSection
                  lang={lang}
                  thumbnail={watch("thumbnail")}
                  video={videoPreviewUrl || watch("video")}
                  selectedVideoFile={selectedVideoFile}
                  isUploading={isUploading}
                  isThumbnailUploading={isThumbnailUploading}
                  onThumbnailSelect={handleThumbnailSelect}
                  onThumbnailRemove={handleThumbnailRemove}
                  onVideoSelect={handleVideoSelect}
                  onVideoRemove={handleVideoRemove}
                  hasVideoError={!!formState.errors.video}
                />

               

                <CourseBasicInfo
                  lang={lang}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                />
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Target Audience Card */}
              <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-md hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="p-5 sm:p-7 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100/50">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                        {lang === "en" ? "Target Audience" : "ዒላማ ተመልካቾች"}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {watch("courseFor").length}
                        </span>
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {lang === "en"
                          ? "Define who will benefit most from this course"
                          : "ከዚህ ኮርስ በጣም የሚጠቀሙ ሰዎችን ይግለጹ"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <Divider className="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200" />
                <CardBody className="p-5 sm:p-7">
                  <CourseFor
                    list={watch("courseFor")}
                    addValue={({ en, am }) =>
                      setValue("courseFor", [
                        { courseForEn: en, courseForAm: am },
                        ...watch("courseFor"),
                      ])
                    }
                    removeValue={(index) =>
                      setValue(
                        "courseFor",
                        watch("courseFor").filter((v, i) => i !== index)
                      )
                    }
                    updateValue={(index, { en, am }) =>
                      setValue(
                        "courseFor",
                        watch("courseFor").map((item, i) =>
                          i === index
                            ? { courseForEn: en, courseForAm: am }
                            : item
                        )
                      )
                    }
                    label={
                      lang === "en" ? "Add Target Audience" : "ዒላማ ተመልካች ጨምር"
                    }
                    placeHolderAm={
                      lang === "en"
                        ? "e.g., Beginners in programming"
                        : "ለምሳሌ፣ በፕሮግራሚንግ ጀማሪዎች"
                    }
                    placeHolderEn={
                      lang === "en"
                        ? "e.g., Beginners in programming"
                        : "ለምሳሌ፣ በፕሮግራሚንግ ጀማሪዎች"
                    }
                  />
                </CardBody>
              </Card>

              {/* Prerequisites Card */}
              <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-md hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="p-5 sm:p-7 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-b border-amber-100/50">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                      <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                        {lang === "en" ? "Prerequisites" : "ቅድመ ሁኔታዎች"}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          {watch("requirement").length}
                        </span>
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {lang === "en"
                          ? "What students should know before starting"
                          : "ተማሪዎች ከመጀመራቸው በፊት ማወቅ ያለባቸው"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <Divider className="bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-200" />
                <CardBody className="p-5 sm:p-7">
                  <CourseFor
                    list={watch("requirement")}
                    addValue={({ en, am }) =>
                      setValue("requirement", [
                        { requirementEn: en, requirementAm: am },
                        ...watch("requirement"),
                      ])
                    }
                    removeValue={(index) =>
                      setValue(
                        "requirement",
                        watch("requirement").filter((v, i) => i !== index)
                      )
                    }
                    updateValue={(index, { en, am }) =>
                      setValue(
                        "requirement",
                        watch("requirement").map((item, i) =>
                          i === index
                            ? { requirementEn: en, requirementAm: am }
                            : item
                        )
                      )
                    }
                    label={lang === "en" ? "Add Requirement" : "መስፈርት ጨምር"}
                    placeHolderAm={
                      lang === "en" 
                        ? "e.g., Basic computer skills" 
                        : "ለምሳሌ፣ መሰረታዊ የኮምፒተር ክህሎቶች"
                    }
                    placeHolderEn={
                      lang === "en" 
                        ? "e.g., Basic computer skills" 
                        : "ለምሳሌ፣ መሰረታዊ የኮምፒተር ክህሎቶች"
                    }
                  />
                </CardBody>
              </Card>
            </div>

            <ActivityManager
              errorMessage={formState.errors.activity?.message ?? ""}
              list={watch("activity")}
              addActivity={(v) =>
                setValue("activity", [
                  {
                    titleEn: v.en,
                    titleAm: v.am,
                    subActivity: [],
                    questions: [],
                  },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ...watch("activity").map((activity: any) => ({
                    ...activity,
                    questions: activity.questions || [],
                  })),
                ])
              }
              addSubActivity={(index, value) =>
                setValue(
                  "activity",
                  watch("activity").map((activity, i) => ({
                    ...activity,
                    subActivity:
                      i === index
                        ? [
                            { titleEn: value.en, titleAm: value.am, video: "" },
                            ...activity.subActivity,
                          ]
                        : activity.subActivity,
                  }))
                )
              }
              removeActivity={(index) =>
                setValue(
                  "activity",
                  watch("activity").filter((v, i) => i !== index)
                )
              }
              removeSubActivity={(activityIndex, subActivityIndex) =>
                setValue(
                  "activity",
                  watch("activity").map((activity, index) => ({
                    ...activity,
                    subActivity:
                      index === activityIndex
                        ? activity.subActivity.filter(
                            (v, i) => i !== subActivityIndex
                          )
                        : activity.subActivity,
                  }))
                )
              }
              reorderActivities={(fromIndex, toIndex) => {
                const activities = [...watch("activity")];
                const [moved] = activities.splice(fromIndex, 1);
                activities.splice(toIndex, 0, moved);
                setValue("activity", activities);
              }}
              reorderSubActivities={(activityIndex, fromIndex, toIndex) => {
                setValue(
                  "activity",
                  watch("activity").map((activity, index) => {
                    if (index === activityIndex) {
                      const subActivities = [...activity.subActivity];
                      const [moved] = subActivities.splice(fromIndex, 1);
                      subActivities.splice(toIndex, 0, moved);
                      return { ...activity, subActivity: subActivities };
                    }
                    return activity;
                  })
                );
              }}
              updateSubActivityVideo={(
                activityIndex,
                subActivityIndex,
                videoUrl
              ) => {
                setValue(
                  "activity",
                  watch("activity").map((activity, aIndex) => ({
                    ...activity,
                    subActivity: activity.subActivity.map((sub, sIndex) =>
                      aIndex === activityIndex && sIndex === subActivityIndex
                        ? { ...sub, video: videoUrl }
                        : sub
                    ),
                  }))
                );
              }}
              addQuestion={(activityIndex, question) =>
                setValue(
                  "activity",
                  watch("activity").map((activity, index) => ({
                    ...activity,
                    questions:
                      index === activityIndex
                        ? [...(activity.questions || []), question]
                        : activity.questions || [],
                  }))
                )
              }
              removeQuestion={(activityIndex, questionIndex) =>
                setValue(
                  "activity",
                  watch("activity").map((activity, index) => ({
                    ...activity,
                    questions:
                      index === activityIndex
                        ? (activity.questions || []).filter(
                            (q, i) => i !== questionIndex
                          )
                        : activity.questions || [],
                  }))
                )
              }
              updateActivity={(activityIndex, payload) =>
                setValue(
                  "activity",
                  watch("activity").map((activity, index) =>
                    index === activityIndex
                      ? {
                          ...activity,
                          titleEn: payload.en,
                          titleAm: payload.am,
                        }
                      : activity
                  )
                )
              }
              updateSubActivity={(activityIndex, subActivityIndex, payload) =>
                setValue(
                  "activity",
                  watch("activity").map((activity, aIndex) => ({
                    ...activity,
                    subActivity: activity.subActivity.map((sub, sIndex) =>
                      aIndex === activityIndex && sIndex === subActivityIndex
                        ? { ...sub, titleEn: payload.en, titleAm: payload.am }
                        : sub
                    ),
                  }))
                )
              }
              updateQuestion={(activityIndex, questionIndex, question) =>
                setValue(
                  "activity",
                  watch("activity").map((activity, index) => ({
                    ...activity,
                    questions:
                      index === activityIndex
                        ? (activity.questions || []).map((q, i) =>
                            i === questionIndex ? question : q
                          )
                        : activity.questions || [],
                  }))
                )
              }
              addToFinalExam={(activityIndex, questionIndex) => {
                const question =
                  watch("activity")[activityIndex]?.questions?.[questionIndex];
                if (
                  question &&
                  !finalExamQuestions.some(
                    (q) =>
                      q.sourceActivityIndex === activityIndex &&
                      q.sourceQuestionIndex === questionIndex
                  )
                ) {
                  // Instead of duplicating the question, we create a reference
                  // The actual question will remain in the activity and be shared
                  const questionReference = {
                    ...question,
                    sourceActivityIndex: activityIndex,
                    sourceQuestionIndex: questionIndex,
                    isSharedFromActivity: true, // Flag to indicate this is a reference
                  };
                  const updated = [...finalExamQuestions, questionReference];
                  setFinalExamQuestions(updated);
                  setValue("finalExamQuestions", updated, {
                    shouldValidate: false,
                  });
                }
              }}
              removeFromFinalExam={(activityIndex, questionIndex) => {
                const updated = finalExamQuestions.filter(
                  (q) =>
                    !(
                      q.sourceActivityIndex === activityIndex &&
                      q.sourceQuestionIndex === questionIndex
                    )
                );
                setFinalExamQuestions(updated);
                setValue("finalExamQuestions", updated, {
                  shouldValidate: false,
                });
              }}
              finalExamQuestions={finalExamQuestions}
            />

            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="p-6 lg:p-8 bg-gradient-to-r from-purple-50 to-violet-50">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
                    <Settings className="size-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                      {lang === "en" ? "Course Settings" : "የኮርስ ቅንብሮች"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {lang === "en"
                        ? "Configure pricing, instructors and advanced options"
                        : "የዋጋ አሰጣጥ፣ መምህራን እና የላቀ አማራጮችን ያዋቅሩ"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <Divider className="bg-gradient-to-r from-purple-200 to-violet-200" />
              <CardBody className="p-6 lg:p-8">
                <CourseSettings
                  lang={lang}
                  register={register}
                  watch={watch}
                  channels={channels}
                  instructors={instructors}
                />
              </CardBody>
            </Card>
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="p-6 lg:p-8 bg-gradient-to-r from-red-50 to-pink-50">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-md">
                    <FileText className="size-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                      {lang === "en"
                        ? "Final Exam Questions"
                        : "የመጨረሻ ፈተና ጥያቄዎች"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {lang === "en"
                        ? "Questions selected for the final examination"
                        : "ለመጨረሻ ፈተና የተመረጡ ጥያቄዎች"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <Divider className="bg-gradient-to-r from-red-200 to-pink-200" />
              <CardBody className="p-6 lg:p-8">
                {finalExamQuestions.length === 0 ? (
                  <div className="text-center py-8 mb-6">
                    <FileText className="size-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">
                      {lang === "en"
                        ? "No questions for final exam"
                        : "ለመጨረሻ ፈተና ምንም ጥያቄዎች የሉም"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {lang === "en"
                        ? "Add questions directly or use 'Add to Final' from activities"
                        : "ጥያቄዎችን በቀጥታ ይጨምሩ ወይም ከእንቅስቃሴዎች 'ወደ መጨረሻ ጨምር'ን ይጠቀሙ"}
                    </p>
                  </div>
                ) : null}

                <FinalExamManager
                  questions={finalExamQuestions}
                  onAdd={(question) => {
                    const updated = [...finalExamQuestions, question];
                    setFinalExamQuestions(updated);
                    setValue("finalExamQuestions", updated, {
                      shouldValidate: false,
                    });
                  }}
                  onUpdate={(index, question) => {
                    const updated = [...finalExamQuestions];
                    updated[index] = question;
                    setFinalExamQuestions(updated);
                    setValue("finalExamQuestions", updated, {
                      shouldValidate: false,
                    });
                  }}
                  onRemove={(index) => {
                    const updated = finalExamQuestions.filter(
                      (_, i) => i !== index
                    );
                    setFinalExamQuestions(updated);
                    setValue("finalExamQuestions", updated, {
                      shouldValidate: false,
                    });
                  }}
                  lang={lang}
                />
              </CardBody>
            </Card>

            {/* Action Buttons */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-gray-50 to-slate-50">
              <CardBody className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between sm:justify-end">
                  {/* Progress Summary */}
                  <div className="flex items-center gap-3 text-sm text-gray-600 order-2 sm:order-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          watch("titleEn") && watch("titleAm")
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="text-xs sm:text-sm">
                        {lang === "en" ? "Basic Info" : "መሰረታዊ መረጃ"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          watch("thumbnail") && watch("video")
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="text-xs sm:text-sm">
                        {lang === "en" ? "Media" : "ሚዲያ"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          watch("courseFor").length &&
                          watch("requirement").length
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="text-xs sm:text-sm">
                        {lang === "en" ? "Details" : "ዝርዝሮች"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          watch("activity").length
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="text-xs sm:text-sm">
                        {lang === "en" ? "Activities" : "እንቅስቃሴዎች"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 order-1 sm:order-2">
                    <Button
                      variant="bordered"
                      as={Link}
                      href={`/${lang}/course`}
                      startContent={<ArrowLeft className="size-4" />}
                      className="w-full sm:min-w-32 h-11 sm:h-12 border-2 border-gray-300 hover:border-gray-400 transition-colors text-sm sm:text-base"
                      size="lg"
                      isDisabled={
                        formState.isSubmitting ||
                        isUploading ||
                        isThumbnailUploading
                      }
                    >
                      {lang === "en" ? "Cancel" : "ሰርዝ"}
                    </Button>
                    <Button
                      color="primary"
                      className="w-full sm:min-w-48 h-12 sm:h-14 bg-gradient-to-r from-primary-500 via-primary-600 to-indigo-600 hover:from-primary-600 hover:via-primary-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-sm sm:text-base font-bold relative overflow-hidden group"
                      size="lg"
                      isLoading={false}
                      isDisabled={
                        isUploading ||
                        isThumbnailUploading ||
                        !watch("titleEn") ||
                        !watch("titleAm") ||
                        !watch("instructorId") ||
                        !watch("channelId") ||
                        !watch("dolarPrice") ||
                        !watch("birrPrice") ||
                        !watch("duration")
                      }
                      onPress={() => {
                        console.log("🔘 =================================");
                        console.log("🔘 BUTTON CLICKED!", { isEditing, id });
                        console.log("🔘 Form State:", {
                          isSubmitting: formState.isSubmitting,
                          isUploading,
                          isThumbnailUploading,
                          formValid: formState.isValid,
                          formDirty: formState.isDirty,
                        });
                        console.log("❌ Form Errors (detailed):", JSON.stringify(formState.errors, null, 2));
                        console.log("📋 Form Values:", {
                          id: watch("id"),
                          titleEn: watch("titleEn"),
                          titleAm: watch("titleAm"),
                          instructorId: watch("instructorId"),
                          channelId: watch("channelId"),
                          dolarPrice: watch("dolarPrice"),
                          birrPrice: watch("birrPrice"),
                          duration: watch("duration"),
                          video: watch("video"),
                          thumbnail: watch("thumbnail"),
                        });
                        if (!formState.isSubmitting && !isUploading) {
                          console.log("✅ Calling handleSubmit...");
                          handleSubmit(handleFormSubmit)();
                        } else {
                          console.log("⚠️ Form submission blocked:", {
                            isSubmitting: formState.isSubmitting,
                            isUploading,
                          });
                        }
                      }}
                    >
                      {/* Loading Overlay */}
                      {(formState.isSubmitting || isUploading) && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-600 flex items-center justify-center backdrop-blur-sm">
                          {/* Animated Background Pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.3)_0%,_transparent_50%)] animate-pulse"></div>
                          </div>
                          
                          {/* Loading Content */}
                          <div className="relative z-10 flex flex-col items-center gap-6 px-4">
                            {/* Spinner */}
                            <div className="relative">
                              {/* Outer ring */}
                              <div className="w-16 h-16 rounded-full border-4 border-white/20"></div>
                              {/* Spinning ring */}
                              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-white border-t-transparent border-r-transparent animate-spin"></div>
                              {/* Inner dot */}
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white animate-pulse"></div>
                            </div>
                            
                            {/* Status Text */}
                            <div className="text-center">
                              <h3 className="text-white font-bold text-lg mb-2">
                                {isEditing
                                  ? lang === "en"
                                    ? "Updating Course..."
                                    : "ኮርስ በማዘመን ላይ..."
                                  : lang === "en"
                                  ? "Creating Course..."
                                  : "ኮርስ በመፍጠር ላይ..."}
                              </h3>
                              <p className="text-white/80 text-sm">
                                {lang === "en"
                                  ? "Please wait while we save your changes"
                                  : "ለውጦችዎን እስክናስቀምጥ ድረስ እባክዎ ይጠብቁ"}
                              </p>
                            </div>

                            {/* Progress Steps */}
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    formState.isSubmitting
                                      ? "bg-white shadow-lg shadow-white/50 scale-125"
                                      : "bg-white/40"
                                  }`}
                                ></div>
                                <span className={`text-xs font-medium transition-all ${
                                  formState.isSubmitting ? "text-white" : "text-white/60"
                                }`}>
                                  {lang === "en" ? "Processing" : "በማስተካከል"}
                                </span>
                              </div>
                              
                              <div className="w-8 h-px bg-white/30"></div>
                              
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    isUploading 
                                      ? "bg-white shadow-lg shadow-white/50 scale-125" 
                                      : "bg-white/40"
                                  }`}
                                ></div>
                                <span className={`text-xs font-medium transition-all ${
                                  isUploading ? "text-white" : "text-white/60"
                                }`}>
                                  {lang === "en" ? "Uploading" : "በመስቀል"}
                                </span>
                              </div>
                              
                              <div className="w-8 h-px bg-white/30"></div>
                              
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    formState.isSubmitting && !isUploading
                                      ? "bg-white shadow-lg shadow-white/50 scale-125"
                                      : "bg-white/40"
                                  }`}
                                ></div>
                                <span className={`text-xs font-medium transition-all ${
                                  formState.isSubmitting && !isUploading ? "text-white" : "text-white/60"
                                }`}>
                                  {lang === "en" ? "Saving" : "በማስቀመጥ"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Button Content */}
                      <div
                        className={`flex items-center justify-center gap-2 transition-opacity duration-200 ${
                          formState.isSubmitting || isUploading
                            ? "opacity-0"
                            : "opacity-100"
                        }`}
                      >
                        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-bold">
                          {isEditing
                            ? lang === "en"
                              ? "Update Course"
                              : "ኮርስ አዘምን"
                            : lang === "en"
                            ? "Create Course"
                            : "ኮርስ ፍጠር"}
                        </span>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

      </div>
    )
  );
}
