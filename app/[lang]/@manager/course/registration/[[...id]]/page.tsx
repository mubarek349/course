/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import CourseFor from "./courseFor";
import useAction from "@/hooks/useAction";
import useData from "@/hooks/useData";
import { courseRegistration } from "@/lib/action/course";
import { getChannels, getCourseForManager } from "@/lib/data/course";
import { TCourse } from "@/lib/definations";
import { cn, getEntries } from "@/lib/utils";
import { courseSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import Activity from "./activity";
import { Prisma } from "@prisma/client";
import {
  Button,
  Form,
  Input,
  Link,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@heroui/react";
import { getInstructorsList } from "@/actions/manager/instuctor";
import { CInput, CSelect, CSelectItem, CTextarea } from "@/components/heroui";
// import { getInstructorsList } from "@/lib/data/instructor";

export default function Page() {
  const { lang, id } = useParams<{ lang: string; id?: string[] }>(),
    pathname = usePathname(),
    router = useRouter(),
    { handleSubmit, register, setValue, formState, watch, getValues } =
      useForm<TCourse>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
          titleEn: "",
          titleAm: "",
          aboutEn: "",
          aboutAm: "",
          instructorId: "",
          thumbnail: "",
          video: "",
          price: 0,
          currency: "ETB",
          level: "beginner",
          duration: "",
          language: "Amharic",
          certificate: false,
          requirement: [],
          courseFor: [],
          activity: [],
          accessAm: "በሞባይል ፣ በኮምፒተር ላይ መጠቀም",
          accessEn: "Access on mobile, computer",
          instructorRate: 0,
          sellerRate: 0,
          affiliateRate: 0,
          channelId: "",
        },
      }),
    { action } = useAction(courseRegistration, undefined, {
      // loading: lang == "en" ? "" : "",
      // success: lang == "en" ? "" : "",
      // error: lang == "en" ? "" : "",
      onSuccess({ status }) {
        if (status) {
          router.push(
            `/${pathname
              .split("/")
              .slice(1)
              .reverse()
              .slice(1)
              .reverse()
              .join("/")}`
          );
        }
      },
    }),
    { data: channels } = useData({
      func: getChannels,
      args: [],
    }),
    { data: instructors } = useData({
      func: getInstructorsList,
      args: [],
    });

  useData({
    func: getCourseForManager,
    args: [id ? (typeof id === "object" ? id[0] : id) : "unknown"],
    onSuccess({ instructorId, ...data }) {
      getEntries(data).forEach(([name, value]) => {
        if (value) {
          setValue(
            name,
            value instanceof Prisma.Decimal ? Number(value) : value
          );
        }
      });
    },
  });

  // console.log(formState.errors);

  return (
    instructors &&
    channels && (
      <Form
        onSubmit={handleSubmit(action)}
        validationErrors={Object.entries(formState.errors).reduce(
          (a, [key, value]) => ({ ...a, [key]: value.message }),
          {}
        )}
        className="pb-80 pt-2 bg-primary-200- rounded-md grid gap-16 auto-rows-min justify-center overflow-auto "
      >
        <div className="grid gap-2 ">
          <div className="">
            <div className="grid gap-2 md:gap-5 grid-cols-1 md:grid-cols-2 ">
              {
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={watch("thumbnail") || "/darulkubra.png"}
                  alt=""
                  className={cn(
                    "w-full aspect-video rounded-xl object-center ",
                    formState.errors.thumbnail
                      ? "border border-danger-300 bg-danger-100"
                      : "bg-primary-100"
                  )}
                />
              }
              {watch("video") ? (
                <iframe
                  src={watch("video")}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className={cn("w-full aspect-video rounded-xl ")}
                />
              ) : (
                <div
                  className={cn(
                    "w-full aspect-video rounded-xl ",
                    formState.errors.video
                      ? "border border-danger-300 bg-danger-100"
                      : "bg-primary-100"
                  )}
                />
              )}
            </div>
            <CInput
              color="primary"
              placeholder={
                lang == "en"
                  ? "Paste the video link here"
                  : "የቪዲዮ ሊንክ እዚህ ያስቀምጡ"
              }
              onChange={({ target }) => {
                if (
                  target.value.startsWith("https://www.youtube.com/watch?v=")
                ) {
                  setValue(
                    "thumbnail",
                    `https://img.youtube.com/vi/${
                      target.value.split("=")[1].split("&")[0]
                    }/0.jpg`
                  );
                  setValue(
                    "video",
                    `https://www.youtube.com/embed/${
                      target.value.split("=")[1].split("&")[0]
                    }?si=hbrxQdExNplHNnRu`
                  );
                }
              }}
              className="my-4"
            />
          </div>
          <div className="grid md:gap-5 md:grid-cols-[1fr_1fr_auto]">
            <CInput
              label={lang == "en" ? "Title : English" : "ርዕስ : እንግሊዝኛ"}
              color="primary"
              {...register("titleEn")}
              className=""
            />
            <CInput
              label={lang == "en" ? "Title : Amharic" : "ርዕስ : አማርኛ"}
              color="primary"
              {...register("titleAm")}
              className=""
            />
            <CInput
              label={lang == "en" ? "Price" : "ዋጋ"}
              type="number"
              color="primary"
              {...register("price")}
              endContent={<span className="">ETB</span>}
            />
          </div>
          <div className="space-y-5">
            <CTextarea
              {...register("aboutEn")}
              label={
                lang == "en" ? "About the course : Amharic" : "ስለ ኮርሱ : አማርኛ"
              }
              color="primary"
            />
            <CTextarea
              {...register("aboutAm")}
              label={
                lang == "en" ? "About the course : English" : "ስለ ኮርሱ : እንግሊዝኛ"
              }
              color="primary"
            />
          </div>
          <div className="grid md:gap-5 md:grid-cols-3">
            <CSelect
              {...register("level")}
              label={lang == "en" ? "Level" : "ደረጃ"}
              color="primary"
              className=""
            >
              {["beginner", "intermediate", "advanced"].map((v, i) => (
                <CSelectItem key={v}>{v}</CSelectItem>
              ))}
            </CSelect>
            <CInput
              {...register("duration")}
              label={lang == "en" ? "Duration" : "ቆይታ"}
              color="primary"
              className=""
            />
            <CInput
              {...register("language")}
              label={lang == "en" ? "Language" : "ቋንቋ"}
              color="primary"
              className=""
            />
          </div>
        </div>
        <CourseFor
          list={watch("courseFor")}
          addValue={({ en, am }) =>
            setValue("courseFor", [
              { courseForEn: en, courseForAm: am },
              ...watch("courseFor"),
            ])
          }
          removeValue={(index) =>
            setValue(
              "courseFor",
              watch("courseFor").filter((v, i) => i !== index)
            )
          }
          label={lang == "en" ? "Course for" : "ኮርስ ለ"}
          placeHolderAm={
            lang == "en"
              ? "type here who the course is for in amharic"
              : "ትምህርቱ ለማን እንደሆነ በአማርኛ  እዚህ ይፅፃፉ"
          }
          placeHolderEn={
            lang == "en"
              ? "type here who the course is for in english"
              : "ትምህርቱ ለማን እንደሆነ በእንግሊዝኛ እዚህ ይፅፃፉ"
          }
        />
        <CourseFor
          list={watch("requirement")}
          addValue={({ en, am }) =>
            setValue("requirement", [
              { requirementEn: en, requirementAm: am },
              ...watch("requirement"),
            ])
          }
          removeValue={(index) =>
            setValue(
              "requirement",
              watch("requirement").filter((v, i) => i !== index)
            )
          }
          label={lang == "en" ? "Requirement" : "መስፈርት"}
          placeHolderAm={
            lang == "en"
              ? "type here who the course is for in amharic"
              : "ትምህርቱ ለማን እንደሆነ በአማርኛ  እዚህ ይፅፃፉ"
          }
          placeHolderEn={
            lang == "en"
              ? "type here who the course is for in english"
              : "ትምህርቱ ለማን እንደሆነ በእንግሊዝኛ እዚህ ይፅፃፉ"
          }
        />
        <Activity
          errorMessage={formState.errors.activity?.message ?? ""}
          list={watch("activity")}
          addActivity={(v) =>
            setValue("activity", [
              { titleEn: v.en, titleAm: v.am, subActivity: [] },
              ...watch("activity"),
            ])
          }
          addSubActivity={(index, value) =>
            setValue(
              "activity",
              watch("activity").map(({ titleEn, titleAm, subActivity }, i) => ({
                titleEn,
                titleAm,
                subActivity:
                  i === index
                    ? [{ titleEn: value.en, titleAm: value.am }, ...subActivity]
                    : subActivity,
              }))
            )
          }
          removeActivity={(index) =>
            setValue(
              "activity",
              watch("activity").filter((v, i) => i !== index)
            )
          }
          removeSubActivity={(index1, index2) =>
            watch("activity").map(
              ({ titleEn, titleAm, subActivity }, index) => ({
                titleEn,
                titleAm,
                subActivity:
                  index === index1
                    ? subActivity.filter((v, i) => i !== index2)
                    : subActivity,
              })
            )
          }
        />
        <div className="grid md:gap-5 md:grid-cols-3">
          <CInput
            {...register("instructorRate")}
            label={lang == "en" ? "Instructor Rate" : "የመምህር ዋጋ"}
            color="primary"
            type="number"
            endContent={<span className="">ETB</span>}
            className=""
          />
          <CInput
            {...register("sellerRate")}
            label={lang == "en" ? "Seller Rate" : "የሻጭ ዋጋ"}
            color="primary"
            type="number"
            endContent={<span className="">ETB</span>}
            className=""
          />
          <CInput
            {...register("affiliateRate")}
            label={lang == "en" ? "Affiliate Rate" : "የተባባሪ ዋጋ"}
            color="primary"
            type="number"
            endContent={<span className="">ETB</span>}
            className=""
          />
        </div>
        <div className="grid gap-4 md:grid-cols-3 ">
          <Switch
            {...register("certificate")}
            size="sm"
            className="max-w-full h-fit self-end shrink-0 p-2 rounded-xl bg-foreground/30 border border-foreground/30 data-[selected=true]:border-primary/30 data-[selected=true]:bg-primary/30 flex"
          >
            Certificate
          </Switch>
          <CSelect
            color="primary"
            {...register("channelId")}
            label={lang == "en" ? "Channel" : "ቻናል"}
            className=""
          >
            {channels.map((v, i) => (
              <CSelectItem key={v.id}>{v.title}</CSelectItem>
            ))}
          </CSelect>
          <CSelect
            color="primary"
            {...register("instructorId")}
            label={lang == "en" ? "Instructor" : "መምህር"}
            className=""
          >
            {instructors.map((v, i) => (
              <CSelectItem key={v.id}>
                {`${v.firstName} ${v.fatherName}`}
              </CSelectItem>
            ))}
          </CSelect>
        </div>
        <div className="flex gap-2 max-md:flex-col-reverse md:justify-end">
          <Button
            variant="flat"
            as={Link}
            href={`/${lang}/course`}
            className="md:w-60"
          >
            {lang == "en" ? "Back" : "ተመለስ"}
          </Button>
          <Button type="submit" color="primary" className="md:w-60">
            {lang == "en" ? "Register" : "መዝግብ"}
          </Button>
        </div>
      </Form>
    )
  );
}
