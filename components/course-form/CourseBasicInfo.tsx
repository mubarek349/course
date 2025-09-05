"use client";
import { UseFormRegister } from "react-hook-form";
import { TCourse } from "@/lib/definations";
import { CInput, CSelect, CSelectItem, CTextarea } from "../heroui";

interface CourseBasicInfoProps {
  lang: string;
  register: UseFormRegister<TCourse>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: (key: string) => any;
}

export default function CourseBasicInfo({
  lang,
  register,
  watch,
}: CourseBasicInfoProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
        <CInput
          label={lang === "en" ? "Title : English" : "ርዕስ : እንግሊዝኛ"}
          color="primary"
          value={watch ? watch("titleEn") : ""}
          {...register("titleEn")}
          className="w-full"
        />
        <CInput
          label={lang === "en" ? "Title : Amharic" : "ርዕስ : አማርኛ"}
          color="primary"
          value={watch ? watch("titleAm") : ""}
          {...register("titleAm")}
          className="w-full"
        />
        <CInput
          label={lang === "en" ? "Price" : "ዋጋ"}
          type="number"
          color="primary"
          value={watch ? watch("price")?.toString() : ""}
          {...register("price", { valueAsNumber: true })}
          endContent={<span className="text-sm text-gray-500">ETB</span>}
          className="w-full"
        />
      </div>

      <div className="grid gap-3 sm:gap-4 md:gap-5 grid-cols-1 md:grid-cols-2">
        <CTextarea
          {...register("aboutEn")}
          label={
            lang === "en" ? "About the course : English" : "ስለ ኮርሱ : እንግሊዝኛ"
          }
          color="primary"
          value={watch ? watch("aboutEn") : ""}
          minRows={3}
          className="w-full"
        />
        <CTextarea
          {...register("aboutAm")}
          label={lang === "en" ? "About the course : Amharic" : "ስለ ኮርሱ : አማርኛ"}
          color="primary"
          value={watch ? watch("aboutAm") : ""}
          minRows={3}
          className="w-full"
        />
      </div>

      <div className="grid gap-3 sm:gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <CSelect
          {...register("level")}
          label={lang === "en" ? "Level" : "ደረጃ"}
          color="primary"
          selectedKeys={watch ? [watch("level")] : []}
          className="w-full"
        >
          {["beginner", "intermediate", "advanced"].map((v) => (
            <CSelectItem key={v}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </CSelectItem>
          ))}
        </CSelect>
        <CInput
          {...register("duration")}
          label={lang === "en" ? "Duration" : "ቆይታ"}
          color="primary"
          value={watch ? watch("duration") : ""}
          placeholder={lang === "en" ? "e.g., 2 hours" : "ለምሳሌ፣ 2 ሰዓት"}
          className="w-full"
        />
        <CInput
          {...register("language")}
          label={lang === "en" ? "Language" : "ቋንቋ"}
          color="primary"
          value={watch ? watch("language") : ""}
          className="w-full"
        />
      </div>
    </div>
  );
}
