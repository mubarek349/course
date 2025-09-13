"use client";
import useData from "@/hooks/useData";
import Image from "next/image";
import { getCertificateDetails } from "@/actions/student/mycourse";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Trophy, Printer, X, ChevronLeft, ChevronRight } from "lucide-react";

type CertificateData = {
  status: boolean;
  courseTitle: string;
  studentName: string;
  percent: number;
  result: "poor" | "good" | "veryGood" | "excellent" | string;
  instructorName?: string | null;
  issuedAt: string;
  qrcode?: string;
};

type CertificationProps = {
  data: CertificateData;
  lang: string;
  courseId: string;
  onBack: () => void;
  onPrint: () => void;
  onPrev: () => void; // added
  onNext: () => void; // added
  currentLabel: string; // added
};

function EnglishCertification({
  data,
  lang,
  courseId,
  onBack,
  onPrint,
  onPrev,
  onNext,
  currentLabel,
}: CertificationProps) {
  const ref = useRef<HTMLDivElement>(null);

  const issued = new Date(data.issuedAt);
  const issuedStr = issued.toLocaleDateString();
  const percent = Math.round(data.percent || 0);
  const result = String(data.result || "").toLowerCase();
  const resultBadge =
    result === "excellent"
      ? "border-emerald-500 text-emerald-700"
      : result === "verygood"
      ? "border-sky-500 text-sky-700"
      : result === "good"
      ? "border-amber-500 text-amber-700"
      : "border-rose-500 text-rose-700";

  const certificateId = `${courseId}-${issued.getTime()}`;
  const qrPath =
    data.qrcode || `/${lang}/@student/mycourse/${courseId}/finalexam`;
  const qrData =
    typeof window !== "undefined"
      ? new URL(qrPath, window.location.origin).toString()
      : qrPath;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
    qrData
  )}`;

  // Signature and stamp assets (place images under /public/assets/cert/)
  const signInstructor = "/sign.png";
  const signAuthorized = "/stamp_logo.png";
  const stampLogo = "/stamp_logo.png";

  return (
    <div
      id="certificate-print"
      className="min-h-dvh bg-[#f7f2e9] text-[#1f2937] p-4 print:p-0"
    >
      {/* Hide everything except the certificate on print */}
      <style jsx global>{`
        @media print {
          /* Hide entire app except the certificate area */
          body * {
            visibility: hidden !important;
          }
          #certificate-print,
          #certificate-print * {
            visibility: visible !important;
          }
          #certificate-print {
            position: fixed;
            inset: 0;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background: #f7f2e9 !important;
          }
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4 print:hidden">
          <button
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900 inline-flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Close
          </button>

          {/* center: navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={onPrev}
              className="p-2 rounded-md border border-slate-300 hover:bg-slate-50"
              aria-label="Previous certificate"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-600">
              {currentLabel} Certificate
            </span>
            <button
              onClick={onNext}
              className="p-2 rounded-md border border-slate-300 hover:bg-slate-50"
              aria-label="Next certificate"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white inline-flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
          </div>
        </div>

        {/* Certificate Canvas */}
        <div
          ref={ref}
          className="relative bg-white shadow-2xl rounded-[24px] overflow-hidden border-8 border-[#e9d8a6] print:shadow-none print:border-0"
        >
          {/* Decorative header */}
          <div className="relative h-28 bg-gradient-to-b from-[#ffe5b4] to-white flex items-center justify-center">
            <div className="absolute inset-x-0 -top-6 h-12 bg-[#e9d8a6] rounded-b-[36px] mx-10" />
            <div className="relative z-10 text-center">
              {/* Replaced with Next.js Image */}
              <Image
                src="/darulkubra.png"
                alt="DarulKubra logo"
                width={160}
                height={64}
                className="mx-auto h-12 md:h-14 print:h-16 w-auto my-2 mt-20"
                priority
              />
              <div className="text-[#2f4f4f] tracking-widest text-sm">
                CERTIFICATE OF COMPLETION
              </div>
              <div className="text-3xl font-extrabold text-[#2f4f4f] mt-1">
                {data.courseTitle}
              </div>
            </div>
          </div>

          <div className="px-10 py-8 text-center">
            <div className="text-sm text-slate-500">This certifies that</div>
            <div className="mt-2 text-4xl font-bold text-[#547e4e]">
              {data.studentName}
            </div>
            <div className="mt-3 text-slate-600 max-w-3xl mx-auto leading-relaxed">
              has successfully completed the course and passed the final
              assessment with a score of <b>{Math.round(data.percent)}%</b>.
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <div className={`px-3 py-1 rounded-full border ${resultBadge}`}>
                Result: {String(data.result).toUpperCase()}
              </div>
              <div className="px-3 py-1 rounded-full border border-indigo-400 text-indigo-700">
                Score: {percent}%
              </div>
              <div className="px-3 py-1 rounded-full border border-sky-500 text-sky-700">
                Issued: {issuedStr}
              </div>
              {data.instructorName && (
                <div className="px-3 py-1 rounded-full border border-amber-500 text-amber-700">
                  Instructor: {data.instructorName}
                </div>
              )}
            </div>

            {/* Seal */}
            <div className="mt-10 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#e9d8a6] border-4 border-[#f1e9c9] flex items-center justify-center shadow-inner">
                <Trophy className="w-10 h-10 text-[#8b5e34]" />
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-10 grid grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="text-left">
                <img
                  src={signInstructor}
                  alt="Instructor signature"
                  className="h-10 object-contain mb-2 opacity-90"
                />
                <div className="h-px bg-slate-300 mb-1" />
                <div className="text-sm font-medium">Course Instructor</div>
                <div className="text-xs text-slate-500">
                  {data.instructorName || "Signature"}
                </div>
              </div>
              <div className="text-right">
                <img
                  src={signAuthorized}
                  alt="Authorized signature"
                  className="h-10 object-contain mb-2 ml-auto opacity-90"
                />
                <div className="h-px bg-slate-300 mb-1" />
                <div className="text-sm font-medium">Authorized</div>
                <div className="text-xs text-slate-500">Mube Academy</div>
              </div>
            </div>

            {/* QR Code for verification */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="text-xs text-slate-500">Scan to verify</div>
              <div className="bg-white p-2 rounded-md border border-slate-200">
                <img src={qrSrc} alt="QR code" width={60} height={60} />
              </div>
            </div>

            {/* <div className="px-10 pb-8 text-center">
              <div className="mt-6 text-[10px] text-slate-400">
                Certificate ID: {certificateId}
              </div>
            </div> */}
          </div>

          {/* Stamp overlay */}
          {/* <img
            src={stampLogo}
            alt="Stamp"
            className="absolute right-8 bottom-8 h-20 w-20 opacity-80 select-none pointer-events-none"
          /> */}
        </div>
      </div>
    </div>
  );
}

function AmharicCertification({
  data,
  lang,
  courseId,
  onBack,
  onPrint,
  onPrev,
  onNext,
  currentLabel,
}: CertificationProps) {
  const ref = useRef<HTMLDivElement>(null);

  const issued = new Date(data.issuedAt);
  const issuedStr = issued.toLocaleDateString();
  const percent = Math.round(data.percent || 0);
  const result = String(data.result || "").toLowerCase();
  const resultBadge =
    result === "excellent"
      ? "border-emerald-500 text-emerald-700"
      : result === "verygood"
      ? "border-sky-500 text-sky-700"
      : result === "good"
      ? "border-amber-500 text-amber-700"
      : "border-rose-500 text-rose-700";

  const certificateId = `${courseId}-${issued.getTime()}`;
  const qrPath =
    data.qrcode || `/${lang}/@student/mycourse/${courseId}/finalexam`;
  const qrData =
    typeof window !== "undefined"
      ? new URL(qrPath, window.location.origin).toString()
      : qrPath;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
    qrData
  )}`;

  // Signature and stamp assets (place images under /public/assets/cert/)
  const signInstructor = "/sign.png";
  const signAuthorized = "/stamp_logo.png";
  const stampLogo = "/stamp_logo.png";

  return (
    <div
      id="certificate-print"
      className="min-h-dvh bg-[#f7f2e9] text-[#1f2937] p-4 print:p-0"
    >
      {/* Hide everything except the certificate on print */}
      <style jsx global>{`
        @media print {
          /* Hide entire app except the certificate area */
          body * {
            visibility: hidden !important;
          }
          #certificate-print,
          #certificate-print * {
            visibility: visible !important;
          }
          #certificate-print {
            position: fixed;
            inset: 0;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background: #f7f2e9 !important;
          }
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4 print:hidden">
          <button
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900 inline-flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Close
          </button>

          {/* center: navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={onPrev}
              className="p-2 rounded-md border border-slate-300 hover:bg-slate-50"
              aria-label="Previous certificate"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-600">
              {currentLabel} Certificate
            </span>
            <button
              onClick={onNext}
              className="p-2 rounded-md border border-slate-300 hover:bg-slate-50"
              aria-label="Next certificate"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white inline-flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> download certificate
            </button>
          </div>
        </div>

        {/* Certificate Canvas */}
        <div
          ref={ref}
          className="relative bg-white shadow-2xl rounded-[24px] overflow-hidden border-8 border-[#e9d8a6] print:shadow-none print:border-0"
        >
          {/* Decorative header */}
          <div className="relative h-28 bg-gradient-to-b from-[#ffe5b4] to-white flex items-center justify-center">
            <div className="absolute inset-x-0 -top-6 h-12 bg-[#e9d8a6] rounded-b-[36px] mx-10" />
            <div className="relative z-10 text-center">
              {/* Replaced with Next.js Image */}
              <Image
                src="/darulkubra.png"
                alt="DarulKubra logo"
                width={160}
                height={64}
                className="mx-auto h-12 md:h-14 print:h-16 w-auto my-2 mt-20"
                priority
              />
              <div className="text-[#2f4f4f] tracking-widest text-sm">
                CERTIFICATE OF COMPLETION
              </div>
              <div className="text-3xl font-extrabold text-[#2f4f4f] mt-1">
                {data.courseTitle}
              </div>
            </div>
          </div>

          <div className="px-10 py-8 text-center">
            <div className="text-sm text-slate-500">This certifies that</div>
            <div className="mt-2 text-4xl font-bold text-[#547e4e]">
              {data.studentName}
            </div>
            <div className="mt-3 text-slate-600 max-w-3xl mx-auto leading-relaxed">
              እ.ኤ.አ {data.studentName} የተጠቃሚው በዚህ ኮርስ በተሳካ ሁኔታ ተሳትፎ ፈተናውን በ{" "}
              {Math.round(data.percent)}% ውጤት አልፎ መሟሟቱን ይረዳል።
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <div className={`px-3 py-1 rounded-full border ${resultBadge}`}>
                Result: {String(data.result).toUpperCase()}
              </div>
              <div className="px-3 py-1 rounded-full border border-indigo-400 text-indigo-700">
                Score: {percent}%
              </div>
              <div className="px-3 py-1 rounded-full border border-sky-500 text-sky-700">
                Issued: {issuedStr}
              </div>
              {data.instructorName && (
                <div className="px-3 py-1 rounded-full border border-amber-500 text-amber-700">
                  Instructor: {data.instructorName}
                </div>
              )}
            </div>

            {/* Seal */}
            <div className="mt-10 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#e9d8a6] border-4 border-[#f1e9c9] flex items-center justify-center shadow-inner">
                <Trophy className="w-10 h-10 text-[#8b5e34]" />
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-10 grid grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="text-left">
                <img
                  src={signInstructor}
                  alt="Instructor signature"
                  className="h-10 object-contain mb-2 opacity-90"
                />
                <div className="h-px bg-slate-300 mb-1" />
                <div className="text-sm font-medium">Course Instructor</div>
                <div className="text-xs text-slate-500">
                  {data.instructorName || "Signature"}
                </div>
              </div>
              <div className="text-right">
                <img
                  src={signAuthorized}
                  alt="Authorized signature"
                  className="h-10 object-contain mb-2 ml-auto opacity-90"
                />
                <div className="h-px bg-slate-300 mb-1" />
                <div className="text-sm font-medium">Authorized</div>
                <div className="text-xs text-slate-500">Mube Academy</div>
              </div>
            </div>

            {/* QR Code for verification */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="text-xs text-slate-500">Scan to verify</div>
              <div className="bg-white p-2 rounded-md border border-slate-200">
                <img src={qrSrc} alt="QR code" width={60} height={60} />
              </div>
            </div>

            {/* <div className="px-10 pb-8 text-center">
              <div className="mt-6 text-[10px] text-slate-400">
                Certificate ID: {certificateId}
              </div>
            </div> */}
          </div>

          {/* Stamp overlay */}
          {/* <img
            src={stampLogo}
            alt="Stamp"
            className="absolute right-8 bottom-8 h-20 w-20 opacity-80 select-none pointer-events-none"
          /> */}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const params = useParams<{ lang: string; id: string }>();
  const lang = params?.lang || "en";
  const courseId = params?.id || "";

  const { data, loading } = useData({
    func: getCertificateDetails,
    args: [courseId],
  });
  const cert = (data || {}) as CertificateData;

  const [activeIdx, setActiveIdx] = useState(0); // 0: English, 1: Amharic
  const labels = ["English", "Amharic"];

  const printPdf = () => {
    window.print(); // prints current visible certificate
  };

  const goPrev = () => setActiveIdx((i) => (i === 0 ? 1 : i - 1));
  const goNext = () => setActiveIdx((i) => (i === 1 ? 0 : i + 1));

  if (loading) {
    return (
      <div className="h-full bg-background text-foreground flex items-center justify-center p-6 overflow-auto">
        Loading…
      </div>
    );
  }

  if (!data?.status || data.result === "nottaken" || data.result === "error") {
    return (
      <div className="min-h-dvh bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-semibold mb-1">
            Certificate Unavailable
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Please complete the final exam first.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return activeIdx === 0 ? (
    <EnglishCertification
      data={cert}
      lang={lang}
      courseId={courseId}
      onBack={() => router.back()}
      onPrint={printPdf}
      onPrev={goPrev}
      onNext={goNext}
      currentLabel={labels[activeIdx]}
    />
  ) : (
    <AmharicCertification
      data={cert}
      lang={lang}
      courseId={courseId}
      onBack={() => router.back()}
      onPrint={printPdf}
      onPrev={goPrev}
      onNext={goNext}
      currentLabel={labels[activeIdx]}
    />
  );
}
