"use client";

import React from "react";
import { File, Download, FileText, FileSpreadsheet, Presentation, FileImage } from "lucide-react";
import { getCourseMaterials } from "@/lib/data/courseMaterials";
import useData from "@/hooks/useData";

interface CourseMaterial {
  name: string;
  url: string;
  type: string;
}

export default function CourseMaterials({ 
  courseId, 
  lang 
}: { 
  courseId: string; 
  lang: string; 
}) {
  const { data: materials, loading } = useData({
    func: getCourseMaterials,
    args: [courseId],
  });

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "ppt":
      case "pptx":
        return <Presentation className="w-5 h-5 text-orange-500" />;
      case "doc":
      case "docx":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FileImage className="w-5 h-5 text-purple-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getFileTypeLabel = (type: string) => {
    if (lang === "en") {
      return type.toUpperCase();
    }
    return type.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!materials || materials.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-medium mb-2">
          {lang === "en" ? "No Additional Materials" : "ተጨማሪ ቅረጾች የሉም"}
        </h3>
        <p className="text-gray-500">
          {lang === "en"
            ? "Check back for additional course materials"
            : "ለተጨማሪ የኮርስ ቅረጾች በኋላ በድጋሚ ይመለሱ"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {materials.map((material: CourseMaterial, index: number) => (
        <div 
          key={index} 
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {getFileIcon(material.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {material.name}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                  {getFileTypeLabel(material.type)}
                </span>
                <a
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Download className="w-4 h-4" />
                  {lang === "en" ? "Download" : "አውርድ"}
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}