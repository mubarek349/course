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
  Sparkles,
  X,
} from "lucide-react";
import { Accordion, AccordionItem, Skeleton, Tabs, Tab } from "@heroui/react";

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

// Define the type for the content data object
type ContentData = {
  id: string;
  titleEn: string;
  titleAm: string;
  video: string;
  activity: {
    id: string;
    titleEn: string;
    titleAm: string;
    order: number;
    subActivity: {
      id: string;
      titleEn: string;
      titleAm: string;
      video: string;
      order: number;
    }[];
  }[];
} | null;

function CourseContentSidebar({
  contentData,
  contentLoading,
  onSelectVideo,
  lang,
  currentVideoUrl,
}: {
  contentData: ContentData;
  contentLoading: boolean;
  onSelectVideo: (url: string, title: string) => void;
  lang: string;
  currentVideoUrl: string;
}) {
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

  // Check for the nested activity array
  if (
    !contentData ||
    !Array.isArray(contentData.activity) ||
    contentData.activity.length === 0
  ) {
    return (
      <div className="p-4 text-center text-gray-500">
        No course content available.
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs aria-label="Sidebar Tabs" className="pt-12">
        <Tab
          key="content"
          title={
            <div className="flex items-center gap-2">
              <span>{lang === "en" ? "Course Content" : "የትምህርት ይዘት"}</span>
            </div>
          }
        >
          <div
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-lg m-2"
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
                className={
                  currentVideoUrl === contentData.video ? "font-bold" : ""
                }
              >
                {lang === "en" ? contentData.titleEn : contentData.titleAm}
              </span>
            </div>
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
        </Tab>
        <Tab
          key="ai"
          title={
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-500" />
              <span>AI Assistant</span>
            </div>
          }
        >
          <div className="p-4">AI Assistant coming soon.</div>
        </Tab>
      </Tabs>
    </div>
  );
}

// New component for mobile content tab
function MobileCourseContent({
  contentData,
  contentLoading,
  onSelectVideo,
  lang,
  currentVideoUrl,
}: {
  contentData: ContentData;
  contentLoading: boolean;
  onSelectVideo: (url: string, title: string) => void;
  lang: string;
  currentVideoUrl: string;
}) {
  if (contentLoading) {
    return (
      <div className="w-full p-4 space-y-4">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  if (
    !contentData ||
    !Array.isArray(contentData.activity) ||
    contentData.activity.length === 0
  ) {
    return (
      <div className="p-4 text-center text-gray-500">
        No course content available.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-lg m-2"
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
    args: [studentId, id],
  });
  console.log("fufu", contentData);

  const [currentVideo, setCurrentVideo] = useState({
    url: "",
    title: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (data?.video) {
      setCurrentVideo({
        url: data.video,
        title: lang === "en" ? data.titleEn : data.titleAm,
      });
    }
  }, [data, lang]);

  const handleSelectVideo: (videoUrl: string, videoTitle: string) => void = (
    videoUrl,
    videoTitle
  ) => {
    setCurrentVideo({ url: videoUrl, title: videoTitle });
  };

  const courseTabs = [
    // {
    //   id: "overview",
    //   label: lang === "en" ? "Overview" : "አጠቃላይ እይታ",
    //   content: (
    //     <div className="space-y-8">
    //       {/* <CourseAbout data={lang === "en" ? data.aboutEn : data.aboutAm} /> */}
    //       <CourseMainDescription
    //         data={[
    //           // {
    //           //   icon: <ChartBarIncreasing className="" />,
    //           //   label: lang == "en" ? "Level" : "ደረጃ",
    //           //   value: data.level,
    //           // },
    //           // {
    //           //   icon: <Languages className="" />,
    //           //   label: lang == "en" ? "Language" : "ቋንቋ",
    //           //   value: data.language,
    //           // },
    //           {
    //             icon: <Logs className="" />,
    //             label: lang == "en" ? "Activities" : "ተግባራት",
    //             value:
    //               contentData?.activity?.reduce(
    //                 (a: number, c: any) => a + (c.subActivity?.length || 0),
    //                 0
    //               ) || 0,
    //           },
    //           // ...(data.certificate
    //           //   ? [
    //           //       {
    //           //         icon: <ReceiptText className="" />,
    //           //         label: "",
    //           //         value:
    //           //           lang == "en"
    //           //             ? "Certificate of completion"
    //           //             : "የማጠናቀቂያ የምስክር ወረቀት",
    //           //       },
    //           //     ]
    //           //   : []),
    //         ]}
    //       />
    //       {/* <CourseRequirement data={data.requirement} /> */}
    //       {/* <CourseFor data={data.courseFor} /> */}
    //     </div>
    //   ),
    // },
    {
      id: "content",
      label: lang === "en" ? "Course Content" : "የትምህርት ይዘት",
      content: (
        <MobileCourseContent
          contentData={contentData ?? null}
          contentLoading={contentLoading}
          onSelectVideo={handleSelectVideo}
          lang={lang}
          currentVideoUrl={currentVideo.url}
        />
      ),
      className: "md:hidden", // Only show on mobile
    },
    {
      id: "ai-assistant",
      label: "AI Assistant",
      content: "AI Assistant coming soon.",
      className: "md:hidden", // Only show on mobile
    },
    {
      id: "q&a",
      label: lang === "en" ? "Q&A" : "ጥያቄ እና መልስ",
      content: "Q&A section coming soon.",
    },
    {
      id: "notes",
      label: lang === "en" ? "Notes" : "ማስታወሻዎች",
      content: "Notes section coming soon.",
    },
    {
      id: "announcements",
      label: lang === "en" ? "Announcements" : "ማስታወቂያዎች",
      content: "Announcements section coming soon.",
    },
  ];

  return (
    <div className="h-dvh pt-16">
      {loading ? (
        <Loading />
      ) : !data ? (
        <NoData />
      ) : (
        <div className="h-full relative">
          <div className="h-full overflow-y-auto">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100 hidden md:block"
              aria-label="Toggle course content"
            >
              <PanelRightOpen />
            </button>
            <CourseTopOverview
              {...{
                title: currentVideo.title,
                by: `${data.instructor.firstName} ${data.instructor.fatherName}`,
                thumbnail: data.thumbnail,
                video: currentVideo.url,
              }}
            />
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
          {/* Universal Sidebar Overlay - DESKTOP ONLY */}
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 hidden md:block">
              <div
                className="fixed inset-0 bg-black/50"
                onClick={() => setIsSidebarOpen(false)}
              ></div>
              <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg transition-transform transform translate-x-0">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute top-4 right-4 z-20 p-2"
                  aria-label="Close course content"
                >
                  <X />
                </button>
                <CourseContentSidebar
                  contentData={contentData ?? null}
                  contentLoading={contentLoading}
                  onSelectVideo={handleSelectVideo}
                  lang={lang}
                  currentVideoUrl={currentVideo.url}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
