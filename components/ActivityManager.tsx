"use client";
import {
  Plus,
  Trash,
  Video,
  HelpCircle,
  GripVertical,
  Edit,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Button, cn, Accordion, AccordionItem } from "@heroui/react";
import { CInput, CTextarea } from "./heroui";
import SubActivityVideoUpload from "./SubActivityVideoUpload";

type TInput = {
  am: string;
  en: string;
};

type TSubActivity = {
  titleEn: string;
  titleAm: string;
  video?: string;
};

type TQuestion = {
  question: string;
  options: string[];
  answers: string[];
};

type TActivity = {
  titleEn: string;
  titleAm: string;
  subActivity: TSubActivity[];
  questions?: TQuestion[];
};

export default function ActivityManager({
  list,
  addActivity,
  addSubActivity,
  removeActivity,
  removeSubActivity,
  updateActivity,
  updateSubActivity,
  updateSubActivityVideo,
  addQuestion,
  removeQuestion,
  updateQuestion,
  reorderActivities,
  reorderSubActivities,
  errorMessage,
}: {
  list: TActivity[];
  addActivity: (payload: TInput) => void;
  addSubActivity: (activityIndex: number, payload: TInput) => void;
  removeActivity: (index: number) => void;
  removeSubActivity: (activityIndex: number, subActivityIndex: number) => void;
  updateActivity?: (activityIndex: number, payload: TInput) => void;
  updateSubActivity?: (
    activityIndex: number,
    subActivityIndex: number,
    payload: TInput
  ) => void;
  updateSubActivityVideo: (
    activityIndex: number,
    subActivityIndex: number,
    videoUrl: string
  ) => void;
  addQuestion: (activityIndex: number, question: TQuestion) => void;
  removeQuestion: (activityIndex: number, questionIndex: number) => void;
  updateQuestion?: (
    activityIndex: number,
    questionIndex: number,
    question: TQuestion
  ) => void;
  reorderActivities: (fromIndex: number, toIndex: number) => void;
  reorderSubActivities: (
    activityIndex: number,
    fromIndex: number,
    toIndex: number
  ) => void;
  errorMessage: string;
}) {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  const [editingActivity, setEditingActivity] = useState<number | null>(null);
  const [editingSubActivity, setEditingSubActivity] = useState<{
    activityIndex: number;
    subActivityIndex: number;
  } | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<{
    activityIndex: number;
    questionIndex: number;
  } | null>(null);

  return (
    <div
      className={cn(
        "space-y-4",
        errorMessage ? "border border-danger-300 p-4 rounded-lg" : ""
      )}
    >
      <Add
        add={addActivity}
        label={lang === "en" ? "Activity" : "እንቅስቃሴ"}
        placeHolderEn={
          lang === "en" ? "Activity title in English" : "እንቅስቃሴ በእንግሊዝኛ"
        }
        placeHolderAm={
          lang === "en" ? "Activity title in Amharic" : "እንቅስቃሴ በአማርኛ"
        }
      />

      <Accordion variant="splitted" className="space-y-2">
        {list.map((activity, activityIndex) => (
          <AccordionItem
            key={activityIndex}
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="light"
                    isIconOnly
                    className="cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        "text/plain",
                        activityIndex.toString()
                      );
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const fromIndex = parseInt(
                        e.dataTransfer.getData("text/plain")
                      );
                      if (fromIndex !== activityIndex) {
                        reorderActivities(fromIndex, activityIndex);
                      }
                    }}
                  >
                    <GripVertical className="size-4" />
                  </Button>
                  <span>
                    {lang === "en" ? activity.titleEn : activity.titleAm}
                  </span>
                </div>
                <div className="flex gap-1">
                  {updateActivity && (
                    <Button
                      type="button"
                      size="sm"
                      color="primary"
                      variant="light"
                      onPress={() => setEditingActivity(activityIndex)}
                    >
                      <Edit className="size-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    color="danger"
                    variant="light"
                    onPress={() => {
                      const confirmMessage =
                        lang === "en"
                          ? "Are you sure you want to delete this activity?"
                          : "ይህን እንቅስቃሴ መሰረዝ እርግጠኛ ነዎት?";
                      if (confirm(confirmMessage)) {
                        removeActivity(activityIndex);
                      }
                    }}
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              </div>
            }
            className="border border-primary-300 rounded-xl"
          >
            <div className="space-y-4 p-4">
              {editingActivity === activityIndex && updateActivity && (
                <EditForm
                  initialValues={{ en: activity.titleEn, am: activity.titleAm }}
                  onSave={(values) => {
                    updateActivity(activityIndex, values);
                    setEditingActivity(null);
                  }}
                  onCancel={() => setEditingActivity(null)}
                  lang={lang}
                  label={lang === "en" ? "Edit Activity" : "እንቅስቃሴ አርም"}
                  placeHolderEn={
                    lang === "en"
                      ? "Activity title in English"
                      : "እንቅስቃሴ በእንግሊዝኛ"
                  }
                  placeHolderAm={
                    lang === "en" ? "Activity title in Amharic" : "እንቅስቃሴ በአማርኛ"
                  }
                />
              )}

              <div className="space-y-2">
                <h4 className="font-medium">
                  {lang === "en" ? "Sub Activities" : "ንዑስ እንቅስቃሴዎች"}
                </h4>
                <Add
                  add={(input) => addSubActivity(activityIndex, input)}
                  label={lang === "en" ? "Sub Activity" : "ንዑስ እንቅስቃሴ"}
                  placeHolderEn={
                    lang === "en"
                      ? "Sub activity in English"
                      : "ንዑስ እንቅስቃሴ በእንግሊዝኛ"
                  }
                  placeHolderAm={
                    lang === "en"
                      ? "Sub activity in Amharic"
                      : "ንዑስ እንቅስቃሴ በአማርኛ"
                  }
                />

                {activity.subActivity.map((sub, subIndex) => (
                  <div
                    key={subIndex}
                    className="bg-primary/10 rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="light"
                          isIconOnly
                          className="cursor-grab active:cursor-grabbing"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              "text/plain",
                              `${activityIndex}-${subIndex}`
                            );
                            e.dataTransfer.effectAllowed = "move";
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const [fromActivityIndex, fromSubIndex] =
                              e.dataTransfer
                                .getData("text/plain")
                                .split("-")
                                .map(Number);
                            if (
                              fromActivityIndex === activityIndex &&
                              fromSubIndex !== subIndex
                            ) {
                              reorderSubActivities(
                                activityIndex,
                                fromSubIndex,
                                subIndex
                              );
                            }
                          }}
                        >
                          <GripVertical className="size-3" />
                        </Button>
                        <span className="font-medium">
                          {lang === "en" ? sub.titleEn : sub.titleAm}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {updateSubActivity && (
                          <Button
                            type="button"
                            size="sm"
                            color="primary"
                            variant="light"
                            onPress={() =>
                              setEditingSubActivity({
                                activityIndex,
                                subActivityIndex: subIndex,
                              })
                            }
                          >
                            <Edit className="size-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={() => {
                            const confirmMessage =
                              lang === "en"
                                ? "Are you sure you want to delete this sub-activity?"
                                : "ይህን ንዑስ እንቅስቃሴ መሰረዝ እርግጠኛ ነዎት?";
                            if (confirm(confirmMessage)) {
                              removeSubActivity(activityIndex, subIndex);
                            }
                          }}
                        >
                          <Trash className="size-4" />
                        </Button>
                      </div>
                    </div>

                    {editingSubActivity?.activityIndex === activityIndex &&
                      editingSubActivity?.subActivityIndex === subIndex &&
                      updateSubActivity && (
                        <EditForm
                          initialValues={{ en: sub.titleEn, am: sub.titleAm }}
                          onSave={(values) => {
                            updateSubActivity(activityIndex, subIndex, values);
                            setEditingSubActivity(null);
                          }}
                          onCancel={() => setEditingSubActivity(null)}
                          lang={lang}
                          label={
                            lang === "en"
                              ? "Edit Sub-Activity"
                              : "ንዑስ እንቅስቃሴ አርም"
                          }
                          placeHolderEn={
                            lang === "en"
                              ? "Sub-activity title in English"
                              : "ንዑስ እንቅስቃሴ በእንግሊዝኛ"
                          }
                          placeHolderAm={
                            lang === "en"
                              ? "Sub-activity title in Amharic"
                              : "ንዑስ እንቅስቃሴ በአማርኛ"
                          }
                        />
                      )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Video className="size-4" />
                        <span className="text-sm">
                          {lang === "en" ? "Video" : "ቪዲዮ"}
                        </span>
                      </div>

                      <SubActivityVideoUpload
                        lang={lang}
                        hasVideo={!!sub.video}
                        onVideoSelect={(filename) => {
                          updateSubActivityVideo(
                            activityIndex,
                            subIndex,
                            filename
                          );
                        }}
                        onVideoRemove={() => {
                          updateSubActivityVideo(activityIndex, subIndex, "");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <HelpCircle className="size-4" />
                  {lang === "en" ? "Questions" : "ጥያቄዎች"}
                </h4>

                <QuestionForm
                  onAdd={(question) => addQuestion(activityIndex, question)}
                  lang={lang}
                />

                {(activity.questions || []).map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="bg-warning/10 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {editingQuestion?.activityIndex === activityIndex &&
                        editingQuestion?.questionIndex === questionIndex &&
                        updateQuestion ? (
                          <QuestionEditForm
                            initialQuestion={question}
                            onSave={(updatedQuestion) => {
                              updateQuestion(
                                activityIndex,
                                questionIndex,
                                updatedQuestion
                              );
                              setEditingQuestion(null);
                            }}
                            onCancel={() => setEditingQuestion(null)}
                            lang={lang}
                          />
                        ) : (
                          <>
                            <p className="font-medium mb-2">
                              {question.question}
                            </p>
                            <div className="space-y-1">
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className={cn(
                                      "w-2 h-2 rounded-full",
                                      question.answers.includes(option)
                                        ? "bg-success"
                                        : "bg-gray-300"
                                    )}
                                  />
                                  <span className="text-sm">{option}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {updateQuestion && (
                          <Button
                            type="button"
                            size="sm"
                            color="primary"
                            variant="light"
                            onPress={() =>
                              setEditingQuestion({
                                activityIndex,
                                questionIndex,
                              })
                            }
                          >
                            <Edit className="size-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={() => {
                            const confirmMessage =
                              lang === "en"
                                ? "Are you sure you want to delete this question?"
                                : "ይህን ጥያቄ መሰረዝ እርግጠኛ ነዎት?";
                            if (confirm(confirmMessage)) {
                              removeQuestion(activityIndex, questionIndex);
                            }
                          }}
                        >
                          <Trash className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function Add({
  add,
  label,
  placeHolderEn,
  placeHolderAm,
}: {
  add: (payload: TInput) => void;
  label?: string;
  placeHolderAm?: string;
  placeHolderEn?: string;
}) {
  const [input, setInput] = useState<TInput>({ am: "", en: "" });

  return (
    <div className="space-y-2">
      <p className="font-medium">{label}</p>
      <div className="grid md:grid-cols-[1fr_1fr_auto] gap-2">
        <CInput
          placeholder={placeHolderAm}
          value={input.am}
          onChange={({ target }) =>
            setInput((prev) => ({ ...prev, am: target.value }))
          }
        />
        <CInput
          placeholder={placeHolderEn}
          value={input.en}
          onChange={({ target }) =>
            setInput((prev) => ({ ...prev, en: target.value }))
          }
        />
        <Button
          type="button"
          onPress={() => {
            if (input.am && input.en) {
              add(input);
              setInput({ am: "", en: "" });
            }
          }}
          color="success"
          isDisabled={!input.am || !input.en}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function QuestionForm({
  onAdd,
  lang,
}: {
  onAdd: (question: TQuestion) => void;
  lang: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [answers, setAnswers] = useState<string[]>([]);

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index: number) =>
    setOptions(options.filter((_, i) => i !== index));
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const toggleAnswer = (option: string) => {
    setAnswers((prev) =>
      prev.includes(option)
        ? prev.filter((a) => a !== option)
        : [...prev, option]
    );
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData("text");
    const lines = pastedText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    if (lines.length >= 3) {
      e.preventDefault();
      const [questionText, ...optionLines] = lines;

      // Find answer indicators (*, correct, ✓, or በአማርኛ "ትክክል")
      const newOptions: string[] = [];
      const newAnswers: string[] = [];

      optionLines.forEach((line) => {
        let optionText = line;
        let isCorrect = false;

        // Check for answer indicators
        if (
          line.startsWith("*") ||
          line.toLowerCase().includes("correct") ||
          line.toLowerCase().includes("መልስ") ||
          line.toLowerCase().includes("Answer") ||
          line.includes("✓") ||
          line.includes("ትክክል")
        ) {
          isCorrect = true;
          optionText = line
            .replace(/^\*/, "")
            .replace(/\s*(correct|✓|ትክክል|Answer|መልስ)\s*/gi, "")
            .trim();
        }

        // Remove option numbering (1., 2., A., B., etc.)
        optionText = optionText.replace(/^[0-9A-Za-z][.)\s]+/, "").trim();

        if (optionText) {
          newOptions.push(optionText);
          if (isCorrect) {
            newAnswers.push(optionText);
          }
        }
      });

      setQuestion(questionText);
      setOptions(newOptions.length >= 2 ? newOptions : ["", ""]);
      setAnswers(newAnswers);
    }
  };

  const handleSubmit = () => {
    if (
      question &&
      options.filter((o) => o).length >= 2 &&
      answers.length > 0
    ) {
      onAdd({
        question,
        options: options.filter((o) => o),
        answers,
      });
      setQuestion("");
      setOptions(["", ""]);
      setAnswers([]);
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      {!isOpen ? (
        <Button
          type="button"
          variant="bordered"
          onPress={() => setIsOpen(true)}
          className="w-full"
        >
          <Plus className="size-4" />
          {lang === "en" ? "Add Question" : "ጥያቄ ጨምር"}
        </Button>
      ) : (
        <div className="border border-primary-300 rounded-lg p-4 space-y-3">
          <CTextarea
            label={lang === "en" ? "Question" : "ጥያቄ"}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onPaste={handlePaste}
            placeholder={
              lang === "en"
                ? "Paste multi-line text to auto-fill question and options. Mark correct answers with * or 'correct' or 'ትክክል'"
                : "ጥያቄና አማራጮችን በራስ-ሰር ለመሙላት ብዙ-መስመር ጽሁፍ ይለጥፉ። ትክክለኛ መልሶችን በ * ወይም 'correct' ወይም 'ትክክል' ያመልክቱ"
            }
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {lang === "en" ? "Options" : "አማራጮች"}
              </span>
              <Button
                type="button"
                size="sm"
                variant="light"
                onPress={addOption}
              >
                <Plus className="size-4" />
              </Button>
            </div>

            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={
                    answers.includes(option) && option ? "solid" : "bordered"
                  }
                  color={
                    answers.includes(option) && option ? "success" : "default"
                  }
                  onPress={() => option && toggleAnswer(option)}
                  className="shrink-0"
                >
                  {answers.includes(option) && option ? "✓" : index + 1}
                </Button>
                <CInput
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`${lang === "en" ? "Option" : "አማራጭ"} ${
                    index + 1
                  }`}
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    size="sm"
                    color="danger"
                    variant="light"
                    onPress={() => removeOption(index)}
                  >
                    <Trash className="size-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="light"
              onPress={() => setIsOpen(false)}
            >
              {lang === "en" ? "Cancel" : "ሰርዝ"}
            </Button>
            <Button type="button" color="primary" onPress={handleSubmit}>
              {lang === "en" ? "Add Question" : "ጥያቄ ጨምር"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function EditForm({
  initialValues,
  onSave,
  onCancel,
  lang,
  label,
  placeHolderEn,
  placeHolderAm,
}: {
  initialValues: TInput;
  onSave: (values: TInput) => void;
  onCancel: () => void;
  lang: string;
  label: string;
  placeHolderEn: string;
  placeHolderAm: string;
}) {
  const [values, setValues] = useState<TInput>(initialValues);

  return (
    <div className="border border-blue-300 rounded-lg p-4 space-y-3 bg-blue-50">
      <h5 className="font-medium">{label}</h5>
      <div className="grid md:grid-cols-2 gap-2">
        <CInput
          placeholder={placeHolderAm}
          value={values.am}
          onChange={({ target }) =>
            setValues((prev) => ({ ...prev, am: target.value }))
          }
        />
        <CInput
          placeholder={placeHolderEn}
          value={values.en}
          onChange={({ target }) =>
            setValues((prev) => ({ ...prev, en: target.value }))
          }
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="light" onPress={onCancel}>
          {lang === "en" ? "Cancel" : "ሰርዝ"}
        </Button>
        <Button
          type="button"
          color="primary"
          onPress={() => onSave(values)}
          isDisabled={!values.am || !values.en}
        >
          {lang === "en" ? "Save" : "አስቀምጥ"}
        </Button>
      </div>
    </div>
  );
}

function QuestionEditForm({
  initialQuestion,
  onSave,
  onCancel,
  lang,
}: {
  initialQuestion: TQuestion;
  onSave: (question: TQuestion) => void;
  onCancel: () => void;
  lang: string;
}) {
  const [question, setQuestion] = useState(initialQuestion.question);
  const [options, setOptions] = useState([...initialQuestion.options]);
  const [answers, setAnswers] = useState([...initialQuestion.answers]);

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    setAnswers(answers.filter((answer) => newOptions.includes(answer)));
  };
  const updateOption = (index: number, value: string) => {
    const oldValue = options[index];
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);

    if (answers.includes(oldValue)) {
      setAnswers(
        answers.map((answer) => (answer === oldValue ? value : answer))
      );
    }
  };

  const toggleAnswer = (option: string) => {
    setAnswers((prev) =>
      prev.includes(option)
        ? prev.filter((a) => a !== option)
        : [...prev, option]
    );
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData("text");
    const lines = pastedText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    if (lines.length >= 3) {
      e.preventDefault();
      const [questionText, ...optionLines] = lines;

      // Find answer indicators (*, correct, ✓, or በአማርኛ "ትክክል")
      const newOptions: string[] = [];
      const newAnswers: string[] = [];

      optionLines.forEach((line) => {
        let optionText = line;
        let isCorrect = false;

        // Check for answer indicators
        if (
          line.startsWith("*") ||
          line.toLowerCase().includes("correct") ||
          line.toLowerCase().includes("መልስ") ||
          line.toLowerCase().includes("Answer") ||
          line.includes("✓") ||
          line.includes("ትክክል")
        ) {
          isCorrect = true;
          optionText = line
            .replace(/^\*/, "")
            .replace(/\s*(correct|✓|ትክክል|Answer|መልስ)\s*/gi, "")
            .trim();
        }

        // Remove option numbering (1., 2., A., B., etc.)
        optionText = optionText.replace(/^[0-9A-Za-z][.)\s]+/, "").trim();

        if (optionText) {
          newOptions.push(optionText);
          if (isCorrect) {
            newAnswers.push(optionText);
          }
        }
      });

      setQuestion(questionText);
      setOptions(newOptions.length >= 2 ? newOptions : ["", ""]);
      setAnswers(newAnswers);
    }
  };

  const handleSave = () => {
    if (
      question &&
      options.filter((o) => o).length >= 2 &&
      answers.length > 0
    ) {
      onSave({
        question,
        options: options.filter((o) => o),
        answers,
      });
    }
  };

  return (
    <div className="border border-blue-300 rounded-lg p-4 space-y-3 bg-blue-50">
      <CTextarea
        label={lang === "en" ? "Question" : "ጥያቄ"}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onPaste={handlePaste}
        placeholder={
          lang === "en"
            ? "Paste multi-line text to auto-fill question and options. Mark correct answers with * or 'correct' or 'ትክክል'"
            : "ጥያቄና አማራጮችን በራስ-ሰር ለመሙላት ብዙ-መስመር ጽሁፍ ይለጥፉ። ትክክለኛ መልሶችን በ * ወይም 'correct' ወይም 'ትክክል' ያመልክቱ"
        }
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">
            {lang === "en" ? "Options" : "አማራጮች"}
          </span>
          <Button type="button" size="sm" variant="light" onPress={addOption}>
            <Plus className="size-4" />
          </Button>
        </div>

        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={
                answers.includes(option) && option ? "solid" : "bordered"
              }
              color={answers.includes(option) && option ? "success" : "default"}
              onPress={() => option && toggleAnswer(option)}
              className="shrink-0"
            >
              {answers.includes(option) && option ? "✓" : index + 1}
            </Button>
            <CInput
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`${lang === "en" ? "Option" : "አማራጭ"} ${index + 1}`}
            />
            {options.length > 2 && (
              <Button
                type="button"
                size="sm"
                color="danger"
                variant="light"
                onPress={() => removeOption(index)}
              >
                <Trash className="size-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="light" onPress={onCancel}>
          {lang === "en" ? "Cancel" : "ሰርዝ"}
        </Button>
        <Button type="button" color="primary" onPress={handleSave}>
          {lang === "en" ? "Save" : "አስቀምጥ"}
        </Button>
      </div>
    </div>
  );
}
