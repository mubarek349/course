"use client";

import React, { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
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
  const params = useParams<{ lang: string }>(),
    lang = params?.lang ?? "en",
    searchParams = useSearchParams(),
    { handleSubmit, register, formState } = useForm<z.infer<typeof formSchema>>(
      {
        resolver: zodResolver(formSchema),
        defaultValues: { userName: "", password: "" },
      }
    ),
    router = useRouter(),
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
    if (searchParams !== null) {
      const userName = searchParams.get("u"),
        password = searchParams.get("p");
      if (userName && password) {
        action({ userName, password });
      }
    }
  }, [searchParams]);

  const handleForgotPassword = () => {
    router.push(`/${lang}/forgetPassword`);
  };

  const handleSignUp = () => {
    router.push(`/${lang}/signup`);
  };

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
          <p className="text-sm text-center text-gray-600 mt-2">
            {lang == "en" ? (
              <>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-primary hover:underline mr-2"
                >
                  Forgot Password?
                </button>
                If you don&apos;t have an account, please{" "}
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="text-primary hover:underline"
                >
                  register
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-primary hover:underline mr-2"
                >
                  የይለፍ ቃል ረሳሁ?
                </button>
                ምልክት ካላደረጉ{" "}
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="text-primary hover:underline"
                >
                  ይመዝገቡ
                </button>
              </>
            )}
          </p>
        </div>
      </Form>
    </div>
  );
}
