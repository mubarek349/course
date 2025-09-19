/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PanelRightOpen,
  PlayCircle,
  CheckCircle2,
  Sparkles,
  X,
  ShieldAlert,
  Trophy,
  Lock,
  Circle,
  MessageCircle,
} from "lucide-react";
import { Accordion, AccordionItem, Skeleton, Tabs, Tab } from "@heroui/react";

import useData from "@/hooks/useData";
import {
  getMySingleCourse,
  getMySingleCourseContent,
  unlockTheFinalExamAndQuiz,
  getFinalExamStatus,
  getActivityQuizStatus,
} from "@/actions/student/mycourse";
import Loading from "@/components/loading";
import NoData from "@/components/noData";
import CourseTopOverview from "@/components/courseTopOverview";
import TraditionalQA from "@/components/TraditionalQA";
import AIAssistant from "@/components/AIAssistant";
import { useSession } from "next-auth/react";
import ChatComponent from "@/components/ui/chatComponent";

// ---------------- COURSE CONTENT COMPONENT ----------------
function CourseContent({
  contentData,
  contentLoading,
  onSelectVideo,
  lang,
  currentVideoUrl,
  courseId,
  finalExamLocked,
  examStatus,
}: {
  contentData: any;
  contentLoading: boolean;
  onSelectVideo: (url: string, title: string, subActivityId?: string) => void;
  lang: string;
  currentVideoUrl: string;
  courseId: string;
  finalExamLocked: boolean;
  examStatus: string;
}) {
  const router = useRouter();
  const [activityQuizStatuses, setActivityQuizStatuses] = useState<
    Record<string, string>
  >({});
  const [statusesLoading, setStatusesLoading] = useState(false);

  // Fetch quiz statuses for all activities
  useEffect(() => {
    const fetchQuizStatuses = async () => {
      if (!contentData?.activity || statusesLoading) return;

      setStatusesLoading(true);
      try {
        const statusPromises = contentData.activity
          .filter((activity: any) => activity.hasQuiz)
          .map(async (activity: any) => {
            const status = await getActivityQuizStatus(activity.id);
            return { activityId: activity.id, status };
          });

        const results = await Promise.all(statusPromises);
        const statusMap = results.reduce((acc, { activityId, status }) => {
          acc[activityId] = status;
          return acc;
        }, {} as Record<string, string>);

        setActivityQuizStatuses(statusMap);
      } catch (error) {
        console.error("Error fetching quiz statuses:", error);
      } finally {
        setStatusesLoading(false);
      }
    };

    fetchQuizStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentData?.activity]);

  // Function to refresh quiz status for a specific activity
  const refreshActivityQuizStatus = async (activityId: string) => {
    try {
      const status = await getActivityQuizStatus(activityId);
      setActivityQuizStatuses((prev) => ({
        ...prev,
        [activityId]: status,
      }));
    } catch (error) {
      console.error("Error refreshing quiz status:", error);
    }
  };

  if (contentLoading) {
    return (
      <div className="w-full p-4 space-y-4 pt-16">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    );
  }

  if (!contentData || !Array.isArray(contentData.activity)) {
    return (
      <div className="p-4 text-center text-gray-500">
        No course content available.
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-auto  ">
      {/* INTRODUCTION */}
      <div
        className="px-4 py-2 cursor-pointer hover:bg-primary-100 rounded-lg m-2"
        onClick={() =>
          onSelectVideo(
            contentData.video,
            lang === "en" ? contentData.titleEn : contentData.titleAm,
            "" // Introduction video
          )
        }
      >
        <h3 className="font-semibold text-lg mb-2">Introduction</h3>
        <div className="flex items-center gap-3">
          <PlayCircle
            className={
              currentVideoUrl === contentData.video
                ? "text-primary"
                : "text-gray-400"
            }
          />
          <span
            className={currentVideoUrl === contentData.video ? "font-bold" : ""}
          >
            {lang === "en" ? contentData.titleEn : contentData.titleAm}
          </span>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="px-4 py-2 flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {lang === "en" ? "Course Sections" : "የኮርስ ክፍሎች"}
        </h4>
        <button
          onClick={() => {
            setStatusesLoading(true);
            contentData?.activity
              ?.filter((activity: any) => activity.hasQuiz)
              .forEach((activity: any) => {
                refreshActivityQuizStatus(activity.id);
              });
            setTimeout(() => setStatusesLoading(false), 1000);
          }}
          disabled={statusesLoading}
          className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {statusesLoading ? (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-slate-400 border-t-purple-500 rounded-full animate-spin" />
              <span>{lang === "en" ? "Updating..." : "በመዘመን ላይ..."}</span>
            </div>
          ) : lang === "en" ? (
            "Refresh Status"
          ) : (
            "ሁኔታ አድስ"
          )}
        </button>
      </div>

      <Accordion selectionMode="multiple" defaultExpandedKeys={["0"]}>
        {contentData.activity.map((activity: any, index: number) => (
          <AccordionItem
            key={activity.id || index}
            aria-label={`Section ${index + 1}`}
            title={`${lang === "en" ? "Section" : "ክፍል"} ${index + 1}: ${
              lang === "en" ? activity.titleEn : activity.titleAm
            }`}
          >
            <ul className="space-y-1 p-2">
              {activity.subActivity.map((sub: any) => {
                const isActive = sub.video === currentVideoUrl;
                return (
                  <li
                    key={sub.id}
                    onClick={() =>
                      onSelectVideo(
                        sub.video,
                        lang === "en" ? sub.titleEn : sub.titleAm,
                        sub.id
                      )
                    }
                    className={`flex items-center gap-2 cursor-pointer p-3 rounded ${
                      isActive
                        ? "bg-primary-100 font-bold"
                        : "hover:bg-primary-100"
                    }`}
                  >
                    {isActive ? (
                      <PlayCircle className="text-primary" />
                    ) : (
                      <CheckCircle2 className="text-gray-400" />
                    )}
                    <span>{lang === "en" ? sub.titleEn : sub.titleAm}</span>
                  </li>
                );
              })}

              {activity.hasQuiz && (
                <li
                  onClick={() => {
                    refreshActivityQuizStatus(activity.id);
                    router.push(
                      `/${lang}/mycourse/${contentData.id}/${activity.id}`
                    );
                  }}
                  className="flex items-center justify-between p-3 rounded hover:bg-primary-100 cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-purple-500" />
                    <span>{lang === "en" ? "Quiz" : "ፈተና"}</span>
                  </div>

                  {/* Quiz Status Indicator */}
                  <div className="flex items-center gap-2">
                    {statusesLoading ? (
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-purple-500 rounded-full animate-spin" />
                    ) : (
                      <>
                        {(() => {
                          const status = activityQuizStatuses[activity.id];
                          switch (status) {
                            case "done":
                              return (
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    {lang === "en" ? "Completed" : "ተጠናቋል"}
                                  </span>
                                </div>
                              );
                            case "partial":
                              return (
                                <div className="flex items-center gap-1">
                                  <div className="w-4 h-4 rounded-full border-2 border-amber-500">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full m-0.5" />
                                  </div>
                                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                    {lang === "en" ? "In Progress" : "በሂደት ላይ"}
                                  </span>
                                </div>
                              );
                            case "not-done":
                              return (
                                <div className="flex items-center gap-1">
                                  <Circle className="w-4 h-4 text-slate-400" />
                                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {lang === "en" ? "Not Started" : "አልተጀመረም"}
                                  </span>
                                </div>
                              );
                            case "no-quiz":
                              return (
                                <span className="text-xs text-slate-400">
                                  {lang === "en" ? "No Quiz" : "ፈተና የለም"}
                                </span>
                              );
                            default:
                              return (
                                <div className="flex items-center gap-1">
                                  <Circle className="w-4 h-4 text-slate-300" />
                                  <span className="text-xs text-slate-400">
                                    {lang === "en" ? "Unknown" : "ያልታወቀ"}
                                  </span>
                                </div>
                              );
                          }
                        })()}
                      </>
                    )}
                  </div>
                </li>
              )}
            </ul>
          </AccordionItem>
        ))}
      </Accordion>

      {/* FINAL EXAM BUTTON */}
      <div className="mt-6 mx-4 mb-4">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 shadow-lg">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-emerald-500/10 dark:from-sky-400/10 dark:via-purple-400/10 dark:to-emerald-400/10" />

          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                    finalExamLocked
                      ? "bg-gradient-to-br from-amber-400 to-orange-500"
                      : "bg-gradient-to-br from-emerald-400 to-teal-500"
                  }`}
                >
                  {finalExamLocked ? (
                    <Lock className="w-7 h-7 text-white" />
                  ) : (
                    <Trophy className="w-7 h-7 text-white" />
                  )}
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/30 to-transparent" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                    {lang === "en" ? "Final Exam" : "የመጨረሻ ፈተና"}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {finalExamLocked
                      ? lang === "en"
                        ? "Complete all activities to unlock"
                        : "ሁሉንም እንቅስቃሴዎች ይጨርሱ"
                      : examStatus === "done"
                      ? lang === "en"
                        ? "Exam completed successfully"
                        : "ፈተናው በተሳካ ሁኔታ ተጠናቋል"
                      : examStatus === "partial"
                      ? lang === "en"
                        ? "Resume your exam"
                        : "ፈተናዎን ይቀጥሉ"
                      : lang === "en"
                      ? "Test your knowledge"
                      : "እውቀትዎን ይሞክሩ"}
                  </p>

                  {/* Progress indicator for exam status */}
                  {!finalExamLocked && (
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          examStatus === "done"
                            ? "bg-emerald-500"
                            : examStatus === "partial"
                            ? "bg-amber-500"
                            : "bg-slate-300"
                        }`}
                      />
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {examStatus === "done"
                          ? lang === "en"
                            ? "Completed"
                            : "ተጠናቋል"
                          : examStatus === "partial"
                          ? lang === "en"
                            ? "In Progress"
                            : "በሂደት ላይ"
                          : lang === "en"
                          ? "Not Started"
                          : "አልተጀመረም"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {!finalExamLocked ? (
                  <button
                    onClick={() =>
                      router.push(`/${lang}/mycourse/${courseId}/finalexam`)
                    }
                    className="group relative px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500"
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <span className="relative flex items-center gap-2">
                      {examStatus === "done" ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          {lang === "en" ? "Review Exam" : "ፈተናን ይገምግሙ"}
                        </>
                      ) : examStatus === "partial" ? (
                        <>
                          <PlayCircle className="w-5 h-5" />
                          {lang === "en" ? "Continue Exam" : "ፈተናን ይቀጥሉ"}
                        </>
                      ) : (
                        <>
                          <Trophy className="w-5 h-5" />
                          {lang === "en" ? "Start Exam" : "ፈተናን ይጀምሩ"}
                        </>
                      )}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
                    <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      {lang === "en" ? "Locked" : "ተቆልፏል"}
                    </span>
                  </div>
                )}

                {/* Small info text */}
                <p className="text-xs text-slate-500 dark:text-slate-400 text-right max-w-32">
                  {lang === "en"
                    ? "Certification available"
                    : "የምስክር ወረቀት ይገኛል"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- MAIN PAGE ----------------
export default function Page() {
  const params = useParams<{ lang: string; id: string }>();
  const lang = params?.lang || "en";
  const courseId = params?.id || "";
  const { data: session } = useSession();
  const studentId = (session?.user as any)?.id;

  const { data, loading } = useData({
    func: getMySingleCourse,
    args: [studentId, courseId],
  });

  const { data: contentData, loading: contentLoading } = useData({
    func: getMySingleCourseContent,
    args: [studentId, courseId],
  });

  const { data: locks } = useData({
    func: unlockTheFinalExamAndQuiz,
    args: [courseId],
  });

  const { data: examStatus } = useData({
    func: getFinalExamStatus,
    args: [courseId],
  });

  const finalExamLocked = Boolean((locks as any)?.finalExamLocked);

  const [currentVideo, setCurrentVideo] = useState({
    url: "",
    title: "",
    subActivityId: "",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (data?.video) {
      setCurrentVideo({
        url: data.video,
        title: lang === "en" ? data.titleEn : data.titleAm,
        subActivityId: "", // Introduction video doesn't have subActivityId
      });
    }
  }, [data, lang]);

  const handleSelectVideo = (
    videoUrl: string,
    videoTitle: string,
    subActivityId?: string
  ) => {
    setCurrentVideo({
      url: videoUrl,
      title: videoTitle,
      subActivityId: subActivityId || "",
    });
    setIsSidebarOpen(false);
  };

  // -------- MAIN CONTENT TABS --------
  const courseTabs = [
    // Course Content (mobile only)
    {
      id: "content",
      label: lang === "en" ? "Course Content" : "የትምህርት ይዘት",
      content: (
        <CourseContent
          contentData={contentData ?? null}
          contentLoading={contentLoading}
          onSelectVideo={handleSelectVideo}
          lang={lang}
          currentVideoUrl={currentVideo.url}
          courseId={courseId}
          finalExamLocked={finalExamLocked}
          examStatus={examStatus || "not-done"}
        />
      ),
      className: "md:hidden", // hide on desktop
    },
    // Traditional Q&A
    {
      id: "qa",
      label: lang === "en" ? "Q&A" : "ጥያቄ እና መልስ",
      content: (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm overflow-hidden h-full flex flex-col">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-gray-700 p-2 sm:p-4 md:p-6 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1 sm:p-1.5 md:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md sm:rounded-lg md:rounded-xl shadow-lg flex-shrink-0">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                  {lang === "en" ? "Questions & Answers" : "ጥያቄዎች እና መልሶች"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 sm:truncate mt-0.5">
                  {lang === "en"
                    ? "Ask questions and get answers from instructors"
                    : "ጥያቄዎችን ጠይቁ እና ከአስተማሪዎች መልሶችን ያግኙ"}
                </p>
              </div>
            </div>
          </div>
          <div className="p-2 sm:p-4 md:p-6 flex-1 min-h-0 overflow-y-auto">
            <TraditionalQA courseId={courseId} lang={lang} />
          </div>
        </div>
      ),
    },
    // AI Assistant
    {
      id: "ai",
      label: lang === "en" ? "AI Assistant" : "AI ረዳት",
      content: (
        <div className="rounded-lg sm:rounded-xl md:rounded-2xl border border-purple-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
          {/* <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-purple-200 dark:border-gray-700 p-2 sm:p-4 md:p-6 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1 sm:p-1.5 md:p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md sm:rounded-lg md:rounded-xl shadow-lg flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                  {lang === "en" ? "AI Assistant" : "AI ረዳት"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 sm:truncate mt-0.5">
                  {lang === "en"
                    ? "Get instant AI-powered answers about the course"
                    : "ስለ ኮርሱ ፈጣን AI-ተኮር መልሶችን ያግኙ"}
                </p>
              </div>
            </div>
          </div> */}
          <div className="p-2 flex-1 overflow-y-auto">
            <ChatComponent />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className=" overflow-auto ">
      {loading ? (
        <Loading />
      ) : !data ? (
        <NoData />
      ) : (
        <div className="h-dvh flex flex-col overflow-auto bg-red-500  ">
          {/* MAIN CONTENT */}
          <div className="flex-1">
            {/* SIDEBAR TOGGLE (desktop only) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-4 right-4 z-10 p-2 bg-background rounded-full shadow hover:bg-primary-100 hidden md:block"
              aria-label="Toggle course content"
            >
              <PanelRightOpen />
            </button>

            {/* COURSE OVERVIEW WITH VIDEO */}
            <div className="flex-shrink-0">
              <CourseTopOverview
                {...{
                  title: currentVideo.title,
                  by: `${data.instructor.firstName} ${data.instructor.fatherName}`,
                  thumbnail: data.thumbnail,
                  video: currentVideo.url,
                }}
              />
            </div>

            {/* COURSE TABS */}
            <div className="flex-1 min-h-0">
              <div className="p-0 sm:p-4 md:p-8 h-full">
                <div className="h-full flex flex-col">
                  <div className="flex">
                    <div className="w-auto">
                      <Tabs
                        aria-label="Course Information"
                        items={courseTabs}
                        className="w-auto"
                      >
                        {(item) => (
                          <Tab
                            key={item.id}
                            title={item.label}
                            className={item.className}
                          >
                            <div className="p-2 sm:py-4 flex-1 min-h-0 overflow-y-auto h-full">
                              <div className="h-full flex flex-col max-w-4xl mx-auto">
                                {item.content}
                              </div>
                            </div>
                          </Tab>
                        )}
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR (desktop only) */}
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 hidden md:block">
              <div
                className="fixed inset-0 bg-black/50"
                onClick={() => setIsSidebarOpen(false)}
              />
              <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-lg">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute top-4 right-4 z-20 p-2"
                  aria-label="Close course content"
                >
                  <X />
                </button>
                <CourseContent
                  contentData={contentData ?? null}
                  contentLoading={contentLoading}
                  onSelectVideo={handleSelectVideo}
                  lang={lang}
                  currentVideoUrl={currentVideo.url}
                  courseId={courseId}
                  finalExamLocked={finalExamLocked}
                  examStatus={examStatus || "not-done"}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
