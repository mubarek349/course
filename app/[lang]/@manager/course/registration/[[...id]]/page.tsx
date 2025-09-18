"use client";

import CourseFor from "./courseFor";
import useAction from "@/hooks/useAction";
import useData from "@/hooks/useData";
import { courseRegistration } from "@/lib/action/course";
import { getChannels, getCourseForManager } from "@/lib/data/course";
import { TCourse } from "@/lib/definations";
import { getEntries } from "@/lib/utils";
import { courseSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import ActivityManager, { TQuestion } from "@/components/ActivityManager";
import CourseMediaSection from "@/components/course-form/CourseMediaSection";
import CourseBasicInfo from "@/components/course-form/CourseBasicInfo";
import CourseSettings from "@/components/course-form/CourseSettings";
import { Prisma } from "@prisma/client";
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

export default function Page() {
  const params = useParams<{ lang: string; id: string }>();
  const lang = params?.lang || "en";
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [isPdfUploading, setIsPdfUploading] = useState(false);

  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [finalExamQuestions, setFinalExamQuestions] = useState<TQuestion[]>([]);

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "",
    pathname = usePathname(),
    router = useRouter(),
    { handleSubmit, register, setValue, formState, watch } = useForm<TCourse>({
      resolver: zodResolver(courseSchema),
      defaultValues: {
        titleEn: "",
        titleAm: "",
        aboutEn: "",
        aboutAm: "",
        instructorId: "",
        thumbnail: "",
        video: "",
        pdf: "",
        price: 0,
        currency: "ETB",
        level: "beginner",
        duration: "01:09:09",
        language: "Amharic",
        certificate: false,
        requirement: [],
        courseFor: [],
        activity: [],
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

  const { action } = useAction(courseRegistration, undefined, {
    loading:
      lang === "en"
        ? isEditing
          ? "Updating course..."
          : "Creating course..."
        : isEditing
        ? "ኮርስ በማዘመን ላይ..."
        : "ኮርስ በመፍጠር ላይ...",
    success:
      lang === "en"
        ? isEditing
          ? "Course updated successfully!"
          : "Course created successfully!"
        : isEditing
        ? "ኮርስ በተሳካ ሁኔታ ተዘምኗል!"
        : "ኮርስ በተሳካ ሁኔታ ተፈጠረ!",
    error:
      lang === "en"
        ? isEditing
          ? "Failed to update course. Please try again."
          : "Failed to create course. Please try again."
        : isEditing
        ? "ኮርስ ማዘመን አልተሳካም። እባክዎ እንደገና ይሞክሩ።"
        : "ኮርስ መፍጠር አልተሳካም። እባክዎ እንደገና ይሞክሩ።",
    onSuccess({ status }: { status: boolean }) {
      if (status) {
        setTimeout(() => {
          router.push(
            `/${pathname
              ?.split("/")
              .slice(1)
              .reverse()
              .slice(1)
              .reverse()
              .join("/")}`
          );
        }, 1500);
      }
    },
  });

  const { data: channels, loading: channelsLoading } = useData({
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
            name !== "activity"
          ) {
            if (value instanceof Prisma.Decimal) {
              setValue(name as keyof TCourse, Number(value), {
                shouldValidate: false,
              });
            } else {
              setValue(name as keyof TCourse, value, { shouldValidate: false });
            }
          }
        });

        // Handle activity data separately since it requires proper type alignment
        if (data.activity) {
          const transformedActivity = data.activity.map((activity) => ({
            titleEn: activity.titleEn,
            titleAm: activity.titleAm,
            subActivity: activity.subActivity,
            questions:
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        if (data.pdfData) {
          setPdfUrl(data.pdfData);
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

  const handlePdfSelect = async (file: File) => {
    setIsPdfUploading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        setValue("pdf", result.pdfUrl);
        setPdfUrl(result.pdfUrl);
      } else {
        alert(lang === "en" ? "PDF upload failed" : "የፒዲኤፍ መስቀል አልተሳካም");
      }
    } catch {
      alert(lang === "en" ? "PDF upload error" : "የፒዲኤፍ የመስቀል ስህተት");
    } finally {
      setIsPdfUploading(false);
    }
  };

  const handlePdfRemove = () => {
    const confirmMessage =
      lang === "en"
        ? "Are you sure you want to delete this PDF?"
        : "ይህን ፒዲኤፍ መሰረዝ እርግጠኛ ነዎት?";
    if (confirm(confirmMessage)) {
      setSelectedPdfFile(null);
      setPdfUrl("");
      setValue("pdf", "", { shouldValidate: false, shouldDirty: true });
    }
  };

  const handleFormSubmit = async (data: TCourse) => {
    setIsUploading(true);
    try {
      if (selectedVideoFile) {
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
      }

      data.finalExamQuestions = finalExamQuestions;
      await action(data);
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
                
                {/* PDF Upload Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <File className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {lang === "en" ? "Course PDF Material" : "የኮርስ ፒዲኤፍ ቁሳቁስ"}
                    </h3>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 transition-all hover:border-primary-400 hover:bg-primary-50/50">
                    {pdfUrl ? (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <File className="w-8 h-8 text-red-500" />
                          <div>
                            <p className="font-medium text-gray-800">
                              {lang === "en" ? "Uploaded PDF" : "የተሰቀለ ፒዲኤፍ"}
                            </p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {pdfUrl.split("/").pop()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a 
                            href={pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                          >
                            {lang === "en" ? "View PDF" : "ፒዲኤፍ ይመልከቱ"}
                          </a>
                          <button
                            onClick={handlePdfRemove}
                            disabled={isPdfUploading}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {lang === "en" ? "Remove" : "አስወግድ"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">
                          {lang === "en" 
                            ? "Upload a PDF file for additional course materials" 
                            : "ለተጨማሪ የኮርስ ቁሳቁሶች ፒዲኤፍ ፋይል ይስቀሉ"}
                        </p>
                        <label className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer font-medium">
                          {isPdfUploading ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              {lang === "en" ? "Uploading..." : "በመስቀል ላይ..."}
                            </span>
                          ) : (
                            lang === "en" ? "Select PDF File" : "ፒዲኤፍ ፋይል ይምረጡ"
                          )}
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handlePdfSelect(file);
                              }
                            }}
                            disabled={isPdfUploading}
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          {lang === "en" ? "PDF files only, max 100MB" : "ፒዲኤፍ ፋይሎች ብቻ፣ ከፍተኛ 100ሜባይት"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <CourseBasicInfo
                  lang={lang}
                  register={register}
                  watch={watch}
                />
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md">
                      <Users className="size-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {lang === "en" ? "Target Audience" : "ዒላማ ተመልካቾች"}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {lang === "en"
                          ? "Define your ideal students"
                          : "ተስማሚ ተማሪዎችዎን ይግለጹ"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <Divider className="bg-gradient-to-r from-emerald-200 to-teal-200" />
                <CardBody className="p-6">
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
                        ? "Target audience in Amharic"
                        : "ዒላማ ተመልካች በአማርኛ"
                    }
                    placeHolderEn={
                      lang === "en"
                        ? "Target audience in English"
                        : "ዒላማ ተመልካች በእንግሊዝኛ"
                    }
                  />
                </CardBody>
              </Card>

              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="p-6 bg-gradient-to-r from-amber-50 to-orange-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-md">
                      <CheckSquare className="size-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {lang === "en" ? "Prerequisites" : "ቅድመ ሁኔታዎች"}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {lang === "en"
                          ? "Required knowledge and skills"
                          : "የሚያስፈልግ እውቀት እና ክህሎት"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <Divider className="bg-gradient-to-r from-amber-200 to-orange-200" />
                <CardBody className="p-6">
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
                      lang === "en" ? "Requirement in Amharic" : "መስፈርት በአማርኛ"
                    }
                    placeHolderEn={
                      lang === "en" ? "Requirement in English" : "መስፈርት በእንግሊዝኛ"
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
                  ...watch("activity").map((activity) => ({
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
              <CardBody className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button
                    variant="bordered"
                    as={Link}
                    href={`/${lang}/course`}
                    startContent={<ArrowLeft className="size-4" />}
                    className="min-w-36 h-12 border-2 border-gray-300 hover:border-gray-400 transition-colors"
                    size="lg"
                  >
                    {lang === "en" ? "Cancel" : "ሰርዝ"}
                  </Button>
                  <Button
                    color="primary"
                    startContent={<Save className="size-4" />}
                    className="min-w-36 h-12 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                    isLoading={formState.isSubmitting || isUploading}
                    isDisabled={isUploading || isThumbnailUploading}
                    onPress={() => handleSubmit(handleFormSubmit)()}
                  >
                    {isEditing
                      ? lang === "en"
                        ? "Update Course"
                        : "ኮርስ አዘምን"
                      : lang === "en"
                      ? "Create Course"
                      : "ኮርስ ፍጠር"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    )
  );
}