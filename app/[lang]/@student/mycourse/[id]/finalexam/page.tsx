"use client";
// Ensure needed hooks are imported
import React, { useEffect, useMemo, useState } from "react";
import useAction from "@/hooks/useAction";
import useData from "@/hooks/useData";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  X,
  Trophy,
} from "lucide-react";
import {
  getFinalExam,
  getFinalExamStatus,
  submitFinalExamAnswers,
  readyToCertification,
} from "@/actions/student/mycourse";

// Strong types for questions/options
type ExamOption = { id: string; label: string };
type ExamQuestion = {
  id: string;
  text: string;
  options: ExamOption[];
  correctIndex: number;
  explanation?: string;
  previouslySelectedIndex: number;
};

export default function Page() {
  const router = useRouter();
  const params = useParams<{ lang: string; id: string }>();
  const lang = params?.lang || "en";
  const courseId = params?.id || "";

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState<"paged" | "all">("paged");
  const [showCongrats, setShowCongrats] = useState(false);

  const { data, loading } = useData({ func: getFinalExam, args: [courseId] });
  const { data: status } = useData({
    func: getFinalExamStatus,
    args: [courseId],
  });
  const { action } = useAction(submitFinalExamAnswers, undefined, {
    error: lang === "en" ? "Saving answer failed" : "መልስ ማስቀመጥ አልተሳካም",
    success: lang === "en" ? "Answer saved" : "መልስ ተቀምጧል",
  });
  const { data: cert, loading: certLoading } = useData({
    func: readyToCertification,
    args: [courseId],
  });

  const questions = useMemo<ExamQuestion[]>(() => {
    const list = Array.isArray(data) ? data : [];
    return list.map((q: any) => {
      const opts: ExamOption[] = Array.isArray(q.questionOptions)
        ? q.questionOptions.map((o: any) => ({ id: o.id, label: o.option }))
        : [];
      const answerId = Array.isArray(q.questionAnswer)
        ? q.questionAnswer[0]?.answerId
        : q.questionAnswer?.answerId;
      const correctIndex = opts.findIndex((o: ExamOption) => o.id === answerId);
      const preIdx = q.studentSelectedOptionId
        ? opts.findIndex((o: ExamOption) => o.id === q.studentSelectedOptionId)
        : -1;
      return {
        id: q.id,
        text: q.question as string,
        options: opts,
        correctIndex,
        explanation: (q.answerExplanation ?? "") as string,
        previouslySelectedIndex: preIdx,
      } as ExamQuestion;
    });
  }, [data]);

  useEffect(() => {
    setAnswers(questions.map((q) => q.previouslySelectedIndex ?? -1));
    setCurrent(0);
    setSelected(null);
    setSubmitted(false);
    setReviewMode("paged");
  }, [questions.length]);

  const quizDone = status === "done";
  const answeredCount = answers.filter((a) => a >= 0).length;
  const allAnswered =
    questions.length > 0 && answeredCount === questions.length;

  // Compute score for modal
  const score = useMemo(
    () =>
      answers.reduce(
        (acc, ans, idx) => acc + (ans === questions[idx]?.correctIndex ? 1 : 0),
        0
      ),
    [answers, questions]
  );

  const q = questions[current];
  const effectiveSelected = answers[current] >= 0 ? answers[current] : selected;

  // Review card for a single question (used in both modes)
  const ReviewCard = ({ qi, idx }: { qi: ExamQuestion; idx: number }) => {
    const selectedIdx = answers[idx];
    return (
      <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 p-4">
        <div className="text-xs text-slate-500 mb-2">
          Question {idx + 1} of {questions.length}
        </div>
        <p className="mb-3">{qi.text}</p>
        <div className="space-y-2">
          {qi.options.map((opt: ExamOption, i: number) => {
            const isCorrect = i === qi.correctIndex;
            const isSelected = i === selectedIdx;
            let style = "border-slate-300 dark:border-slate-700";
            if (isCorrect)
              style =
                "border-emerald-500 bg-emerald-100 dark:bg-emerald-500/10";
            else if (isSelected)
              style = "border-rose-500 bg-rose-100 dark:bg-rose-500/10";
            return (
              <div
                key={opt.id}
                className={`w-full text-left px-3 py-2 rounded-xl border ${style} flex items-center gap-2`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500" />
                )}
                <span>{opt.label}</span>
              </div>
            );
          })}
        </div>
        {qi.explanation && (
          <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-700 dark:text-slate-300">
            <p className="font-medium mb-1">Explanation</p>
            <p>{qi.explanation}</p>
          </div>
        )}
      </div>
    );
  };

  const handleOption = (idx: number) => {
    if (quizDone || submitted) return;
    setSelected(idx);
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

  const submitExam = () => {
    setSubmitted(true);
    setReviewMode("all");
    setShowCongrats(true);
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
            {submitted && (
              <div className="inline-flex items-center rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                <button
                  onClick={() => setReviewMode("paged")}
                  className={`px-3 py-1 text-sm ${
                    reviewMode === "paged"
                      ? "bg-slate-200 dark:bg-slate-800 font-medium"
                      : ""
                  }`}
                >
                  One-by-One
                </button>
                <button
                  onClick={() => setReviewMode("all")}
                  className={`px-3 py-1 text-sm border-l border-slate-300 dark:border-slate-700 ${
                    reviewMode === "all"
                      ? "bg-slate-200 dark:bg-slate-800 font-medium"
                      : ""
                  }`}
                >
                  View All
                </button>
              </div>
            )}
          </div>

          {!submitted ? (
            <>
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
                          disabled={submitted || status === "done"}
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
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {current < questions.length - 1 && (
                      <button
                        onClick={() =>
                          goto(Math.min(questions.length - 1, current + 1))
                        }
                        className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white"
                      >
                        Next <ChevronRight className="w-4 h-4 inline ml-1" />
                      </button>
                    )}
                    {current === questions.length - 1 && (
                      <button
                        onClick={submitExam}
                        disabled={answers.some((a) => a < 0)}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-50"
                      >
                        Submit Exam
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : reviewMode === "paged" ? (
            <>
              <ReviewCard qi={q} idx={current} />
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => goto(Math.max(0, current - 1))}
                  disabled={current === 0}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      goto(Math.min(questions.length - 1, current + 1))
                    }
                    className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white"
                  >
                    Next <ChevronRight className="w-4 h-4 inline ml-1" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">Review All</h2>
              </div>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {questions.map((qi, i) => (
                  <ReviewCard key={qi.id} qi={qi} idx={i} />
                ))}
              </div>
            </>
          )}
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
            {questions.map((qi: any, i: number) => {
              const answered = answers[i] >= 0;
              const currentPage = i === current;
              const isCorrect = answered && answers[i] === qi.correctIndex;
              return (
                <button
                  key={i}
                  onClick={() => goto(i)}
                  className={`h-8 rounded border text-xs ${
                    currentPage
                      ? "border-sky-500 text-sky-600"
                      : submitted
                      ? isCorrect
                        ? "border-emerald-500 text-emerald-600"
                        : "border-rose-500 text-rose-600"
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

      {/* Congrats Modal */}
      {submitted && showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md bg-background border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setShowCongrats(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold">Congratulations!</h2>
              <p className="text-slate-600 dark:text-slate-300">
                You have submitted the final exam.
              </p>

              {/* Result summary from readyToCertification */}
              {!certLoading && cert && (
                <div className="w-full mt-2">
                  <div className="flex items-center justify-center gap-2 text-sm mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-full border text-xs ${
                        cert.result === "excellent"
                          ? "border-emerald-500 text-emerald-600"
                          : cert.result === "veryGood"
                          ? "border-sky-500 text-sky-600"
                          : cert.result === "good"
                          ? "border-amber-500 text-amber-600"
                          : "border-rose-500 text-rose-600"
                      }`}
                    >
                      {String(cert.result).toUpperCase()}
                    </span>
                    <span className="text-slate-500">
                      {Math.round(cert.percent)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, Math.round(cert.percent || 0))
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Correct: {cert.correct} / {cert.total}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 w-full mt-2">
                <button
                  onClick={() => {
                    setReviewMode("all");
                    setShowCongrats(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white"
                >
                  View All
                </button>
                <button
                  onClick={() => setShowCongrats(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Close
                </button>
              </div>

              <button
                onClick={() =>
                  router.push(
                    `/${lang}/@student/mycourse/${courseId}/certificate`
                  )
                }
                disabled={!cert?.status}
                className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
              >
                Go to Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
