"use client";
import { useState } from "react";
import { Button, cn, Accordion, AccordionItem } from "@heroui/react";
import { CInput, CTextarea } from "./heroui";
import { Plus, Trash, Edit } from "lucide-react";
import { TQuestion } from "./ActivityManager";

interface FinalExamManagerProps {
  questions: TQuestion[];
  onAdd: (question: TQuestion) => void;
  onUpdate: (index: number, question: TQuestion) => void;
  onRemove: (index: number) => void;
  lang: string;
}

export default function FinalExamManager({
  questions,
  onAdd,
  onUpdate,
  onRemove,
  lang,
}: FinalExamManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {/* Add Question Form */}
      {!isAdding ? (
        <Button
          type="button"
          variant="bordered"
          onPress={() => setIsAdding(true)}
          className="w-full"
          startContent={<Plus className="size-4" />}
        >
          {lang === "en" ? "Add New Question" : "አዲስ ጥያቄ ጨምር"}
        </Button>
      ) : (
        <QuestionForm
          onSave={(question) => {
            onAdd(question);
            setIsAdding(false);
          }}
          onCancel={() => setIsAdding(false)}
          lang={lang}
        />
      )}

      {/* Questions List */}
      <Accordion variant="splitted" className="space-y-2">
        {questions.map((question, index) => (
          <AccordionItem
            key={index}
            title={
              <span className="text-sm font-medium truncate">
                {question.question.length > 60 
                  ? `${question.question.substring(0, 60)}...` 
                  : question.question
                }
              </span>
            }
            className="border border-red-300 rounded-lg"
          >
            <div className="p-3">
              <div className="flex justify-end gap-1 mb-3">
                <Button
                  type="button"
                  size="sm"
                  color="primary"
                  variant="light"
                  onPress={() => setEditingIndex(index)}
                >
                  <Edit className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() => {
                    const confirmMessage =
                      lang === "en"
                        ? "Remove this question from final exam?"
                        : "ይህን ጥያቄ ከመጨረሻ ፈተና ማስወገድ?";
                    if (confirm(confirmMessage)) {
                      onRemove(index);
                    }
                  }}
                >
                  <Trash className="size-4" />
                </Button>
              </div>
              {editingIndex === index ? (
                <QuestionForm
                  initialQuestion={question}
                  onSave={(updatedQuestion) => {
                    onUpdate(index, updatedQuestion);
                    setEditingIndex(null);
                  }}
                  onCancel={() => setEditingIndex(null)}
                  lang={lang}
                />
              ) : (
                <>
                  <p className="font-medium mb-3">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2 p-2 rounded bg-gray-50">
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full flex-shrink-0",
                            question.answers.includes(option)
                              ? "bg-success"
                              : "bg-gray-300"
                          )}
                        />
                        <span className="text-sm">{option}</span>
                      </div>
                    ))}
                  </div>
                  {question.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                      <span className="font-medium">
                        {lang === "en" ? "Explanation: " : "ማብራሪያ: "}
                      </span>
                      {question.explanation}
                    </div>
                  )}
                </>
              )}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function QuestionForm({
  initialQuestion,
  onSave,
  onCancel,
  lang,
}: {
  initialQuestion?: TQuestion;
  onSave: (question: TQuestion) => void;
  onCancel: () => void;
  lang: string;
}) {
  const [question, setQuestion] = useState(initialQuestion?.question || "");
  const [options, setOptions] = useState(initialQuestion?.options || ["", ""]);
  const [answers, setAnswers] = useState<string[]>(initialQuestion?.answers || []);
  const [explanation, setExplanation] = useState(initialQuestion?.explanation || "");

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
      setAnswers(answers.map((answer) => (answer === oldValue ? value : answer)));
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
      const [questionText, ...remainingLines] = lines;

      let explanationText = "";
      let optionLines = remainingLines;
      
      const explanationIndex = remainingLines.findIndex(line => 
        /ማብራሪያ/i.test(line) || /explanation/i.test(line)
      );
      
      if (explanationIndex !== -1) {
        const explanationLine = remainingLines[explanationIndex];
        explanationText = explanationLine
          .replace(/^.*?(ማብራሪያ|explanation)\s*[:：]?\s*/i, "")
          .trim();
        
        if (!explanationText && explanationIndex + 1 < remainingLines.length) {
          explanationText = remainingLines.slice(explanationIndex + 1).join(" ").trim();
        }
        
        optionLines = remainingLines.slice(0, explanationIndex);
      }

      const newOptions: string[] = [];
      const newAnswers: string[] = [];

      optionLines.forEach((line) => {
        // Check if line contains answer with colon pattern
        const answerMatch = line.match(/(መልስ\s*[:：]\s*)(.+)/);
        
        if (answerMatch) {
          // Extract answer from "መልስ: answer" pattern
          const answerText = answerMatch[2]
            .replace(/^[0-9A-Za-z\u1200-\u137F][.)\s]+/, "")
            .trim();
          if (answerText && !newAnswers.includes(answerText)) {
            newAnswers.push(answerText);
          }
        } else {
          // Regular option line
          const isCorrect = /^\*|correct|answer|✓|ትክክል/i.test(line);
          
          const optionText = line
            .replace(/^\*/, "")
            .replace(/\s*(correct|✓|ትክክል|answer)\s*/gi, "")
            .replace(/^[0-9A-Za-z][.)\s]+/, "")
            .replace(/^[ሀለሐመሠረሰሸቀበተቸኀነኘአከወዘየደገጠጨጰጸፀፈፐ][.)\s]+/, "")
            .trim();

          if (optionText && !newOptions.includes(optionText)) {
            newOptions.push(optionText);
            if (isCorrect) {
              newAnswers.push(optionText);
            }
          }
        }
      });

      setQuestion(questionText);
      setOptions(newOptions.length >= 2 ? newOptions : ["", ""]);
      setAnswers(newAnswers);
      setExplanation(explanationText);
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
        explanation: explanation || undefined,
      });
    }
  };

  return (
    <div className="border border-primary-300 rounded-lg p-4 space-y-3 bg-primary-50/50">
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

      <CTextarea
        label={lang === "en" ? "Explanation (Optional)" : "ማብራሪያ (አማራጭ)"}
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        placeholder={
          lang === "en"
            ? "Optional explanation for the answer"
            : "ለመልሱ አማራጭ ማብራሪያ"
        }
      />

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