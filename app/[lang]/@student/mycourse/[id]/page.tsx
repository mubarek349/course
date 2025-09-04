"use client";

// import "./youtube.css";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  ChartBarIncreasing,
  Clock,
  Languages,
  Logs,
  MonitorSmartphone,
  ReceiptText,
  PanelRightOpen,
  PanelRightClose,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import { Accordion, AccordionItem, Skeleton } from "@heroui/react";

import useData from "@/hooks/useData";
import Content from "./content";
import {
  getMySingleCourse,
  getMySingleCourseContent,
} from "@/actions/student/mycourse";
import Loading from "@/components/loading";
import NoData from "@/components/noData";
import CourseAbout from "@/components/courseAbout";
import CourseMainDescription from "@/components/courseMainDescription";
import CourseRequirement from "@/components/courseRequirement";
import CourseFor from "@/components/courseFor";
import CourseTopOverview from "@/components/courseTopOverview";
import { useSession } from "next-auth/react";

function CourseContentSidebar({
  contentData,
  contentLoading,
  onSelectVideo,
  lang,
  currentVideoUrl,
}: any) {
  if (contentLoading) {
    return (
      <div className="w-full p-4 space-y-4">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    );
  }

  if (!Array.isArray(contentData) || contentData.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No course content available.
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 px-4 pt-4">
        {lang === "en" ? "Course Content" : "የትምህርት ይዘት"}
      </h2>
      <Accordion selectionMode="multiple" defaultExpandedKeys={["0"]}>
        {contentData.map((activity: any, index: number) => (
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
                        : "hover:bg-gray-100"
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
            </ul>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

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
    args: [studentId, id]
  });

  const [currentVideo, setCurrentVideo] = useState({
    url: "",
    title: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  React.useEffect(() => {
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

  return (
    <div className="h-dvh pt-16">
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
            <CourseTopOverview
              {...{
                title: currentVideo.title,
                by: `${data.instructor.firstName} ${data.instructor.fatherName}`,
                thumbnail: data.thumbnail,
                video: currentVideo.url,
              }}
            />
          </div>
          {isSidebarOpen && (
            <aside className="hidden md:block w-[30rem] border-l h-full overflow-y-auto">
              <CourseContentSidebar
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
