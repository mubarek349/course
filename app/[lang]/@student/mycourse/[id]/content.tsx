"use client";

import React from "react";
import { Accordion, AccordionItem, Skeleton } from "@heroui/react";
import { PlayCircle, CheckCircle2 } from "lucide-react";

export default function Content({
  activities,
  onSelectVideo,
  lang,
  currentVideoUrl,
  loading,
}: any) {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  if (loading) {
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

  if (!Array.isArray(activities) || activities.length === 0) {
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
        {activities.map((activity: any, index: number) => (
          <AccordionItem
            key={index}
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
