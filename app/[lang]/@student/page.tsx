"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

function Page() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params?.lang || "en";

  useEffect(() => {
    // Redirect to mycourse page
    router.replace(`/${lang}/mycourse`);
  }, [lang, router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your courses...</p>
      </div>
    </div>
  );
}

export default Page;
