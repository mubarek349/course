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
  User, 
  Reply,
  Trash2,
  Edit3,
  Plus
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { 
  submitVideoQuestion, 
  getVideoQuestions, 
  deleteVideoQuestion 
} from "@/actions/student/videoqa";
import { useSession } from "next-auth/react";

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

interface VideoQAProps {
  subActivityId: string;
  lang: string;
  currentTime?: number; // Current video timestamp
}

export default function VideoQA({ subActivityId, lang, currentTime }: VideoQAProps) {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [questions, setQuestions] = useState<VideoQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch questions on component mount
  useEffect(() => {
    loadQuestions();
  }, [subActivityId]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const result = await getVideoQuestions(subActivityId);
      if (result.success && result.data) {
        // Convert Date objects to strings for compatibility
        const questionsWithStringDates = result.data.map(q => ({
          ...q,
          createdAt: q.createdAt.toString(),
          responses: q.responses.map(r => ({
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
        subActivityId,
        newQuestion.trim(),
        currentTime ? Math.floor(currentTime) : undefined
      );
      
      if (result.success) {
        setNewQuestion("");
        onClose();
        await loadQuestions(); // Refresh questions
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
        await loadQuestions(); // Refresh questions
      } else {
        alert(lang === "en" ? "Failed to delete question" : "ጥያቄን መሰረዝ አልተሳካም");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      alert(lang === "en" ? "Error deleting question" : "ጥያቄን በመሰረዝ ላይ ስህተት");
    }
  };

  const formatTimestamp = (seconds?: number | null) => {
    if (!seconds) return null;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">
            {lang === "en" ? "Questions & Answers" : "ጥያቄዎች እና መልሶች"}
          </h3>
          <Chip size="sm" variant="flat" color="primary">
            {questions.length}
          </Chip>
        </div>
        
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={onOpen}
          size="sm"
        >
          {lang === "en" ? "Ask Question" : "ጥያቄ ጠይቅ"}
        </Button>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardBody className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <Card>
          <CardBody className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {lang === "en" 
                ? "No questions yet. Be the first to ask!" 
                : "ገና ምንም ጥያቄ የለም። የመጀመሪያው ጥያቄ ጠይቂ ይሁኑ!"}
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id} className="border-l-4 border-l-primary">
              <CardBody className="space-y-3">
                {/* Question Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      size="sm"
                      name={`${question.student.firstName} ${question.student.fatherName}`}
                      className="bg-primary text-white"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {question.student.firstName} {question.student.fatherName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                        </span>
                        {question.timestamp && (
                          <>
                            <span>•</span>
                            <span>{formatTimestamp(question.timestamp)}</span>
                          </>
                        )}
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
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Question Text */}
                <p className="text-gray-700 dark:text-gray-300 ml-11">
                  {question.question}
                </p>

                {/* Responses */}
                {question.responses.length > 0 && (
                  <div className="ml-11 space-y-3 border-l-2 border-gray-200 pl-4">
                    {question.responses.map((response) => (
                      <div key={response.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Avatar
                            size="sm"
                            name={`${response.instructor.firstName} ${response.instructor.fatherName}`}
                            className="bg-green-500 text-white"
                          />
                          <div>
                            <p className="font-medium text-sm flex items-center gap-2">
                              {response.instructor.firstName} {response.instructor.fatherName}
                              <Chip size="sm" color="success" variant="flat">
                                {lang === "en" ? "Instructor" : "አስተማሪ"}
                              </Chip>
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(response.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm ml-11">
                          {response.response}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* No response indicator */}
                {question.responses.length === 0 && (
                  <div className="ml-11 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Reply className="w-4 h-4" />
                      {lang === "en" ? "Waiting for instructor response..." : "የአስተማሪ ምላሽ በመጠባበቅ ላይ..."}
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
                {lang === "en" ? "Ask a Question" : "ጥያቄ ጠይቅ"}
                {currentTime && (
                  <p className="text-sm text-gray-500">
                    {lang === "en" ? "Question at" : "ጥያቄ በ"} {formatTimestamp(Math.floor(currentTime))}
                  </p>
                )}
              </ModalHeader>
              <ModalBody>
                <Textarea
                  value={newQuestion}
                  onValueChange={setNewQuestion}
                  placeholder={
                    lang === "en" 
                      ? "What would you like to ask about this video?"
                      : "ስለዚህ ቪዲዮ ምን መጠየቅ ይፈልጋሉ?"
                  }
                  minRows={3}
                  maxRows={6}
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