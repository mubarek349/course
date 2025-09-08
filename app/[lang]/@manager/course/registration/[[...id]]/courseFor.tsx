/* eslint-disable @typescript-eslint/no-explicit-any */
import { CInput } from "@/components/heroui";
import { Button } from "@heroui/react";
import { Plus, Trash, Edit } from "lucide-react";
import { useState } from "react";

type TInput = {
  am: string;
  en: string;
};

export default function CourseFor({
  list,
  addValue,
  removeValue,
  updateValue,
  label,
  placeHolderEn,
  placeHolderAm,
}: {
  list: Array<object>;
  addValue: (payload: TInput) => void;
  removeValue: (index: number) => void;
  updateValue?: (index: number, payload: TInput) => void;
  label?: string;
  placeHolderAm?: string;
  placeHolderEn?: string;
}) {
  const [input, setInput] = useState<TInput>({ am: "", en: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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
          type="button"
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
            {editingIndex === index && updateValue ? (
              <EditForm
                initialValues={{
                  am: Object.values(value)[1] as string,
                  en: Object.values(value)[0] as string,
                }}
                onSave={(values) => {
                  updateValue(index, values);
                  setEditingIndex(null);
                }}
                onCancel={() => setEditingIndex(null)}
                placeHolderAm={placeHolderAm}
                placeHolderEn={placeHolderEn}
              />
            ) : (
              <>
                <div className="md:px-2 grid divide-y divide-primary/50">
                  {Object.values(value).map((v, i) => (
                    <p key={i + ""} className="p-2 pl-5 ">
                      {v}
                    </p>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row">
                  {updateValue && (
                    <Button
                      type="button"
                      onPress={() => setEditingIndex(index)}
                      color="primary"
                      variant="light"
                      className="md:h-full md:aspect-square max-md:rounded-b-none md:rounded-r-none"
                    >
                      <Edit className="size-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    onPress={() => removeValue(index)}
                    color="danger"
                    className="md:h-full md:aspect-square max-md:rounded-t-none md:rounded-l-none"
                  >
                    <Trash className="size-5" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EditForm({
  initialValues,
  onSave,
  onCancel,
  placeHolderEn,
  placeHolderAm,
}: {
  initialValues: TInput;
  onSave: (values: TInput) => void;
  onCancel: () => void;
  placeHolderEn?: string;
  placeHolderAm?: string;
}) {
  const [values, setValues] = useState<TInput>(initialValues);

  return (
    <div className="p-3 space-y-2">
      <CInput
        placeholder={placeHolderAm}
        value={values.am}
        onChange={({ target }) =>
          setValues((prev) => ({ ...prev, am: target.value }))
        }
      />
      <CInput
        placeholder={placeHolderEn}
        value={values.en}
        onChange={({ target }) =>
          setValues((prev) => ({ ...prev, en: target.value }))
        }
      />
      <div className="flex gap-2">
        <Button type="button" size="sm" variant="light" onPress={onCancel}>
          Cancel
        </Button>
        <Button 
          type="button"
          size="sm"
          color="primary" 
          onPress={() => onSave(values)}
          isDisabled={!values.am || !values.en}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
