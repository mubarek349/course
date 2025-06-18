"use client";

import { CInput, CSelect, CSelectItem } from "@/components/heroui";
import useAction from "@/hooks/useAction";
import { sendOTP } from "@/lib/action";
import { affiliateRegistration } from "@/lib/action/course";
import { TAffiliateSelf } from "@/lib/definations";
import { cn } from "@/lib/utils";
import { affiliateSchemaSelf } from "@/lib/zodSchema";
import { Button, Form } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm, Controller } from "react-hook-form";

export default function Page() {
  const { lang } = useParams<{ lang: string }>(),
    { handleSubmit, register, formState, control, setValue, watch, trigger } =
      useForm<TAffiliateSelf>({
        resolver: zodResolver(affiliateSchemaSelf),
        defaultValues: {
          firstName: "",
          fatherName: "",
          lastName: "",
          gender: "Female",
          age: "",
          country: "",
          region: "",
          city: "",
          idCard: "",
          phoneNumber: "",
          code: "",
          password: "",
        },
      }),
    router = useRouter(),
    { action, isPending } = useAction(affiliateRegistration, undefined, {
      success: "Successfully registered",
      error: "Failed to registered",
      onSuccess({ status }) {
        if (status) {
          router.push(`/${lang}/login`);
        }
      },
    }),
    { action: codeAction, isPending: codePending } = useAction(
      sendOTP,
      undefined,
      {
        success: lang == "en" ? "OTP sent successfully." : "OTP በተሳካ ሁኔታ ተልኳል",
      }
    );

  return (
    <div className="h-dvh px-2 pt-20 pb-20 md:pb-4 grid md:items-center md:justify-center overflow-auto ">
      <Form
        onSubmit={handleSubmit(action)}
        validationErrors={Object.entries(formState.errors).reduce(
          (a, [key, value]) => {
            return { ...a, [key]: value.message };
          },
          {}
        )}
        className="p-5 bg-background rounded-md shadow-md "
      >
        <p className="w-full pb-5 text-xl text-center font-semibold ">
          {lang == "en" ? "Affiliate Registration" : "የተባባሪ ምዝገባ"}
        </p>
        <div className="w-full grid gap-2 md:grid-cols-[1fr_3fr] ">
          <Controller
            control={control}
            name="idCard"
            render={({ field: { value, name }, fieldState }) => (
              <label
                className={cn(
                  "md:w-56 aspect-square md:place-self-center grid grid-rows-[1fr_auto]   "
                )}
              >
                <input
                  type="file"
                  accept="image/png,jpg,jpeg"
                  className="hidden"
                  onChange={async ({ target }) => {
                    if (target.files?.[0]) {
                      setValue(
                        name,
                        Buffer.from(
                          await target.files[0].arrayBuffer()
                        ).toString("base64"),
                        { shouldValidate: true }
                      );
                    } else {
                      setValue(name, "", { shouldValidate: true });
                    }
                  }}
                />
                {value ? (
                  <Image
                    src={
                      value
                        ? `data:image/png;base64,${value}`
                        : "/darulkubra.png"
                    }
                    alt=""
                    height={1000}
                    width={1000}
                    className={cn(
                      "size-full overflow-hidden object-contain rounded-xl bg-primary-50 border-2 border-primary-200 "
                    )}
                  />
                ) : (
                  <div
                    className={cn(
                      "rounded-xl border-2 grid place-content-center ",
                      fieldState.invalid || fieldState.error
                        ? "bg-danger-50 border-danger-200 "
                        : "bg-primary-50 border-primary-200 "
                    )}
                  >
                    <p className="">
                      {lang == "en" ? "Upload ID card" : "መታወቂያ ካርድ ይጫኑ"}
                    </p>
                  </div>
                )}
                {(fieldState.invalid || fieldState.error) && (
                  <p className={cn("pt-1 text-xs text-center text-danger")}>
                    {fieldState.error?.message || ""}
                  </p>
                )}
              </label>
            )}
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <CInput
              {...register("firstName")}
              label={lang == "en" ? "First Name" : "የመጀመሪያ ስም"}
              autoFocus
            />
            <CInput
              {...register("fatherName")}
              label={lang == "en" ? "Father Name" : "የአባት ስም"}
            />
            <CInput
              {...register("lastName")}
              label={lang == "en" ? "Last Name" : "የአያት ስም"}
            />
            <CInput
              {...register("country")}
              label={lang == "en" ? "Country" : "ሀገር"}
            />
            <CInput
              {...register("region")}
              label={lang == "en" ? "Region" : "ክልል"}
            />
            <CInput
              {...register("city")}
              label={lang == "en" ? "City" : "ከተማ"}
            />
            <CSelect
              {...register("gender")}
              label={lang == "en" ? "Gender" : "ፆታ"}
            >
              {["Female", "Male"].map((v) => (
                <CSelectItem key={v}>{v}</CSelectItem>
              ))}
            </CSelect>
            <CInput {...register("age")} label={lang == "en" ? "Age" : "እድሜ"} />
            <div className="grid grid-cols-[1fr_auto]">
              <CInput
                {...register("phoneNumber")}
                label={lang == "en" ? "Phone Number" : "ስልክ ቁጥር"}
                classNames={{
                  base: "min-w-40-",
                  inputWrapper: "rounded-r-none",
                }}
              />
              <Button
                color="primary"
                type="button"
                isLoading={codePending}
                onPress={() =>
                  ((phoneNumber) => {
                    if (phoneNumber) {
                      codeAction({ phoneNumber });
                    }
                    trigger("phoneNumber");
                  })(watch("phoneNumber"))
                }
                className="h-full rounded-l-none"
              >
                {lang == "en" ? "code" : "ኮድ"}
              </Button>
            </div>
            <CInput
              {...register("password")}
              label={lang == "en" ? "Password" : "የይለፍ ቃል"}
            />
            <CInput
              {...register("code")}
              label={lang == "en" ? "Code" : "ኮድ"}
            />
            <Button type="submit" color="primary" isLoading={isPending}>
              {lang == "en" ? "Register" : "ተመዝገብ"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
