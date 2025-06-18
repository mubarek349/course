"use client";
import React from "react";
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
import { sendMessageToAll } from "@/lib/action/message"; // Import the function
import { getCourses } from "@/lib/data/course";
import Loading from "@/components/loading";
import useAction from "@/hooks/useAction"; // Import useAction hook
import { useParams } from "next/navigation";

const formSchema = z.object({
  courseId: z.array(z.string({ message: "" })),
  message: z.string({ message: "" }).nonempty("Message is required"),
  withUrl: z.coerce.boolean({ message: "" }).optional(),
  url: z.string({ message: "" }).optional(),
  name: z.string({ message: "" }).optional(),
  withSMS: z.coerce.boolean({ message: "" }),
});

export default function Page() {
  const { handleSubmit, register, watch, formState, setValue } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      url: "",
      name: "",
      withSMS: false,
      withUrl: false,
      courseId: [],
    },
  });

  // const [courseOptions, setCourseOptions] = useState([]);

  const {} = useParams<{ lang: string }>(),
    { data, loading } = useData({
      func: getCourses,
      args: [],
    });

  const { action, isPending } = useAction(sendMessageToAll, undefined, {
    loading: "Sending...",
    success: "Message sent successfully",
    error: "Failed to send message",
  });

  const withUrlValue = watch("withUrl");

  console.log(data);

  return loading ? (
    <Loading />
  ) : (
    data && (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Form
          className="w-full max-w-md p-8 bg-white rounded-lg shadow-md"
          validationErrors={Object.entries(formState.errors).reduce(
            (a, [key, value]) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return { ...a, [key]: (value as any).message };
            },
            {}
          )}
          onSubmit={handleSubmit(action)}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Send Message</h2>
          <Textarea
            {...register("message")}
            type="text"
            placeholder="Enter your message"
            className="mb-4"
          />
          <div className="flex items-center mb-4">
            <Checkbox
              checked={watch("withSMS")}
              className="mr-2"
              {...register("withSMS")}
            />
            <label className="text-gray-700">Send with SMS</label>
          </div>
          <div className="flex items-center mb-4">
            <Checkbox
              checked={withUrlValue}
              className="mr-2"
              {...register("withUrl")}
            />
            <label className="text-gray-700">Attach link</label>
          </div>
          {withUrlValue && (
            <div className="flex items-center mb-4">
              <Input
                {...register("url")}
                type="text"
                placeholder="Enter the URL link"
                className="flex-grow mr-2"
              />
              <Input
                {...register("name")}
                type="text"
                placeholder="Enter the URL name"
                className="w-1/3"
              />
            </div>
          )}
          <Select
            className="max-w-xs mb-4"
            label="Select Courses"
            placeholder="Select courses"
            selectionMode="multiple"
            onSelectionChange={(data) => {
              setValue("courseId", Array.from(data) as string[]);
            }}
          >
            {data.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.titleEn}
              </SelectItem>
            ))}
          </Select>
          <Button
            type="submit"
            variant="flat"
            isLoading={isPending}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Submit
          </Button>
        </Form>
      </div>
    )
  );
}
