"use client";

import { useState } from "react";
import { Upload, Trash2, Brain, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { removeAiPdfData } from "@/actions/manager/ai-pdf-data-chunked";
import { uploadFile } from "@/lib/actions";

interface AiPdfUploaderProps {
  courseId: string;
  currentAiPdfData: string | null;
  aiProvider: string | null;
  onUploadSuccess?: (filename: string) => void;
  onRemoveSuccess?: () => void;
}

export function AiPdfUploader({ courseId, currentAiPdfData, aiProvider, onUploadSuccess, onRemoveSuccess }: AiPdfUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const router = useRouter();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit for optimal AI processing
      toast.error('File size must be less than 100MB for optimal AI processing');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus("Preparing upload...");

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('aiProvider', aiProvider || 'gemini');
      formData.append('courseId', courseId);
      
      setUploadStatus("Converting to base64...");
      setUploadProgress(30);
      
      // Upload using lib/actions.ts
      const result = await uploadFile(formData);
      
      setUploadProgress(80);
      setUploadStatus("Storing in database...");
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }
      
      setUploadProgress(100);
      setUploadStatus("Upload complete!");
      toast.success(result.message || 'AI PDF Data uploaded successfully!');
      
      // Call success callback to update parent state
      if (onUploadSuccess && result.fileName) {
        onUploadSuccess(result.fileName);
      }
      
      // Refresh to show the new file
      router.refresh();
      setIsUploading(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload AI PDF Data');
      setIsUploading(false);
    } finally {
      event.target.value = '';
      // Clear progress after 3 seconds
      setTimeout(() => {
        setUploadProgress(0);
        setUploadStatus("");
      }, 3000);
    }
  };

  const handleRemoveClick = () => {
    if (!currentAiPdfData) return;
    setDeleteModalOpen(true);
  };

  const handleRemoveConfirm = async () => {
    setIsRemoving(true);

    try {
        const response = await removeAiPdfData(courseId);

      if (!response.success) {
        const errorData = await response.message;
        throw new Error(errorData || 'Failed to remove AI PDF');
      }

      const result = response.message;
      toast.success(result || 'AI PDF Data removed successfully!');
      
      // Call success callback to update parent state
      if (onRemoveSuccess) {
        onRemoveSuccess();
      }
      
      router.refresh();
    } catch (error) {
      console.error('Remove error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to remove AI PDF Data');
    } finally {
      setIsRemoving(false);
      setDeleteModalOpen(false);
    }
  };

  const handleRemoveCancel = () => {
    setDeleteModalOpen(false);
  };

  return (
    <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-blue-50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-purple-100 p-2">
            <Brain className="h-5 w-5 text-purple-600" />
          </div>
          <div>
                  <h2 className="text-lg text-slate-800">AI PDF Data</h2>
            <p className="text-sm text-slate-600">Upload PDF for AI-powered course assistance</p>
          </div>
          </div>
        </CardHeader>
      <CardBody className="space-y-4">
        {/* Current AI PDF Status */}
        {currentAiPdfData ? (
          <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-800">AI PDF Data Active</p>
                <p className="text-xs text-slate-600">{currentAiPdfData}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-md border border-green-200">
                Ready
              </span>
              <Button
                size="sm"
                variant="bordered"
                color="danger"
                onPress={handleRemoveClick}
                isDisabled={isRemoving}
                startContent={<Trash2 className="h-3 w-3" />}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          /* Upload Section */
          <div className="space-y-4">
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors bg-white/50">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id={`ai-pdf-upload-${courseId}`}
              />
              <label
                htmlFor={`ai-pdf-upload-${courseId}`}
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="rounded-full bg-purple-100 p-4">
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                  ) : (
                    <Upload className="h-8 w-8 text-purple-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {isUploading ? 'Processing AI PDF Data...' : 'Upload AI PDF Data'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PDF files only • Max 100MB • Using {aiProvider === 'openai' ? 'OpenAI' : 'Gemini'} AI
                  </p>
                </div>
              </label>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="bg-white/70 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-800">
                    {uploadStatus}
                  </span>
                  <span className="text-sm text-slate-600">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
                <Progress 
                  value={uploadProgress} 
                  className="h-2"
                />
              </div>
            )}
          </div>
        )}

      </CardBody>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deleteModalOpen} 
        onOpenChange={setDeleteModalOpen}
        size="md"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Remove AI PDF Data
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-700">
                  Are you sure you want to remove the AI PDF Data? 
                  This action cannot be undone and will disable AI-powered course assistance.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={() => {
                    handleRemoveCancel();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    handleRemoveConfirm();
                    onClose();
                  }}
                  isDisabled={isRemoving}
                  startContent={isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                >
                  {isRemoving ? "Removing..." : "Remove AI PDF Data"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
}