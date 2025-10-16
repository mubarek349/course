"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Textarea,
  Avatar,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { 
  MessageCircle, 
  Send, 
  Clock, 
  Reply,
  Trash2,
  Plus
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { 
  submitVideoQuestion, 
  getVideoQuestions, 
  deleteVideoQuestion 
} from "@/actions/student/videoqa";
import { useSession } from "next-auth/react";

// Define the database model types (what Prisma returns)
interface VideoQuestionDB {
  id: string;
  question: string;
  timestamp?: number | null;
  createdAt: Date;
  student: {
    firstName: string;
    fatherName: string;
    lastName: string;
  };
  responses: {
    id: string;
    response: string;
    createdAt: Date;
    instructor: {
      firstName: string;
      fatherName: string;
      lastName: string;
    };
  }[];
}

// Define the display types (what we use in our component)
interface VideoQuestion {
  id: string;
  question: string;
  timestamp?: number | null;
  createdAt: string;
  student: {
    firstName: string;
    fatherName: string;
    lastName: string;
  };
  responses: {
    id: string;
    response: string;
    createdAt: string;
    instructor: {
      firstName: string;
      fatherName: string;
      lastName: string;
    };
  }[];
}

interface TraditionalQAProps {
  courseId: string;
  lang: string;
}

export default function TraditionalQA({ courseId, lang }: TraditionalQAProps) {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [questions, setQuestions] = useState<VideoQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [courseId]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const result = await getVideoQuestions(courseId);
      if (result.success && result.data) {
        const questionsWithStringDates = result.data.map((q: VideoQuestionDB) => ({
          ...q,
          createdAt: q.createdAt.toString(),
          responses: q.responses.map((r) => ({
            ...r,
            createdAt: r.createdAt.toString()
          }))
        }));
        setQuestions(questionsWithStringDates);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) return;

    setSubmitting(true);
    try {
      const result = await submitVideoQuestion(
        courseId,
        newQuestion.trim()
      );
      
      if (result.success) {
        setNewQuestion("");
        onClose();
        await loadQuestions();
      } else {
        alert(lang === "en" ? "Failed to submit question" : "ጥያቄን ማስገባት አልተሳካም");
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      alert(lang === "en" ? "Error submitting question" : "ጥያቄን በማስገባት ላይ ስህተት");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const confirmMessage = lang === "en" 
      ? "Are you sure you want to delete this question?" 
      : "ይህን ጥያቄ መሰረዝ እርግጠኛ ነዎት?";
      
    if (!confirm(confirmMessage)) return;

    try {
      const result = await deleteVideoQuestion(questionId);
      if (result.success) {
        await loadQuestions();
      } else {
        alert(lang === "en" ? "Failed to delete question" : "ጥያቄን መሰረዝ አልተሳካም");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      alert(lang === "en" ? "Error deleting question" : "ጥያቄን በመሰረዝ ላይ ስህተት");
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
          <h3 className="text-sm sm:text-base md:text-lg font-semibold truncate">
            {lang === "en" ? "Questions & Answers" : "ጥያቄዎች እና መልሶች"}
          </h3>
          <Chip size="sm" variant="flat" color="primary" className="flex-shrink-0 text-xs">
            {questions.length}
          </Chip>
        </div>
        
        <Button
          color="primary"
          startContent={<Plus className="w-3 h-3 sm:w-4 sm:h-4" />}
          onPress={onOpen}
          size="sm"
          className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
        >
          <span className="hidden sm:inline">{lang === "en" ? "Ask Question" : "ጥያቄ ጠይቅ"}</span>
          <span className="sm:hidden">+</span>
        </Button>
      </div>

      {/* Questions List - Modified for better mobile display */}
      {loading ? (
        <div className="space-y-2 sm:space-y-3 flex-1 overflow-y-auto min-h-[200px]">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardBody className="space-y-2 sm:space-y-3 p-3 sm:p-4">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <Card className="flex-1 flex items-center justify-center min-h-[200px]">
          <CardBody className="text-center py-6 sm:py-8 px-4">
            <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
            <p className="text-gray-500 text-sm sm:text-base">
              {lang === "en" 
                ? "No questions yet. Be the first to ask!" 
                : "ገና ምንም ጥያቄ የለም። የመጀመሪያው ጥያቄ ጠይቂ ይሁኑ!"}
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto min-h-0">
          {questions.map((question) => (
            <Card key={question.id} className="border-l-2 sm:border-l-4 border-l-primary">
              <CardBody className="space-y-2 sm:space-y-3 p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <Avatar
                      size="sm"
                      name={`${question.student.firstName} ${question.student.fatherName}`}
                      className="bg-primary text-white flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs sm:text-sm truncate">
                        {question.student.firstName} {question.student.fatherName}
                      </p>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {session?.user?.id === question.student.firstName && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleDeleteQuestion(question.id)}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base ml-8 sm:ml-11 leading-relaxed break-words overflow-wrap-anywhere">
                  {question.question}
                </p>

                {question.responses.length > 0 && (
                  <div className="ml-8 sm:ml-11 space-y-2 sm:space-y-3 border-l-2 border-gray-200 pl-3 sm:pl-4">
                    {question.responses.map((response) => (
                      <div key={response.id} className="space-y-1 sm:space-y-2">
                        <div className="flex items-center gap-2">
                          <Avatar
                            size="sm"
                            name={`${response.instructor.firstName} ${response.instructor.fatherName}`}
                            className="bg-green-500 text-white flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                              <span className="truncate">{response.instructor.firstName} {response.instructor.fatherName}</span>
                              <Chip size="sm" color="success" variant="flat" className="text-xs flex-shrink-0">
                                {lang === "en" ? "Instructor" : "አስተማሪ"}
                              </Chip>
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(response.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm ml-8 sm:ml-11 leading-relaxed break-words overflow-wrap-anywhere">
                          {response.response}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {question.responses.length === 0 && (
                  <div className="ml-8 sm:ml-11 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                      <Reply className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{lang === "en" ? "Waiting for instructor response..." : "የአስተማሪ ምላሽ በመጠባበቅ ላይ..."}</span>
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Add Question Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  {lang === "en" ? "Ask a Question" : "ጥያቄ ጠይቅ"}
                </div>
              </ModalHeader>
              <ModalBody>
                <Textarea
                  value={newQuestion}
                  onValueChange={setNewQuestion}
                  placeholder={
                    lang === "en" 
                      ? "What would you like to ask about this course?"
                      : "ስለዚህ ኮርስ ምን መጠየቅ ይፈልጋሉ?"
                  }
                  minRows={3}
                  maxRows={6}
                  classNames={{
                    input: "break-words overflow-wrap-anywhere",
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {lang === "en" ? "Cancel" : "ተወው"}
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmitQuestion}
                  isDisabled={!newQuestion.trim() || submitting}
                  isLoading={submitting}
                  startContent={!submitting && <Send className="w-4 h-4" />}
                >
                  {submitting 
                    ? (lang === "en" ? "Submitting..." : "በመላክ ላይ...")
                    : (lang === "en" ? "Submit Question" : "ጥያቄ ላክ")
                  }
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}