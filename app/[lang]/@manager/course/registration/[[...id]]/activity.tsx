import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Button, cn } from "@heroui/react";
import { CInput } from "@/components/heroui";

type TInput = {
  am: string;
  en: string;
};

export default function Activity({
  list,
  addActivity,
  addSubActivity,
  removeActivity,
  removeSubActivity,
  errorMessage,
}: {
  list: {
    titleEn: string;
    titleAm: string;
    subActivity: { titleEn: string; titleAm: string }[];
  }[];
  addActivity: (payload: TInput) => void;
  addSubActivity: (activityIndex: number, payload: TInput) => void;
  removeActivity: (index: number) => void;
  removeSubActivity: (activityIndex: number, subActivityIndex: number) => void;
  errorMessage: string;
}) {
  const { lang } = useParams<{ lang: string }>();
  return (
    <div className={cn("space-y-2 ", errorMessage ? "bg-danger" : "")}>
      <Add
        add={addActivity}
        label={lang == "en" ? "Activity" : "እንቅስቃሴ"}
        placeHolderEn={
          lang == "en"
            ? "type here the activity in english"
            : "እንቅስቃሴ በእንግሊዝኛ እዚህ ይፅፃፉ"
        }
        placeHolderAm={
          lang == "en"
            ? "type here the activity in amharic"
            : "እንቅስቃሴ በአማርኛ  እዚህ ይፅፃፉ"
        }
      />
      <div className="space-y-2 ">
        {list.map(({ subActivity, ...value }, index) => (
          <div
            key={index + ""}
            className="p-1 border border-primary-300 rounded-xl"
          >
            <Item value={value} remove={() => removeActivity(index)} />
            <div className="pl-4 space-y-2">
              <Add
                add={(input) => addSubActivity(index, input)}
                label={lang == "en" ? "Sub Activity" : "ንዑስ እንቅስቃሴ"}
                placeHolderEn={
                  lang == "en"
                    ? "type here the sub activity in english"
                    : "ንዑስ እንቅስቃሴ በእንግሊዝኛ እዚህ ይፅፃፉ"
                }
                placeHolderAm={
                  lang == "en"
                    ? "type here the sub activity in amharic"
                    : "ንዑስ እንቅስቃሴ በአማርኛ  እዚህ ይፅፃፉ"
                }
              />
              {subActivity.map((v, i) => (
                <Item
                  key={i + ""}
                  value={v}
                  remove={() => removeSubActivity(index, i)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Add({
  add,
  label,
  placeHolderEn,
  placeHolderAm,
}: {
  add: (payload: TInput) => void;
  label?: string;
  placeHolderAm?: string;
  placeHolderEn?: string;
}) {
  const [input, setInput] = useState<TInput>({ am: "", en: "" });
  return (
    <div className="grid">
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
            add(input);
            setInput({ am: "", en: "" });
          }}
          color="success"
          className="md:h-full md:aspect-square max-md:rounded-t-none md:rounded-l-none"
        >
          <Plus className="size-4 " />
        </Button>
      </div>
    </div>
  );
}

function Item({ value, remove }: { value: object; remove: () => void }) {
  return (
    <div className="bg-primary/20 rounded-xl grid md:grid-cols-[1fr_auto]">
      <div className="md:px-2 grid divide-y divide-primary/50">
        {Object.values(value).map((v, i) => (
          <p key={i + ""} className="p-2 pl-5 ">
            {v}
          </p>
        ))}
      </div>
      <Button
        onPress={remove}
        color="danger"
        className="md:h-full md:aspect-square max-md:rounded-t-none md:rounded-l-none"
      >
        <Trash className="size-4" />
      </Button>
    </div>
  );
}
