"use client";

import React from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-50/30 dark:from-background dark:via-background dark:to-primary-950/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed top-20 right-20 w-32 h-32 bg-primary-100/30 dark:bg-primary-900/20 rounded-full blur-3xl"></div>
      <div className="fixed bottom-20 left-20 w-40 h-40 bg-success-100/30 dark:bg-success-900/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 grid place-content-center min-h-screen px-4">
        <div className="text-center space-y-6 max-w-2xl">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-success-500 dark:from-primary-600 dark:to-success-600 rounded-full flex items-center justify-center shadow-xl dark:shadow-primary-900/50">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-foreground dark:text-white bg-gradient-to-r from-primary-600 via-primary-700 to-success-600 dark:from-primary-400 dark:via-primary-300 dark:to-success-400 bg-clip-text text-transparent">
            {lang === "en" ? "About Us" : "ስለ እኛ"}
          </h1>
          
          {/* Divider */}
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary-500 via-primary-600 to-success-500 dark:from-primary-400 dark:via-primary-500 dark:to-success-400 rounded-full shadow-lg dark:shadow-primary-500/50 mx-auto"></div>
          
          {/* Message */}
          <div className="p-6 md:p-8 bg-background/80 dark:bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-primary-900/20 border border-divider dark:border-white/10">
            <p className="text-lg text-foreground/80 dark:text-foreground/70 leading-relaxed">
              {lang === "en" 
                ? "This page is currently under construction. Please check back soon for more information about our Islamic education platform and mission."
                : "ይህ ገጽ በግንባታ ላይ ነው። ስለእኛ የኢስላማዊ ትምህርት መድረክ እና ተልእኮ ስለሆነ የበለጠ መረጃ ለማግኘት በቅርቡ ይመልሱ።"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
