"use client";
import useAction from "@/hooks/useAction";
import useData from "@/hooks/useData";
import {
  getActivityQuiz,
  saveStudentQuizAnswers,
  getActivityQuizStatus,
} from "@/actions/student/mycourse";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  Circle,
  ChevronRight,
  X,
} from "lucide-react";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ lang: string; id: string; activityId: string }>();
  const lang = params?.lang || "en";
  const activityId = params?.activityId || "";

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const { data, loading } = useData({
    func: getActivityQuiz,
    args: [activityId],
  });
  const { action, isPending } = useAction(saveStudentQuizAnswers, undefined, {
    error: lang == "en" ? "Sending message failed" : "መልእክት መላክ አልተሳካም",
    success: lang == "en" ? "Message sent successfully" : "መልእክት በተሳካ ሁኔታ ተልኳል",
  });

  const { data: quizStatus, loading: quizStatusLoading } = useData({
    func: getActivityQuizStatus,
    args: [activityId],
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
        explanation: q.answerExplanation ?? "",
        previouslySelectedIndex: preIdx,
      };
    });
  }, [data]);

  // Prefill answers from history
  useEffect(() => {
    setAnswers(questions.map((q) => q.previouslySelectedIndex ?? -1));
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setShowFeedback(false);
  }, [questions.length]);

  // Lock flags
  const quizDone = quizStatus === "done";
  const quizPartial = quizStatus === "partial";
  const questionAlreadyAnswered = answers[current] >= 0;

  const progressPct = useMemo(
    () =>
      questions.length
        ? Math.round(((current + 1) / questions.length) * 100)
        : 0,
    [current, questions.length]
  );

  const score = useMemo(
    () =>
      answers.reduce(
        (acc: number, ans: number, idx: number) =>
          acc + (ans === questions[idx]?.correctIndex ? 1 : 0),
        0
      ),
    [answers, questions]
  );

  if (loading) {
    return (
      <div className="min-h-dvh bg-background text-foreground flex items-center justify-center p-6">
        <div className="text-sm opacity-70">Loading quiz…</div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-dvh bg-background text-foreground flex items-center justify-center p-6">
        <div className="text-sm opacity-70">
          No quiz available for this activity.
        </div>
      </div>
    );
  }

  const q = questions[current];
  const correctIdx = q.correctIndex;
  const effectiveSelected = answers[current] >= 0 ? answers[current] : selected;
  const isCorrectSelection =
    effectiveSelected !== null && effectiveSelected === correctIdx;

  const handleOption = (idx: number) => {
    if (showFeedback) return; // lock during feedback
    if (quizDone) return; // block when quiz completed
    if (quizPartial && answers[current] >= 0) return; // already answered
    setSelected(idx);
  };

  const handleNext = async () => {
    if (selected === null) {
      // If the user can't answer (done or already answered), just advance
      if (quizDone || (quizPartial && questionAlreadyAnswered)) {
        if (current < questions.length - 1) {
          setCurrent(current + 1);
          setSelected(null);
          setShowFeedback(false);
        } else {
          setShowResult(true);
        }
      }
      return;
    }

    if (!showFeedback) {
      const nextAnswers = [...answers];
      nextAnswers[current] = selected;
      setAnswers(nextAnswers);
      setShowFeedback(true);

      // Persist only if not previously answered
      if (!questionAlreadyAnswered) {
        const selectedOptionId = questions[current].options[selected].id;
        void action({
          questionId: questions[current].id,
          selectedOptionId,
        } as any);
      }
      return;
    }

    if (current < questions.length - 1) {
      const nextIndex = current + 1;
      setCurrent(nextIndex);
      const preset = answers[nextIndex];
      setSelected(preset >= 0 ? preset : null);
      setShowFeedback(false);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (current === 0) return;
    const prev = current - 1;
    setCurrent(prev);
    const preset = answers[prev];
    setSelected(preset >= 0 ? preset : null);
    setShowFeedback(false);
  };

  const handleQuit = () => router.back();

  // Feedback visibility: always show for answered questions or when showFeedback
  const shouldShowFeedback = showFeedback || answers[current] >= 0 || quizDone;

  // Advance availability without current selection
  const canAdvanceWithoutSelect =
    quizDone || (quizPartial && answers[current] >= 0) || shouldShowFeedback;

  // Update labels
  const nextLabel = shouldShowFeedback
    ? current === questions.length - 1
      ? "See Result"
      : "Continue"
    : current === questions.length - 1
    ? "Submit"
    : "Next";

  if (showResult) {
    const total = questions.length;
    const coins = score * 250;
    const perfect = score === total;
    return (
      <div className="min-h-dvh bg-background text-foreground flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-background border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_50%)]" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-yellow-400/15 flex items-center justify-center">
              <Trophy className="w-14 h-14 text-yellow-500 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold">
              {perfect ? "Winner!" : "Quiz Result"}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-sm">
              {perfect
                ? "Outstanding performance."
                : "Great job completing the quiz. Keep practicing!"}
            </p>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="uppercase tracking-wide text-slate-500 dark:text-slate-400 text-xs">
                Your Score
              </span>
              <span className="text-3xl font-extrabold">{score}</span>
              <span className="text-xl text-slate-500 dark:text-slate-400">
                / {total}
              </span>
            </div>

            <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3 py-1">
                <Sparkles className="w-4 h-4" /> Earned Coins: <b>{coins}</b>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full mt-6">
              <button
                onClick={() =>
                  window.navigator.share?.({
                    title: "Quiz Result",
                    text: `I scored ${score}/${total}!`,
                  })
                }
                className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Share Results
              </button>
              <button
                onClick={() => {
                  setCurrent(0);
                  setSelected(null);
                  setAnswers(Array(questions.length).fill(-1));
                  setShowResult(false);
                  setShowFeedback(false);
                }}
                className="px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white dark:text-slate-900 font-semibold transition"
              >
                Take New Quiz
              </button>
            </div>

            <button
              onClick={handleQuit}
              className="mt-3 inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" /> Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh text-foreground flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-background border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_50%)]" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="uppercase text-xs tracking-widest text-slate-500 dark:text-slate-400">
                Mathematics Quiz
              </p>
              <h2 className="text-lg font-semibold">
                Question {String(current + 1).padStart(2, "0")}
                <span className="text-slate-500 dark:text-slate-400">
                  /{questions.length}
                </span>
              </h2>
            </div>
            <button
              onClick={handleQuit}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {progressPct}% completed
            </p>
          </div>

          {/* Question Text */}
          <p className="text-slate-800 dark:text-slate-100 leading-relaxed">
            {q.text}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map(
              (opt: { id: string; label: string }, idx: number) => {
                const isCorrectOption = idx === correctIdx;
                const isSelected = effectiveSelected === idx;
                const base =
                  "w-full text-left px-4 py-3 rounded-2xl border transition flex items-center gap-3";

                let style =
                  "border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800";
                let icon: React.ReactNode = (
                  <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                );

                if (shouldShowFeedback) {
                  if (isCorrectOption) {
                    style =
                      "border-emerald-500 bg-emerald-100 dark:bg-emerald-500/10";
                    icon = (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    );
                  } else if (isSelected) {
                    style =
                      "border-amber-500 bg-amber-100 dark:bg-amber-500/10";
                    icon = (
                      <X className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    );
                  } else {
                    style = "border-slate-300 dark:border-slate-700 opacity-60";
                  }
                } else if (isSelected) {
                  style = "border-sky-500 bg-sky-100 dark:bg-sky-500/10";
                  icon = (
                    <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  );
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOption(idx)}
                    disabled={
                      showFeedback ||
                      quizDone ||
                      (quizPartial && answers[current] >= 0)
                    }
                    className={`${base} ${style}`}
                  >
                    {icon}
                    <span className="text-sm text-slate-800 dark:text-slate-200">
                      {opt.label}
                    </span>
                  </button>
                );
              }
            )}
          </div>

          {/* Feedback & Explanation */}
          {shouldShowFeedback && (
            <div className="mt-3" aria-live="polite">
              <div
                className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
                  isCorrectSelection
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                }`}
              >
                {isCorrectSelection ? "Correct!" : "Incorrect"}
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-sm text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-transparent">
                <p className="font-medium mb-1">Explanation</p>
                <p>{q.explanation}</p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleQuit}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm"
            >
              Quit Quiz
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={current === 0}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={selected === null && !canAdvanceWithoutSelect}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white dark:text-slate-900 font-semibold disabled:opacity-50 inline-flex items-center gap-2"
              >
                {nextLabel}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
