"use client";
import useAction from "@/hooks/useAction";
import useData from "@/hooks/useData";
import {
  //   getFinalExams,
  getFinalExam,
  getFinalExamStatus,
  saveStudentQuizAnswers,
} from "@/actions/student/mycourse";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Circle,
  X,
} from "lucide-react";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ lang: string; id: string }>();
  const lang = params?.lang || "en";
  const courseId = params?.id || "";

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(3 * 60 * 60); // 3 hours

  const { data, loading } = useData({ func: getFinalExam, args: [courseId] });
  const { data: status } = useData({
    func: getFinalExamStatus,
    args: [courseId],
  });
  const { action, isPending } = useAction(saveStudentQuizAnswers, undefined, {
    error: lang === "en" ? "Saving answer failed" : "መልስ ማስቀመጥ አልተሳካም",
    success: lang === "en" ? "Answer saved" : "መልስ ተቀምጧል",
  });

  const questions = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return list.map((q: any) => {
      const opts = Array.isArray(q.questionOptions) ? q.questionOptions : [];
      const answerId = Array.isArray(q.questionAnswer)
        ? q.questionAnswer[0]?.answerId
        : q.questionAnswer?.answerId;
      const correctIndex = opts.findIndex((o: any) => o.id === answerId);
      const preIdx = q.studentSelectedOptionId
        ? opts.findIndex((o: any) => o.id === q.studentSelectedOptionId)
        : -1;
      return {
        id: q.id,
        text: q.question,
        options: opts.map((o: any) => ({ id: o.id, label: o.option })),
        correctIndex,
        previouslySelectedIndex: preIdx,
      };
    });
  }, [data]);

  useEffect(() => {
    setAnswers(questions.map((q) => q.previouslySelectedIndex ?? -1));
    setCurrent(0);
    setSelected(null);
  }, [questions.length]);

  useEffect(() => {
    if (!questions.length) return;
    if (status === "done") return; // stop timer when already done
    const id = setInterval(() => setTimeLeft((t) => Math.max(t - 1, 0)), 1000);
    return () => clearInterval(id);
  }, [questions.length, status]);

  const formatted = useMemo(() => {
    const h = Math.floor(timeLeft / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((timeLeft % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(timeLeft % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [timeLeft]);

  const quizDone = status === "done";
  const quizPartial = status === "partial";

  const q = questions[current];
  const effectiveSelected = answers[current] >= 0 ? answers[current] : selected;

  const handleOption = (idx: number) => {
    if (quizDone) return;
    if (quizPartial && answers[current] >= 0) return;
    setSelected(idx);
    // save immediately
    const optionId = q.options[idx].id;
    void action({ questionId: q.id, selectedOptionId: optionId } as any);
    const copy = [...answers];
    copy[current] = idx;
    setAnswers(copy);
  };

  const goto = (i: number) => {
    setCurrent(i);
    const preset = answers[i];
    setSelected(preset >= 0 ? preset : null);
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-background text-foreground flex items-center justify-center p-6">
        Loading…
      </div>
    );
  }
  if (!questions.length) {
    return (
      <div className="min-h-dvh bg-background text-foreground flex items-center justify-center p-6">
        No final exam.
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4">
        <div className="bg-background border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold">Final Exam</h1>
            <div className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700">
              <Clock className="w-4 h-4" /> Time left {formatted}
            </div>
          </div>

          <div className="text-xs text-slate-500 mb-2">
            Question {current + 1} of {questions.length}
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 p-4">
            <p className="mb-3">{q.text}</p>
            <div className="space-y-2">
              {q.options.map(
                (opt: { id: string; label: string }, idx: number) => {
                  const active = effectiveSelected === idx;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOption(idx)}
                      disabled={
                        quizDone || (quizPartial && answers[current] >= 0)
                      }
                      className={`w-full text-left px-3 py-2 rounded-xl border transition flex items-center gap-2 ${
                        active
                          ? "border-sky-500 bg-sky-100 dark:bg-sky-500/10"
                          : "border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {active ? (
                        <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500" />
                      )}
                      <span>{opt.label}</span>
                    </button>
                  );
                }
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => goto(Math.max(0, current - 1))}
                disabled={current === 0}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Previous page
              </button>
              <button
                onClick={() =>
                  goto(Math.min(questions.length - 1, current + 1))
                }
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white"
              >
                Next page <ChevronRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="bg-background border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Quiz navigation</h2>
            <button
              onClick={() => router.back()}
              className="text-slate-500 hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {questions.map((_: any, i: number) => {
              const answered = answers[i] >= 0;
              const currentPage = i === current;
              return (
                <button
                  key={i}
                  onClick={() => goto(i)}
                  className={`h-8 rounded border text-xs ${
                    currentPage
                      ? "border-sky-500 text-sky-600"
                      : answered
                      ? "border-emerald-500 text-emerald-600"
                      : "border-slate-300 dark:border-slate-700 text-slate-500"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
