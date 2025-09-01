"use client";
import { UseFormRegister } from "react-hook-form";
import { TCourse } from "@/lib/definations";
import { CInput, CSelect, CSelectItem, CTextarea } from "../heroui";

interface CourseBasicInfoProps {
  lang: string;
  register: UseFormRegister<TCourse>;
}

export default function CourseBasicInfo({ lang, register }: CourseBasicInfoProps) {
  return (
    <>
      <div className="grid md:gap-5 md:grid-cols-[1fr_1fr_auto]">
        <CInput
          label={lang === "en" ? "Title : English" : "ርዕስ : እንግሊዝኛ"}
          color="primary"
          {...register("titleEn")}
        />
        <CInput
          label={lang === "en" ? "Title : Amharic" : "ርዕስ : አማርኛ"}
          color="primary"
          {...register("titleAm")}
        />
        <CInput
          label={lang === "en" ? "Price" : "ዋጋ"}
          type="number"
          color="primary"
          {...register("price")}
          endContent={<span>ETB</span>}
        />
      </div>
      <div className="space-y-5">
        <CTextarea
          {...register("aboutEn")}
          label={lang === "en" ? "About the course : English" : "ስለ ኮርሱ : እንግሊዝኛ"}
          color="primary"
        />
        <CTextarea
          {...register("aboutAm")}
          label={lang === "en" ? "About the course : Amharic" : "ስለ ኮርሱ : አማርኛ"}
          color="primary"
        />
      </div>
      <div className="grid md:gap-5 md:grid-cols-3">
        <CSelect
          {...register("level")}
          label={lang === "en" ? "Level" : "ደረጃ"}
          color="primary"
        >
          {["beginner", "intermediate", "advanced"].map((v) => (
            <CSelectItem key={v}>{v}</CSelectItem>
          ))}
        </CSelect>
        <CInput
          {...register("duration")}
          label={lang === "en" ? "Duration" : "ቆይታ"}
          color="primary"
        />
        <CInput
          {...register("language")}
          label={lang === "en" ? "Language" : "ቋንቋ"}
          color="primary"
        />
      </div>
    </>
  );
}