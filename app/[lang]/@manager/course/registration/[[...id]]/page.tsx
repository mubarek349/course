/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import CourseFor from "./courseFor";
import useAction from "@/hooks/useAction";
import useData from "@/hooks/useData";
import { courseRegistration } from "@/lib/action/course";
import { getChannels, getCourseForManager } from "@/lib/data/course";
import { TCourse } from "@/lib/definations";
import { cn, getEntries } from "@/lib/utils";
import { courseSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import ActivityManager from "@/components/ActivityManager";
import CourseMediaSection from "@/components/course-form/CourseMediaSection";
import CourseBasicInfo from "@/components/course-form/CourseBasicInfo";
import CourseSettings from "@/components/course-form/CourseSettings";
import { Prisma } from "@prisma/client";
import {
  Button,
  Form,
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
} from "lucide-react";
import { useState } from "react";
// import { getInstructorsList } from "@/lib/data/instructor";

export default function Page() {
  const params = useParams<{ lang: string; id: string }>();
  const lang = params?.lang || "en";
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const id = params?.id ?? "",
    pathname = usePathname(),
    router = useRouter(),
    { handleSubmit, register, setValue, formState, watch, getValues } =
      useForm<TCourse>({
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
          currency: "ETB",
          level: "beginner",
          duration: "",
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
        },
      });

  const isEditing = id && id !== "unknown";
  
  const { action } = useAction(courseRegistration, undefined, {
    loading: lang === "en" 
      ? (isEditing ? "Updating course..." : "Creating course...") 
      : (isEditing ? "ኮርስ በማዘመን ላይ..." : "ኮርስ በመፍጠር ላይ..."),
    success: lang === "en" 
      ? (isEditing ? "Course updated successfully!" : "Course created successfully!") 
      : (isEditing ? "ኮርስ በተሳካ ሁኔታ ተዘምኗል!" : "ኮርስ በተሳካ ሁኔታ ተፈጠረ!"),
    error: lang === "en" 
      ? (isEditing ? "Failed to update course. Please try again." : "Failed to create course. Please try again.") 
      : (isEditing ? "ኮርስ ማዘመን አልተሳካም። እባክዎ እንደገና ይሞክሩ።" : "ኮርስ መፍጠር አልተሳካም። እባክዎ እንደገና ይሞክሩ።"),
    onSuccess({ status }) {
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

  const
    { data: channels } = useData({
      func: getChannels,
      args: [],
    }),
    { data: instructors } = useData({
      func: getInstructorsList,
      args: [],
    });

  useData({
    func: getCourseForManager,
    args: [id ? (typeof id === "object" ? id[0] : id) : "unknown"],
    onSuccess({ instructorId, ...data }) {
      getEntries(data).forEach(([name, value]) => {
        if (value) {
          setValue(
            name,
            value instanceof Prisma.Decimal ? Number(value) : value
          );
        }
      });
    },
  });

  const handleVideoSelect = async (file: File) => {
    setSelectedVideoFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch("/api/upload-course-video", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setValue("video", `/api/videos/${result.filename}`);
        setValue("thumbnail", "/darulkubra.png"); // Set default thumbnail
      } else {
        alert(lang === "en" ? "Upload failed" : "መስቀል አልተሳካም");
        setSelectedVideoFile(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(lang === "en" ? "Upload error" : "የመስቀል ስህተት");
      setSelectedVideoFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoRemove = () => {
    setSelectedVideoFile(null);
    setValue("video", "");
    setValue("thumbnail", "");
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
    } catch (error) {
      console.error("Upload error:", error);
      alert(lang === "en" ? "Upload error" : "የመስቀል ስህተት");
    } finally {
      setIsThumbnailUploading(false);
    }
  };

  const handleThumbnailRemove = () => {
    setValue("thumbnail", "");
  };

  // console.log(formState.errors);
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

  return (
    instructors &&
    channels && (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-2 sm:px-4 lg:px-6 py-4 pb-20 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex items-center gap-3 flex-1">
                <BookOpen className="size-6 sm:size-8 text-primary flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                    {isEditing
                      ? lang === "en"
                        ? "Edit Course"
                        : "ኮርስ አርትዕ"
                      : lang === "en"
                      ? "Create New Course"
                      : "አዲስ ኮርስ ፍጠር"}
                  </h1>
                  <p className="text-xs sm:text-sm text-default-500 line-clamp-2">
                    {lang === "en"
                      ? "Fill in the details to create or update your course"
                      : "ኮርስዎን ለመፍጠር ወይም ለማዘመን ዝርዝሮችን ይሙሉ"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-sm font-medium">
                    {Math.round(progressPercentage)}%{" "}
                    {lang === "en" ? "Complete" : "ተጠናቅቋል"}
                  </p>
                  <Progress
                    value={progressPercentage}
                    size="sm"
                    className="w-24 sm:w-32"
                  />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Form
            onSubmit={handleSubmit(action)}
            validationErrors={Object.entries(formState.errors).reduce(
              (a, [key, value]) => ({ ...a, [key]: value.message }),
              {}
            )}
            className="space-y-6"
          >
            {/* Basic Information Section */}
            <Card className="shadow-sm">
              <CardHeader className="flex gap-2 sm:gap-3 p-4 sm:p-6">
                <BookOpen className="size-5 sm:size-6 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold truncate">
                    {lang === "en" ? "Course Information" : "የኮርስ መረጃ"}
                  </h2>
                  <p className="text-xs sm:text-sm text-default-500 line-clamp-2">
                    {lang === "en"
                      ? "Basic details and media"
                      : "መሰረታዊ ዝርዝሮች እና ሚዲያ"}
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <CourseMediaSection
                  lang={lang}
                  thumbnail={watch("thumbnail")}
                  video={watch("video")}
                  selectedVideoFile={selectedVideoFile}
                  isUploading={isUploading}
                  isThumbnailUploading={isThumbnailUploading}
                  onThumbnailSelect={handleThumbnailSelect}
                  onThumbnailRemove={handleThumbnailRemove}
                  onVideoSelect={handleVideoSelect}
                  onVideoRemove={handleVideoRemove}
                  hasVideoError={!!formState.errors.video}
                />
                <CourseBasicInfo lang={lang} register={register} />
              </CardBody>
            </Card>
            {/* Target Audience & Requirements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="shadow-sm">
                <CardHeader className="flex gap-2 sm:gap-3 p-4 sm:p-6">
                  <Users className="size-5 sm:size-6 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-semibold truncate">
                      {lang === "en" ? "Target Audience" : "ዒላማ ተመልካቾች"}
                    </h2>
                    <p className="text-xs sm:text-sm text-default-500 line-clamp-2">
                      {lang === "en"
                        ? "Who is this course for?"
                        : "ይህ ኮርስ ለማን ነው?"}
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="p-4 sm:p-6">
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

              <Card className="shadow-sm">
                <CardHeader className="flex gap-3">
                  <CheckSquare className="size-6 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold">
                      {lang === "en" ? "Prerequisites" : "ቅድመ ሁኔታዎች"}
                    </h2>
                    <p className="text-sm text-default-500">
                      {lang === "en"
                        ? "What students need to know"
                        : "ተማሪዎች ማወቅ ያለባቸው"}
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
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
            {/* Activities Section */}
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
              ) =>
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
                )
              }
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
            />

            {/* Settings Section */}
            <Card className="shadow-sm">
              <CardHeader className="flex gap-3">
                <Settings className="size-6 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">
                    {lang === "en" ? "Course Settings" : "የኮርስ ቅንብሮች"}
                  </h2>
                  <p className="text-sm text-default-500">
                    {lang === "en"
                      ? "Pricing, instructors and configuration"
                      : "የዋጋ መረጃ፣ መምህራን እና አስቀማመጥ"}
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <CourseSettings
                  lang={lang}
                  register={register}
                  channels={channels}
                  instructors={instructors}
                />
              </CardBody>
            </Card>

            {/* Action Buttons */}
            <Card className="shadow-sm">
              <CardBody>
                <div className="flex gap-4 justify-end">
                  <Button
                    variant="bordered"
                    as={Link}
                    href={`/${lang}/course`}
                    startContent={<ArrowLeft className="size-4" />}
                    className="min-w-32"
                  >
                    {lang === "en" ? "Cancel" : "ሰርዝ"}
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    startContent={<Save className="size-4" />}
                    className="min-w-32"
                    isLoading={formState.isSubmitting}
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
          </Form>
        </div>
      </div>
    )
  );
}

