"use client";

import { useState } from "react";
import { Upload, FileText, Eye, Trash2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import {
  Button,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateCourseMaterials } from "@/actions/manager/course-materials";
import { ChunkedUploader } from "@/lib/chunkedUploaderServerAction";
import { uploadMaterialChunk } from "@/actions/manager/material-upload";

interface CourseMaterialsManagerProps {
  packageId: string;
  packageName: string;
  initialMaterials: string | null;
}

interface UploadProgress {
  filename: string;
  progress: number;
  status: string;
  isComplete: boolean;
  error?: string;
}

interface CourseMaterial {
  name: string;
  url: string;
  type: string;
}

export function CourseMaterialsManager({
  packageId,
  initialMaterials,
}: CourseMaterialsManagerProps) {
  // Parse triplet format: "name1,url1,type1,name2,url2,type2"
  const parseMaterials = (materialsString: string | null): CourseMaterial[] => {
    if (!materialsString || materialsString.trim() === '') return [];
    
    const parts = materialsString.split(',').map(p => p.trim());
    const materials: CourseMaterial[] = [];
    
    for (let i = 0; i < parts.length; i += 3) {
      if (i + 2 < parts.length) {
        materials.push({
          name: parts[i] || 'material',
          url: parts[i + 1] || '',
          type: parts[i + 2] || 'file'
        });
      }
    }
    
    return materials;
  };

  const [materials, setMaterials] = useState<CourseMaterial[]>(
    parseMaterials(initialMaterials)
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedFiles: string[] = [];
    
    // Initialize progress tracking for all files
    const initialProgress: UploadProgress[] = Array.from(files).map(file => ({
      filename: file.name,
      progress: 0,
      status: "Preparing...",
      isComplete: false,
    }));
    setUploadProgress(initialProgress);

    try {
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const file = files[fileIndex];
        
        // Validate file size
        if (file.size > 1000 * 1024 * 1024) {
          setUploadProgress(prev => prev.map((p, i) => 
            i === fileIndex 
              ? { ...p, status: "File too large", error: "File exceeds 1000MB limit", isComplete: true }
              : p
          ));
          continue;
        }

        // Update progress to uploading
        setUploadProgress(prev => prev.map((p, i) => 
          i === fileIndex 
            ? { ...p, progress: 10, status: "Starting upload..." }
            : p
        ));

        const uploader = new ChunkedUploader(uploadMaterialChunk, {
          chunkSize: 5 * 1024 * 1024, // 5MB chunks
          maxRetries: 3,
          onProgress: (progress) => {
            setUploadProgress(prev => prev.map((p, i) => 
              i === fileIndex 
                ? { ...p, progress: Math.min(90, progress), status: `Uploading... ${Math.round(progress)}%` }
                : p
            ));
          },
          onError: (error) => {
            setUploadProgress(prev => prev.map((p, i) => 
              i === fileIndex 
                ? { ...p, status: "Upload failed", error: error, isComplete: true }
                : p
            ));
          },
          onSuccess: () => {
            setUploadProgress(prev => prev.map((p, i) => 
              i === fileIndex 
                ? { ...p, progress: 100, status: "Upload complete", isComplete: true }
                : p
            ));
            uploadedFiles.push(file.name);
          }
        });

        await uploader.uploadFile(file, packageId);
      }

      // Wait a moment for all uploads to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (uploadedFiles.length > 0) {
        // Create material objects from uploaded filenames
        const newMaterials: CourseMaterial[] = uploadedFiles.map(filename => {
          const url = `/api/files/materials/${filename}`;
          const extension = filename.split('.').pop()?.toLowerCase() || '';
          let type = 'file';
          
          if (['pdf'].includes(extension)) type = 'pdf';
          else if (['doc', 'docx'].includes(extension)) type = 'document';
          else if (['ppt', 'pptx'].includes(extension)) type = 'presentation';
          else if (['xls', 'xlsx'].includes(extension)) type = 'spreadsheet';
          else if (['mp4', 'avi', 'mov', 'webm'].includes(extension)) type = 'video';
          else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) type = 'image';
          else if (['zip', 'rar', '7z'].includes(extension)) type = 'archive';
          else if (['txt'].includes(extension)) type = 'text';
          
          return {
            name: filename,
            url: url,
            type: type
          };
        });
        
        const updatedMaterials = [...materials, ...newMaterials];
        setMaterials(updatedMaterials);

        console.log('📦 Updated materials array:', updatedMaterials);

        // Convert to triplet format for database: "name1,url1,type1,name2,url2,type2"
        const materialsString = updatedMaterials
          .map(m => `${m.name},${m.url},${m.type}`)
          .join(',');
        
        console.log('💾 Saving to database (triplet format):', materialsString);
        
        // Update database
        const updateResult = await updateCourseMaterials(packageId, materialsString);
        
        console.log('✅ Database update result:', updateResult);
        
        if (!updateResult.success) {
          throw new Error(updateResult.message);
        }

        toast.success(`${uploadedFiles.length} file(s) uploaded successfully!`);
        router.refresh();
      }

    } catch (error) {
      console.error('❌ Upload error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
      toast.error(error instanceof Error ? error.message : 'Failed to upload files');
    } finally {
      setIsUploading(false);
      event.target.value = '';
      // Clear progress after 3 seconds
      setTimeout(() => {
        setUploadProgress([]);
      }, 3000);
    }
  };

  const handleDeleteClick = (filename: string) => {
    setMaterialToDelete(filename);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!materialToDelete) return;

    setIsDeleting(true);
    try {
      // Filter out the material with matching URL
      const updatedMaterials = materials.filter(m => !m.url.includes(materialToDelete));
      setMaterials(updatedMaterials);

      // Convert to triplet format for database
      const materialsString = updatedMaterials
        .map(m => `${m.name},${m.url},${m.type}`)
        .join(',');

      const result = await updateCourseMaterials(packageId, materialsString);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success('Material deleted successfully!');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete material');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setMaterialToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setMaterialToDelete(null);
  };

  const getFileIcon = () => {
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
        <input
          type="file"
          multiple
          accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.xls,.xlsx"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
          id={`upload-${packageId}`}
        />
        <label
          htmlFor={`upload-${packageId}`}
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <div className="rounded-full bg-slate-100 p-3">
            {isUploading ? (
              <Loader2 className="h-6 w-6 text-slate-600 animate-spin" />
            ) : (
              <Upload className="h-6 w-6 text-slate-600" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">
              {isUploading ? 'Uploading...' : 'Upload Materials'}
            </p>
            <p className="text-xs text-slate-500">
              PDF, PPT, DOC, XLS files supported (Max 1000MB each)
            </p>
          </div>
        </label>
      </div>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-800">
            Upload Progress ({uploadProgress.length} files)
          </h4>
          {uploadProgress.map((progress, index) => (
            <div key={index} className="bg-slate-50 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-800 truncate">
                    {progress.filename}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {progress.isComplete ? (
                    progress.error ? (
                      <span className="flex items-center text-xs px-2 py-1 bg-red-100 text-red-800 rounded-md border border-red-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Failed
                      </span>
                    ) : (
                      <span className="flex items-center text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md border border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </span>
                    )
                  ) : (
                    <span className="flex items-center text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-md border border-gray-200">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      {progress.status}
                    </span>
                  )}
                </div>
              </div>
              <Progress 
                value={progress.progress} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>{progress.status}</span>
                <span>{progress.progress}%</span>
              </div>
              {progress.error && (
                <p className="text-xs text-red-600 mt-1">{progress.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Materials List */}
      {materials.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-800">
            Uploaded Materials ({materials.length})
          </h4>
            {materials.map((material, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-slate-50 rounded-md border"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getFileIcon()}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm text-slate-700 truncate">
                      {material.name}
                    </span>
                    <span className="text-xs text-slate-500 uppercase">
                      {material.type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => window.open(material.url, '_blank')}
                    isIconOnly
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => handleDeleteClick(material.url.split('/').pop() || material.url)}
                    isIconOnly
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}

      {materials.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-slate-500">No materials uploaded yet</p>
        </div>
      )}

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
                Delete Material
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-700">
                  Are you sure you want to delete <strong>&quot;{materialToDelete}&quot;</strong>? 
                  This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={() => {
                    handleDeleteCancel();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    handleDeleteConfirm();
                    onClose();
                  }}
                  isDisabled={isDeleting}
                  startContent={isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}