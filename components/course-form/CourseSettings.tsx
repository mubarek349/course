"use client";
import { UseFormRegister } from "react-hook-form";
import { TCourse } from "@/lib/definations";
import { Switch } from "@heroui/react";
import { CInput, CSelect, CSelectItem } from "../heroui";

interface CourseSettingsProps {
  lang: string;
  register: UseFormRegister<TCourse>;
  channels: { id: string; title: string }[];
  instructors: { id: string; firstName: string; fatherName: string }[];
}

export default function CourseSettings({ 
  lang, 
  register, 
  channels, 
  instructors 
}: CourseSettingsProps) {
  return (
    <>
      <div className="grid md:gap-5 md:grid-cols-3">
        <CInput
          {...register("instructorRate")}
          label={lang === "en" ? "Instructor Rate" : "የመምህር ዋጋ"}
          color="primary"
          type="number"
          endContent={<span>ETB</span>}
        />
        <CInput
          {...register("sellerRate")}
          label={lang === "en" ? "Seller Rate" : "የሻጭ ዋጋ"}
          color="primary"
          type="number"
          endContent={<span>ETB</span>}
        />
        <CInput
          {...register("affiliateRate")}
          label={lang === "en" ? "Affiliate Rate" : "የተባባሪ ዋጋ"}
          color="primary"
          type="number"
          endContent={<span>ETB</span>}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Switch
          {...register("certificate")}
          size="sm"
          className="max-w-full h-fit self-end shrink-0 p-2 rounded-xl bg-foreground/30 border border-foreground/30 data-[selected=true]:border-primary/30 data-[selected=true]:bg-primary/30 flex"
          aria-label={lang === "en" ? "Certificate" : "ሰርተፊኬት"}
        >
          Certificate
        </Switch>
        <CSelect
          color="primary"
          {...register("channelId")}
          label={lang === "en" ? "Channel" : "ቻናል"}
        >
          {channels.map((v) => (
            <CSelectItem key={v.id} textValue={v.title}>{v.title}</CSelectItem>
          ))}
        </CSelect>
        <CSelect
          color="primary"
          {...register("instructorId")}
          label={lang === "en" ? "Instructor" : "መምህር"}
        >
          {instructors.map((v) => (
            <CSelectItem key={v.id} textValue={`${v.firstName} ${v.fatherName}`}>
              {`${v.firstName} ${v.fatherName}`}
            </CSelectItem>
          ))}
        </CSelect>
      </div>
    </>
  );
}