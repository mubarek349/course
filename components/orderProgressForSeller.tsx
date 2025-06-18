import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import { useSession } from "next-auth/react";
import Modal from "./oldUI/modal";
import { useState } from "react";
import Input from "./oldUI/input";
import { z } from "zod";
import useAction from "@/hooks/useAction";
import { changeRate } from "@/lib/action/course";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function OrderProgressForSeller({
  id,
  titleEn,
  titleAm,
  incomeRate,
  totalSales,
  totalIncome,
  thisMonthSales,
  thisMonthIncome,
  thisDaySales,
  thisDayIncome,
  refresh,
}: {
  id: string;
  titleEn: string;
  titleAm: string;
  incomeRate?: { id: string; rate: number } | undefined;
  totalSales: number;
  totalIncome: number;
  thisMonthSales: number;
  thisMonthIncome: number;
  thisDaySales: number;
  thisDayIncome: number;
  refresh?: () => void;
}) {
  const searchParams = useSearchParams(),
    { lang } = useParams<{ lang: string }>(),
    { data } = useSession();

  return (
    <div className="bg-primary-600/20 rounded-xl border border-primary-600/20 overflow-hidden grid gap-2 grid-rows-[1fr_auto]">
      <div className="p-2 ">
        {data?.user?.role == "manager" ? (
          <Rate incomeRate={incomeRate} courseId={id} refresh={refresh} />
        ) : (
          incomeRate?.rate && (
            <div className="inline-block mr-2 p-2 bg-primary/50 rounded-md">
              {incomeRate?.rate} ETB
            </div>
          )
        )}
        <Link href={`/courses/${id}`} className="">
          {lang == "en" ? titleEn : titleAm}
        </Link>
      </div>
      <div className="px-2 grid divide-y-2 divide-primary-600/10 bg-white/30 rounded-xl">
        <div className="grid grid-cols-3">
          <p className="p-2 " />
          <p className="p-2 text-center">{lang == "en" ? "Sales" : "ሽያጭ"}</p>
          <p className="p-2 text-center">{lang == "en" ? "Income" : "ገቢ"}</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="p-2 ">{lang == "en" ? "Total" : "ጠቅላላ"}</p>
          <p className="p-2 text-center">{totalSales}</p>
          <p className="p-2 text-center space-x-2 ">
            <span className="">{totalIncome}</span>
            <span className="">ETB</span>
          </p>
        </div>
        <div className="grid grid-cols-3">
          <p className="p-2 ">
            {searchParams.get("date")
              ? new Date(searchParams.get("date")!).toString().slice(3, 7)
              : lang == "en"
              ? "This Month"
              : "በዚህ ወር"}
          </p>
          <p className="p-2 text-center">{thisMonthSales}</p>
          <p className="p-2 text-center space-x-2 ">
            <span className="">{thisMonthIncome}</span>
            <span className="">ETB</span>
          </p>
        </div>
        <div className="grid grid-cols-3">
          <p className="p-2 ">
            {searchParams.get("date")
              ? `${new Date(searchParams.get("date")!).getDate()}${
                  lang == "en" ? "th Day" : "ኛ ቀን"
                }`
              : lang == "en"
              ? "Today"
              : "ዛሬ"}
          </p>
          <p className="p-2 text-center">{thisDaySales}</p>
          <p className="p-2 text-center space-x-2 ">
            <span className="">{thisDayIncome}</span>
            <span className="">ETB</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Rate({
  incomeRate,
  courseId,
  refresh,
}: {
  incomeRate: { id: string; rate: number } | undefined;
  courseId: string;
  refresh?: () => void;
}) {
  const { id } = useParams<{ id: string }>(),
    [open, setOpen] = useState(false),
    formSchema = z.object({
      userId: z.string({ message: "" }).nonempty(""),
      courseId: z.string({ message: "" }).nonempty(""),
      rate: z.coerce.number({ message: "" }).gte(0, ""),
    }),
    { handleSubmit, control } = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        userId: id,
        courseId,
        rate: incomeRate ? incomeRate.rate : 0,
      },
    }),
    { action } = useAction(changeRate, undefined, {
      onSuccess() {
        setOpen(false);
        refresh?.();
      },
    });

  return (
    <div className="inline-block">
      <button
        onClick={() => setOpen(true)}
        className="mr-2 p-2 bg-primary/50 rounded-md"
      >
        Special Rate : {incomeRate ? incomeRate.rate + " ETB" : "none"}
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <form
          onSubmit={handleSubmit(action)}
          className="w-96 p-5 bg-background rounded-md"
        >
          <p className="p-2 ">Rate change</p>
          <div className="grid gap-4 ">
            <Input control={control} name="rate" placeholder="Rate ETB" />
            <button className="btn-primary">submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
