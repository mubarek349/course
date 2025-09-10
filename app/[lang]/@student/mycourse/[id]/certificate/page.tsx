"use client";
import useData from "@/hooks/useData";
import { readyToCertification } from "@/actions/student/mycourse";
import { useParams, useRouter } from "next/navigation";
import { Trophy, CheckCircle2, X } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ lang: string; id: string }>();
  const lang = params?.lang || "en";
  const courseId = params?.id || "";

  const { data, loading } = useData({
    func: readyToCertification,
    args: [courseId],
  });

  if (loading) {
    return (
      <div className="min-h-dvh bg-background text-foreground flex items-center justify-center p-6">
        Loading…
      </div>
    );
  }

  if (!data || data.result === "nottaken" || data.result === "error") {
    return (
      <div className="min-h-dvh bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center mb-3">
            <X className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-semibold mb-1">
            Final Exam Not Completed
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Please complete the final exam to become eligible for the
            certificate.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const percent = Math.round(data.percent || 0);
  const result = String(data.result || "").toUpperCase();

  return (
    <div className="min-h-dvh bg-background text-foreground flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-background border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold">Certificate</h1>
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-foreground"
          >
            Close
          </button>
        </div>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold">Eligible for Certificate</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Great job completing the course final exam.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm mb-2">
            <span
              className={`px-2 py-0.5 rounded-full border text-xs ${
                data.result === "excellent"
                  ? "border-emerald-500 text-emerald-600"
                  : data.result === "veryGood"
                  ? "border-sky-500 text-sky-600"
                  : data.result === "good"
                  ? "border-amber-500 text-amber-600"
                  : "border-slate-400 text-slate-600"
              }`}
            >
              {result}
            </span>
            <span className="text-slate-500">{percent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="text-xs text-slate-500">
            Correct: {data.correct} / {data.total}
          </div>

          <button
            onClick={() =>
              alert("Certificate generation is not yet implemented.")
            }
            className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Get Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
