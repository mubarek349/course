"use client";

// import "./youtube.css";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  ChartBarIncreasing,
  Clock,
  Languages,
  Logs,
  MonitorSmartphone,
  ReceiptText,
} from "lucide-react";
import Payment from "@/components/Payment";
import useData from "@/hooks/useData";
import { getCourseForCustomer } from "@/lib/data/course";
import Loading from "@/components/loading";
import NoData from "@/components/noData";
import CourseAbout from "@/components/courseAbout";
import CourseMainDescription from "@/components/courseMainDescription";
import CourseRequirement from "@/components/courseRequirement";
import CourseFor from "@/components/courseFor";
import CourseActivity from "@/components/courseActivity";
import CourseTopOverview from "@/components/courseTopOverview";
import { Button, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const params = useParams<{ lang: string; id: string }>();
  const lang = params?.lang || "en";
  const id = params?.id ?? "",
    searchParams = useSearchParams(),
    { data, loading } = useData({ func: getCourseForCustomer, args: [id] }),
    { isOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  const loginRedirect = () => {
    // Redirect to login page with course ID and affiliate code
    const affiliateCode = searchParams?.get("code") || "";
    const redirectUrl = `/${lang}/login?redirect=${encodeURIComponent(
      `/${lang}/course/${id}`
    )}${affiliateCode ? `&code=${affiliateCode}` : ""}`;
    router.push(redirectUrl);
  };

  return (
    <div className="h-dvh">
      {loading ? (
        <Loading />
      ) : !data ? (
        <NoData />
      ) : (
        <div className="px-2 md:pl-20 py-20 md:pr-[31.5rem] h-full flex flex-col gap-10 overflow-auto">
          <CourseTopOverview
            {...{
              title: lang == "en" ? data.titleEn : data.titleAm,
              by: `${data.instructor.firstName} ${data.instructor.fatherName}`,
              thumbnail: data.thumbnail,
              video: data.video,
            }}
          />
          <div className="p-4 rounded-xl border border-primary-500/30 space-y-10">
            <CourseAbout data={lang == "en" ? data.aboutEn : data.aboutAm} />
            <CourseMainDescription
              btn={
                <Button onPress={loginRedirect} variant="solid" color="primary">
                  {lang == "en" ? "Login & Enroll" : " ይመዝገቡ"}
                </Button>
              }
              data={[
                {
                  icon: <ChartBarIncreasing className="" />,
                  label: lang == "en" ? "Level" : "ደረጃ",
                  value: data.level,
                },
                {
                  icon: <Languages className="" />,
                  label: lang == "en" ? "Language" : "ቋንቋ",
                  value: data.language,
                },
                {
                  icon: <Clock className="" />,
                  label: lang == "en" ? "Duration" : "ቆይታ",
                  value: data.duration,
                },
                {
                  icon: <Logs className="" />,
                  label: lang == "en" ? "Activities" : "ተግባራት",
                  value: data.activity.reduce(
                    (a, c) => a + c.subActivity.length,
                    0
                  ),
                },
                {
                  icon: <MonitorSmartphone className="" />,
                  label: "",
                  value: lang == "en" ? data.accessEn : data.accessAm,
                },
                ...(data.certificate
                  ? [
                      {
                        icon: <ReceiptText className="" />,
                        label: "",
                        value:
                          lang == "en"
                            ? "Certificate of completion"
                            : "የማጠናቀቂያ የምስክር ወረቀት",
                      },
                    ]
                  : []),
              ]}
            />
            <CourseRequirement data={data.requirement} />
            <CourseFor data={data.courseFor} />
            <CourseActivity data={data.activity} />
          </div>
          <Payment
            isOpen={isOpen}
            id={data.id}
            onOpenChange={onOpenChange}
            affiliateCode={searchParams?.get("code") || ""}
            title={lang == "en" ? data.titleEn : data.titleAm}
            price={data.price}
            birrPrice={data.birrPrice}
            dolarPrice={data.dolarPrice}
          />
        </div>
      )}
    </div>
  );
}
