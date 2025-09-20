"use client";
import React, { useMemo } from "react";
import useData from "@/hooks/useData";

import {
  Button,
  Form,
  Input,
  Checkbox,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendMessageToAll } from "@/lib/action/message";
import { getCourses } from "@/lib/data/course";
import Loading from "@/components/loading";
import useAction from "@/hooks/useAction";
import { AlertTriangle, Link2, Send, Smartphone, Users } from "lucide-react";
import { useParams } from "next/navigation";

const formSchema = z.object({
  courseId: z.array(z.string({ message: "" })),
  message: z.string({ message: "" }).nonempty("Message is required"),
  withUrl: z.coerce.boolean({ message: "" }).optional(),
  url: z.string({ message: "" }).optional(),
  name: z.string({ message: "" }).optional(),
  withSMS: z.coerce.boolean({ message: "" }),
  targetAll: z.coerce.boolean({ message: "" }).optional(),
});

export default function Page() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";

  const {
    handleSubmit,
    register,
    watch,
    formState,
    setValue,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      url: "",
      name: "",
      withSMS: false,
      withUrl: false,
      targetAll: false,
      courseId: [],
    },
  });

  const { data: courses, loading } = useData({ func: getCourses, args: [] });

  const { action, isPending } = useAction(sendMessageToAll, undefined, {
    loading: "Sending...",
    success: "Message sent successfully",
    error: "Failed to send message",
  });

  const withUrlValue = watch("withUrl");
  const targetAll = watch("targetAll");
  const selectedCourseIds = watch("courseId");
  const messageText = watch("message") ?? "";

  const allCourseIds = useMemo(
    () => (courses ?? []).map((c: any) => c.id),
    [courses]
  );

  const selectedCount = useMemo(
    () => (targetAll ? allCourseIds.length : selectedCourseIds.length || 0),
    [targetAll, allCourseIds.length, selectedCourseIds.length]
  );

  const disabledSubmit = useMemo(() => {
    if (isPending || loading) return true;
    if (!messageText.trim()) return true;
    if (!targetAll && selectedCourseIds.length === 0) return true;
    if (withUrlValue && !watch("url")?.trim()) return true;
    return false;
  }, [isPending, loading, messageText, targetAll, selectedCourseIds.length, withUrlValue, watch]);

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    const finalPayload = {
      ...payload,
      courseId: payload.targetAll ? allCourseIds : payload.courseId,
    };

    // Safety guard
    if (!finalPayload.courseId || finalPayload.courseId.length === 0) return;

    const confirmText = `${lang === "en" ? "Send this message to" : "ይህን መልዕክት ለ"} ${selectedCount} ${
      lang === "en" ? "course(s) enrolled students?" : "ኮርሶች የተመዘገቡ ተማሪዎች?"
    }${payload.withSMS ? `\n${lang === "en" ? "SMS will also be sent." : "ኤስኤምኤስ ደግሞ ይላካል።"}` : ""}`;

    // eslint-disable-next-line no-alert
    const proceed = window.confirm(confirmText);
    if (!proceed) return;

    await action(finalPayload);
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          {lang === "en" ? "Broadcast Message" : "መልዕክት ላክ"}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {lang === "en"
            ? "Send an announcement to students of selected courses."
            : "ለተመረጡ ኮርሶች ተማሪዎች መልዕክት ላክ።"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-2">
          <Form
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6"
            validationErrors={Object.entries(formState.errors).reduce(
              (a, [key, value]) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return { ...a, [key]: (value as any).message };
              },
              {}
            )}
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Audience */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-medium">{lang === "en" ? "Audience" : "ተቀባዮች"}</h2>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={targetAll}
                  {...register("targetAll")}
                >
                  {lang === "en" ? "Send to all courses" : "ለሁሉም ኮርሶች ላክ"}
                </Checkbox>
              </div>
              <div className="pt-2">
                <Select
                  className="max-w-full"
                  label={lang === "en" ? "Select Courses" : "ኮርሶች ይምረጡ"}
                  placeholder={
                    lang === "en" ? "Choose one or more courses" : "አንድ ወይም ብዙ ኮርሶች ይምረጡ"
                  }
                  selectionMode="multiple"
                  isDisabled={targetAll}
                  onSelectionChange={(data) => {
                    setValue("courseId", Array.from(data) as string[]);
                  }}
                >
                  {(courses ?? []).map((course: any) => (
                    <SelectItem key={course.id}>
                      {course.titleEn}
                    </SelectItem>
                  ))}
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  {lang === "en"
                    ? `Selected: ${selectedCount} course(s)`
                    : `ተመርጧል፡ ${selectedCount} ኮርሶች`}
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* Message */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-medium">{lang === "en" ? "Message" : "መልዕክት"}</h2>
              </div>
              <Textarea
                {...register("message")}
                placeholder={
                  lang === "en"
                    ? "Type your announcement or update here..."
                    : "መልዕክትዎን እዚህ ያስገቡ..."
                }
                className=""
                minRows={5}
              />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {lang === "en"
                    ? "This message will be sent via Telegram to students enrolled in the selected courses."
                    : "ይህ መልዕክት ለተመረጡ ኮርሶች የተመዘገቡ ተማሪዎች በቴሌግራም ይላካል።"}
                </span>
                <span>{messageText.length} {lang === "en" ? "characters" : "ፊደላት"}</span>
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-gray-500" />
                <Checkbox {...register("withSMS")}>
                  {lang === "en" ? "Also send as SMS" : "እንዲሁም በኤስኤምኤስ ላክ"}
                </Checkbox>
              </div>

              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-gray-500" />
                <Checkbox {...register("withUrl")}>
                  {lang === "en" ? "Attach link (optional)" : "አባሪ አገናኝ (አማራጭ)"}
                </Checkbox>
              </div>

              {withUrlValue && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    {...register("url")}
                    type="text"
                    placeholder={lang === "en" ? "Enter URL" : "URL ያስገቡ"}
                    className="sm:col-span-2"
                  />
                  <Input
                    {...register("name")}
                    type="text"
                    placeholder={lang === "en" ? "Link label (e.g. Open Course)" : "የአገናኝ ስም"}
                  />
                </div>
              )}

              {Object.keys(formState.errors).length > 0 && (
                <div className="flex items-start gap-2 text-amber-600 text-sm">
                  <AlertTriangle className="w-4 h-4 mt-0.5" />
                  <span>
                    {lang === "en"
                      ? "Please fix the errors above before submitting."
                      : "ከመላክዎ በፊት ካሉት ስህተቶች ያስተካክሉ።"}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="flat"
                isLoading={isPending}
                isDisabled={disabledSubmit}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {lang === "en" ? "Send Message" : "መልዕክት ላክ"}
              </Button>
            </div>
          </Form>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold mb-3">{lang === "en" ? "Delivery details" : "የመላኪያ ዝርዝሮች"}</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <li>• {lang === "en" ? "Telegram delivery to enrolled students." : "ለተመዘገቡ ተማሪዎች በቴሌግራም ይላካል።"}</li>
              <li>• {lang === "en" ? "Optional SMS delivery if enabled." : "ካንቀሳቀሰ ኤስኤምኤስ እንዲላክ ይችላል።"}</li>
              <li>• {lang === "en" ? "Link button is shown in Telegram when a URL is attached." : "URL ከተጨመረ በቴሌግራም የአገናኝ አዝራር ይታያል።"}</li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold mb-3">{lang === "en" ? "Preview" : "ቅድመ እይታ"}</h3>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900/30 whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {messageText || (lang === "en" ? "Your message will appear here..." : "መልዕክትዎ እዚህ ይታያል...")}
              </div>
              {withUrlValue && (watch("url")?.trim() || watch("name")?.trim()) && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="text-xs text-gray-500 mb-1">{lang === "en" ? "Link Button" : "የአገናኝ አዝራር"}</div>
                  <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                    {watch("name")?.trim() || (lang === "en" ? "Open" : "ክፈት")}
                  </Button>
                  <div className="mt-2 text-xs text-gray-500 break-all">{watch("url")}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
