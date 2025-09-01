"use client";
import { Plus, Trash, Video, HelpCircle, GripVertical } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Button, cn, Accordion, AccordionItem } from "@heroui/react";
import { CInput, CTextarea } from "./heroui";
import VideoUploadButton from "./VideoUploadButton";

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
  updateSubActivityVideo,
  addQuestion,
  removeQuestion,
  reorderActivities,
  reorderSubActivities,
  errorMessage,
}: {
  list: TActivity[];
  addActivity: (payload: TInput) => void;
  addSubActivity: (activityIndex: number, payload: TInput) => void;
  removeActivity: (index: number) => void;
  removeSubActivity: (activityIndex: number, subActivityIndex: number) => void;
  updateSubActivityVideo: (
    activityIndex: number,
    subActivityIndex: number,
    videoUrl: string
  ) => void;
  addQuestion: (activityIndex: number, question: TQuestion) => void;
  removeQuestion: (activityIndex: number, questionIndex: number) => void;
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
  const [uploadingVideo, setUploadingVideo] = useState<{
    activityIndex: number;
    subActivityIndex: number;
  } | null>(null);

  const handleVideoUpload = async (
    activityIndex: number,
    subActivityIndex: number,
    file: File
  ) => {
    setUploadingVideo({ activityIndex, subActivityIndex });

    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        updateSubActivityVideo(
          activityIndex,
          subActivityIndex,
          `/api/videos/${result.filename}`
        );
      } else {
        alert(lang === "en" ? "Upload failed" : "መስቀል አልተሳካም");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(lang === "en" ? "Upload error" : "የመስቀል ስህተት");
    } finally {
      setUploadingVideo(null);
    }
  };

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
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() => removeActivity(activityIndex)}
                >
                  <Trash className="size-4" />
                </Button>
              </div>
            }
            className="border border-primary-300 rounded-xl"
          >
            <div className="space-y-4 p-4">
              {/* Sub Activities */}
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
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() =>
                          removeSubActivity(activityIndex, subIndex)
                        }
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Video className="size-4" />
                        <span className="text-sm">
                          {lang === "en" ? "Video" : "ቪዲዮ"}
                        </span>
                      </div>

                      {sub.video ? (
                        <div className="flex items-center justify-between bg-success/10 p-2 rounded">
                          <span className="text-sm text-success">
                            {lang === "en" ? "Video uploaded" : "ቪዲዮ ተስቅሏል"}
                          </span>
                          <Button
                            size="sm"
                            variant="light"
                            onPress={() =>
                              updateSubActivityVideo(
                                activityIndex,
                                subIndex,
                                ""
                              )
                            }
                          >
                            <Trash className="size-4" />
                          </Button>
                        </div>
                      ) : (
                        <VideoUploadButton
                          lang={lang}
                          selectedVideo={null}
                          onVideoSelect={(file) =>
                            handleVideoUpload(activityIndex, subIndex, file)
                          }
                          onVideoRemove={() => {}}
                          disabled={
                            uploadingVideo?.activityIndex === activityIndex &&
                            uploadingVideo?.subActivityIndex === subIndex
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Questions */}
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
                        <p className="font-medium mb-2">{question.question}</p>
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
                      </div>
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() =>
                          removeQuestion(activityIndex, questionIndex)
                        }
                      >
                        <Trash className="size-4" />
                      </Button>
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
            // onPaste={(e) => {
            //   e.preventDefault(); // Prevent default paste behavior
            //   // const pastedText = e.clipboardData.getData("text");
            //   // const lines = pastedText
            //   //   .split(/\r?\n/)
            //   //   .filter((line) => line.trim() !== "");
            // }}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {lang === "en" ? "Options" : "አማራጮች"}
              </span>
              <Button size="sm" variant="light" onPress={addOption}>
                <Plus className="size-4" />
              </Button>
            </div>

            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Button
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
            <Button variant="light" onPress={() => setIsOpen(false)}>
              {lang === "en" ? "Cancel" : "ሰርዝ"}
            </Button>
            <Button color="primary" onPress={handleSubmit}>
              {lang === "en" ? "Add Question" : "ጥያቄ ጨምር"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
