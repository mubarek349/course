"use client";

import React, { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAction from "@/hooks/useAction";
import { authenticate } from "@/lib/action/user";
import { CButton } from "@/components/heroui";
import { Form, Input } from "@heroui/react";

const formSchema = z.object({
  userName: z.string({ message: "" }).nonempty("User Name is required"),
  password: z.string({ message: "" }).nonempty("Password is required"),
});

export default function Page() {
  const { lang } = useParams<{ lang: string }>(),
    searchParams = useSearchParams(),
    { handleSubmit, register, formState } = useForm<z.infer<typeof formSchema>>(
      {
        resolver: zodResolver(formSchema),
        defaultValues: { userName: "", password: "" },
      }
    ),
    // router = useRouter(),
    { action, isPending } = useAction(authenticate, undefined, {
      onSuccess(state) {
        if (state.status) {
          // router.replace(`/${lang}/`);
        } else {
        }
      },
      success: lang == "en" ? "Successfully logged in" : "በተሳካ ሁኔታ ገብተዋል",
      error: lang == "en" ? "Logged in failed" : "መግባት አልተሳካም",
    });

  useEffect(() => {
    const userName = searchParams.get("u"),
      password = searchParams.get("p");
    if (userName && password) {
      action({ userName, password });
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
        <div className=" grid gap-4 auto-rows-min">
          <Input
            color="primary"
            {...register("userName")}
            placeholder={lang == "en" ? "username" : "የተጠቃሚ ስም"}
          />
          <Input
            color="primary"
            {...register("password")}
            type="password"
            placeholder={lang == "en" ? "password" : "የይለፍ ቃል"}
          />
          <CButton type="submit" color="primary" isLoading={isPending}>
            {lang == "en" ? "Login" : "ይግቡ"}
          </CButton>
        </div>
      </Form>
    </div>
  );
}
