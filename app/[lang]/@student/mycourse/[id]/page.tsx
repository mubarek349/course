"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PanelRightOpen,
  PanelRightClose,
  PlayCircle,
  CheckCircle2,
  Sparkles,
  X,
} from "lucide-react";
import { Accordion, AccordionItem, Skeleton, Tabs, Tab } from "@heroui/react";

import useData from "@/hooks/useData";
import {
  getMySingleCourse,
  getMySingleCourseContent,
} from "@/actions/student/mycourse";
import Loading from "@/components/loading";
import NoData from "@/components/noData";
import CourseTopOverview from "@/components/courseTopOverview";
import { useSession } from "next-auth/react";

// ---------------- COURSE CONTENT COMPONENT ----------------
function CourseContent({
  contentData,
  contentLoading,
  onSelectVideo,
  lang,
  currentVideoUrl,
}: {
  contentData: any;
  contentLoading: boolean;
  onSelectVideo: (url: string, title: string) => void;
  lang: string;
  currentVideoUrl: string;
}) {
  const router = useRouter();

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
    <div className="w-full h-full flex flex-col">
      {/* INTRODUCTION */}
      <div
        className="px-4 py-2 cursor-pointer hover:bg-primary-100 rounded-lg m-2"
        onClick={() =>
          onSelectVideo(
            contentData.video,
            lang === "en" ? contentData.titleEn : contentData.titleAm
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
                        lang === "en" ? sub.titleEn : sub.titleAm
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
                  onClick={() =>
                    router.push(`/${lang}/activity/${activity.id}`)
                  }
                  className="flex items-center gap-2 cursor-pointer p-3 rounded hover:bg-primary-100"
                >
                  <Sparkles className="text-purple-500" />
                  <span>{lang === "en" ? "Quiz" : "ፈተና"}</span>
                </li>
              )}
            </ul>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// ---------------- MAIN PAGE ----------------
export default function Page() {
  const params = useParams<{ lang: string; id: string }>();
  const lang = params?.lang || "en";
  const id = params?.id ?? "";
  const { data: session } = useSession();
  const studentId = (session?.user as any)?.id;

  const { data, loading } = useData({
    func: getMySingleCourse,
    args: [studentId, id],
  });

  const { data: contentData, loading: contentLoading } = useData({
    func: getMySingleCourseContent,
    args: [studentId, id],
  });

  const [currentVideo, setCurrentVideo] = useState({
    url: "",
    title: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (data?.video) {
      setCurrentVideo({
        url: data.video,
        title: lang === "en" ? data.titleEn : data.titleAm,
      });
    }
  }, [data, lang]);

  const handleSelectVideo = (videoUrl: string, videoTitle: string) => {
    setCurrentVideo({ url: videoUrl, title: videoTitle });
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
        />
      ),
      className: "md:hidden", // hide on desktop
    },
    // AI Assistant (mobile only)
    {
      id: "ai",
      label: "AI Assistant",
      content: (
        <div className="p-4 flex items-center gap-2">
          <Sparkles className="text-purple-500" />
          <span>AI Assistant coming soon.</span>
        </div>
      ),
      // className: "md:hidden", // hide on desktop
    },
    // Q&A (always visible)
    {
      id: "q&a",
      label: lang === "en" ? "Q&A" : "ጥያቄ እና መልስ",
      content: <div className="p-4">Q&A section coming soon.</div>,
    },
  ];

  return (
    <div className="h-dvh">
      {loading ? (
        <Loading />
      ) : !data ? (
        <NoData />
      ) : (
        <div className="flex h-full">
          <div className="flex-1 overflow-y-auto relative">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100 hidden md:block"
              aria-label="Toggle course content"
            >
              {isSidebarOpen ? <PanelRightClose /> : <PanelRightOpen />}
            </button>

            {/* COURSE OVERVIEW WITH VIDEO */}
            <CourseTopOverview
              {...{
                title: currentVideo.title,
                by: `${data.instructor.firstName} ${data.instructor.fatherName}`,
                thumbnail: data.thumbnail,
                video: currentVideo.url,
              }}
            />

            {/* COURSE TABS */}
            <div className="p-4 md:p-8">
              <Tabs aria-label="Course Information" items={courseTabs}>
                {(item) => (
                  <Tab
                    key={item.id}
                    title={item.label}
                    className={item.className}
                  >
                    <div className="py-4">{item.content}</div>
                  </Tab>
                )}
              </Tabs>
            </div>
          </div>
          {isSidebarOpen && (
            <aside className="hidden md:block w-[30rem] border-l h-full overflow-y-auto">
              <CourseContent
                contentData={contentData}
                contentLoading={contentLoading}
                onSelectVideo={handleSelectVideo}
                lang={lang}
                currentVideoUrl={currentVideo.url}
              />
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
