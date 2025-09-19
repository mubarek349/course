/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useMemo } from "react";
import useData from "@/hooks/useData";
import {
  unlockTheFinalExamAndQuiz,
  readyToCertification,
} from "@/actions/student/mycourse";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Lock, Trophy, ChevronRight } from "lucide-react";

function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams<{ lang: string; id: string }>();
  const lang = params?.lang || "en"; 
  const courseId = params?.id || "";
  const pathname = usePathname();

  const { data: locks, loading: locksLoading } = useData({
    func: unlockTheFinalExamAndQuiz,
    args: [courseId],
  });
  const { data: cert } = useData({
    func: readyToCertification,
    args: [courseId],
  });

  const lastSeg = useMemo(() => {
    const segs = (pathname || "").split("/").filter(Boolean);
    return segs[segs.length - 1] || "";
  }, [pathname]);

  const isFinalExam = lastSeg === "finalexam";
  const isCertificate = lastSeg === "certificate";
  const activityInfo = useMemo(() => {
    const acts = (locks as any)?.activities || [];
    return acts.find((a: any) => a.activityId === lastSeg) || null;
  }, [locks, lastSeg]);

  const activityLocked = !!activityInfo?.locked;
  const finalExamLocked = !!(locks as any)?.finalExamLocked;
  const nextUnlock = (locks as any)?.nextUnlockActivityId as string | null;

  // Loading: let page handle its own loader to avoid double spinners
  if (!courseId || locksLoading) return <>{children}</>;

  // Block final exam if locked
  if (isFinalExam && finalExamLocked) {
    return (
      <div className="bg-background overflow-hidden text-foreground flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold mb-1">Final exam is locked</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Please complete all quizzes to unlock the final exam.
          </p>
          {nextUnlock ? (
            <button
              onClick={() =>
                router.push(`/${lang}/mycourse/${courseId}/${nextUnlock}`)
              }
              className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white inline-flex items-center gap-2"
            >
              Go to next quiz <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  // Block locked quiz activity routes
  if (activityInfo && activityLocked) {
    return (
      <div className="min-h-dvh bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold mb-1">This quiz is locked</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Complete previous quizzes to unlock this activity.
          </p>
          {nextUnlock ? (
            <button
              onClick={() =>
                router.push(`/${lang}/mycourse/${courseId}/${nextUnlock}`)
              }
              className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white inline-flex items-center gap-2"
            >
              Go to next quiz <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  // For allowable routes, show a certificate banner (except on the certificate page itself)
  return (
    <div className="grid grid-rows-[auto_1fr] overflow-hidden relative ">
      
      {/* {!isCertificate && cert?.status && (
        <div className="sticky top-0 z-10 bg-emerald-600 text-white">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">Certificate is ready</span>
            </div>
            <button
              onClick={() =>
                router.push(`/${lang}/mycourse/${courseId}/certificate`)
              }
              className="text-sm px-3 py-1 rounded-md bg-white/15 hover:bg-white/25 inline-flex items-center gap-1"
            >
              View certificate <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )} */}
      {children}
    </div>
  );
}

export default Layout;
