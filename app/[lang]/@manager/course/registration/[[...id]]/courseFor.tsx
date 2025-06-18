/* eslint-disable @typescript-eslint/no-explicit-any */
import { CInput } from "@/components/heroui";
import { Button } from "@heroui/react";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";

type TInput = {
  am: string;
  en: string;
};

export default function CourseFor({
  list,
  addValue,
  removeValue,
  label,
  placeHolderEn,
  placeHolderAm,
}: {
  list: Array<object>;
  addValue: (payload: TInput) => void;
  removeValue: (index: number) => void;
  label?: string;
  placeHolderAm?: string;
  placeHolderEn?: string;
}) {
  const [input, setInput] = useState<TInput>({ am: "", en: "" });

  return (
    <div className="p-1 rounded-xl overflow-hidden grid gap-2">
      <p className="">{label}</p>
      <div className="grid md:grid-cols-[1fr_auto]">
        <div className="grid divide-y divide-primary-200">
          <CInput
            color="primary"
            placeholder={placeHolderAm}
            value={input.am}
            onChange={({ target }) =>
              setInput((prev) => ({
                ...prev,
                am: target.value,
              }))
            }
            classNames={{
              inputWrapper:
                "rounded-bl-none max-md:rounded-br-none md:rounded-r-none",
            }}
          />
          <CInput
            color="primary"
            placeholder={placeHolderEn}
            value={input.en}
            onChange={({ target }) =>
              setInput((prev) => ({
                ...prev,
                en: target.value,
              }))
            }
            classNames={{
              inputWrapper:
                "rounded-r-none rounded-tl-none max-md:rounded-bl-none",
            }}
          />
        </div>
        <Button
          onPress={() => {
            addValue(input);
            setInput({ am: "", en: "" });
          }}
          color="success"
          className="md:h-full md:aspect-square max-md:rounded-t-none md:rounded-l-none"
        >
          <Plus className="size-5 " />
        </Button>
      </div>
      <div className="grid gap-2  ">
        {list.map((value, index) => (
          <div
            key={index + ""}
            className="bg-primary/20 rounded-xl grid md:grid-cols-[1fr_auto]"
          >
            <div className="md:px-2 grid divide-y divide-primary/50">
              {Object.values(value).map((v, i) => (
                <p key={i + ""} className="p-2 pl-5 ">
                  {v}
                </p>
              ))}
            </div>
            <Button
              onPress={() => removeValue(index)}
              color="danger"
              className="md:h-full md:aspect-square max-md:rounded-t-none md:rounded-l-none"
            >
              <Trash className="size-5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
