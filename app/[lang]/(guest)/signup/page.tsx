"use client";

import React, { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAction from "@/hooks/useAction";
import { signup } from "@/lib/action/user";

// Ensure signup returns StateType:
// type StateType = { status: true; message: string } | { status: false; cause: string; message: string };
import { CButton } from "@/components/heroui";
import { Form, Input } from "@heroui/react";

const formSchema = z.object({
  phoneNumber: z.string({ message: "" }).nonempty("Phone number is required"),
  password: z.string({ message: "" }).nonempty("Password is required"),
  confirmPassword: z
    .string({ message: "" })
    .nonempty("confirm password  is matched"),
});

export default function Page() {
  const params = useParams<{ lang: string }>(),
    lang = params?.lang ?? "en",
    searchParams = useSearchParams(),
    { handleSubmit, register, formState } = useForm<z.infer<typeof formSchema>>(
      {
        resolver: zodResolver(formSchema),
        defaultValues: { phoneNumber: "", password: "", confirmPassword: "" },
      }
    ),
    // router = useRouter(),
    { action, isPending } = useAction(signup, undefined, {
      onSuccess(state) {
        if (state.status) {
          // router.replace(`/${lang}/`);
        } else {
        }
      },
      success: lang == "en" ? "Successfully registered" : "በተሳካ ሁኔታ ተመዝግበዋል",
      error: lang == "en" ? "Registration failed" : "መመዝገብ አልተሳካም",
    });

  useEffect(() => {
    const phoneNumber = searchParams?.get("u"),
      password = searchParams?.get("p"),
      confirmPassword = searchParams?.get("cp");
    if (phoneNumber && password && confirmPassword) {
      action({ phoneNumber, password, confirmPassword });
    }
  }, []);

  return (
    <div className="h-dvh p-4 grid content-center md:justify-center">
      <Form
        onSubmit={handleSubmit(action)}
        validationErrors={Object.entries(formState.errors).reduce(
          (a, [key, { message }]) => {
            return { ...a, [key]: message };
          },
          {}
        )}
        className="w-full md:w-96 py-10 px-5 md:px-10 bg-background shadow shadow-primary-200 rounded-xl grid gap-5"
      >
        <div className="grid place-content-center">
          <Logo />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">
          {lang == "en" ? "Student Registration" : "የተማሪ መመዝገቢያ"}
        </h2>
        <div className=" grid gap-4 auto-rows-min">
          <Input
            color="primary"
            {...register("phoneNumber")}
            placeholder={lang == "en" ? "Phone number" : "የስልክ ቁጥር"}
          />
          <Input
            color="primary"
            {...register("password")}
            type="password"
            placeholder={lang == "en" ? "password" : "የይለፍ ቃል"}
          />
          <Input
            color="primary"
            {...register("confirmPassword")}
            type="password"
            placeholder={lang == "en" ? "Confirm password" : "የይለፍ ቃል አረጋግጥ"}
          />
          <CButton type="submit" color="primary" isLoading={isPending}>
            {lang == "en" ? "Sign up" : "ይመዝገቡ"}
          </CButton>
        </div>
      </Form>
    </div>
  );
}
