"use client";
import { Plus, Trash, Video, HelpCircle, GripVertical } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Button, cn, Accordion, AccordionItem } from "@heroui/react";
import { CInput, CTextarea } from "./heroui";
// import CProgress from the correct module if available
// import { CProgress } from "@heroui/react"; // Uncomment if CProgress is exported from @heroui/react
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

  // Add state for chunked upload progress
  const [videoUploadProgress, setVideoUploadProgress] = useState<{
    [key: string]: {
      percent: number;
      currentChunk: number;
      totalChunks: number;
      filename: string | null;
    };
  }>({});

  const CHUNK_SIZE = 512 * 1024; // 512KB

  // Chunked upload logic for sub-activity video
  const handleVideoUpload = async (
    activityIndex: number,
    subActivityIndex: number,
    file: File
  ) => {
    setUploadingVideo({ activityIndex, subActivityIndex });

    const ext = file.name.split(".").pop() || "mp4";
    const uuidName = `${Date.now()}-${Math.floor(
      Math.random() * 100000
    )}.${ext}`;
    const key = `${activityIndex}-${subActivityIndex}`;
    const chunkSize = CHUNK_SIZE;
    const total = Math.ceil(file.size / chunkSize);

    setVideoUploadProgress((prev) => ({
      ...prev,
      [key]: {
        percent: 0,
        currentChunk: 0,
        totalChunks: total,
        filename: uuidName,
      },
    }));

    try {
      for (let i = 0; i < total; i++) {
        const start = i * chunkSize;
        const end = Math.min(file.size, start + chunkSize);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("filename", uuidName);
        formData.append("chunkIndex", i.toString());
        formData.append("totalChunks", total.toString());

        await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        setVideoUploadProgress((prev) => ({
          ...prev,
          [key]: {
            percent: Math.round(((i + 1) / total) * 100),
            currentChunk: i + 1,
            totalChunks: total,
            filename: uuidName,
          },
        }));
      }

      updateSubActivityVideo(
        activityIndex,
        subActivityIndex,
        `/api/videos/${uuidName}`
      );
      alert(lang === "en" ? "Upload complete!" : "ስቀል ተጠናቋል!");
    } catch (error) {
      console.error("Upload error:", error);
      alert(lang === "en" ? "Upload error" : "የመስቀል ስህተት");
    } finally {
      setUploadingVideo(null);
      setVideoUploadProgress((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
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
                        <div>
                          <VideoUploadButton
                            lang={lang}
                            selectedVideo={null}
                            onVideoSelect={(file) =>
                              // Only allow upload if not already uploading for this sub-activity
                              !(
                                uploadingVideo?.activityIndex ===
                                  activityIndex &&
                                uploadingVideo?.subActivityIndex === subIndex
                              ) &&
                              handleVideoUpload(activityIndex, subIndex, file)
                            }
                            onVideoRemove={() => {}}
                            disabled={
                              uploadingVideo?.activityIndex === activityIndex &&
                              uploadingVideo?.subActivityIndex === subIndex
                            }
                          />
                          {/* Show chunked upload progress for this sub-activity */}
                          {uploadingVideo?.activityIndex === activityIndex &&
                            uploadingVideo?.subActivityIndex === subIndex &&
                            videoUploadProgress[
                              `${activityIndex}-${subIndex}`
                            ] && (
                              <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-primary font-medium">
                                    {lang === "en"
                                      ? "Uploading"
                                      : "ስቀል በሂደት ላይ"}
                                    :{" "}
                                    {
                                      videoUploadProgress[
                                        `${activityIndex}-${subIndex}`
                                      ].percent
                                    }
                                    %
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {
                                      videoUploadProgress[
                                        `${activityIndex}-${subIndex}`
                                      ].currentChunk
                                    }
                                    /
                                    {
                                      videoUploadProgress[
                                        `${activityIndex}-${subIndex}`
                                      ].totalChunks
                                    }{" "}
                                    {lang === "en" ? "chunks" : "ቀለቶች"}
                                  </span>
                                </div>
                                {/* Use a fallback if CProgress is not available */}
                                {/* <CProgress ... /> */}
                                <progress
                                  value={
                                    videoUploadProgress[
                                      `${activityIndex}-${subIndex}`
                                    ].percent
                                  }
                                  max={100}
                                  className="w-full h-2 rounded bg-gray-200"
                                />
                              </div>
                            )}
                        </div>
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
