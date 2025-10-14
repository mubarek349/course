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
    <div className="space-y-4">
      {/* Add New Item Section */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl border-2 border-dashed border-primary-300 p-4 sm:p-5">
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary-500" />
          {label}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
            <div className="relative">
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                Amharic (አማርኛ)
              </label>
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
                  inputWrapper: "bg-white border-primary-200 hover:border-primary-400"
                }}
              />
            </div>
            <div className="relative">
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                English
              </label>
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
                  inputWrapper: "bg-white border-primary-200 hover:border-primary-400"
                }}
              />
            </div>
          </div>
          <Button
            type="button"
            onPress={() => {
              addValue(input);
              setInput({ am: "", en: "" });
            }}
            color="success"
            isDisabled={!input.am || !input.en}
            className="sm:self-end h-12 sm:h-auto sm:min-h-[44px] sm:px-6 font-semibold shadow-md hover:shadow-lg transition-all"
            startContent={<Plus className="w-5 h-5" />}
          >
            Add
          </Button>
        </div>
      </div>
      <div className="grid gap-3">
        {list.map((value, index) => (
          <div
            key={index + ""}
            className="bg-gradient-to-br from-primary-50/50 to-primary-100/30 rounded-xl border border-primary-200/50 overflow-hidden hover:shadow-md transition-all duration-200"
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
              <div className="flex flex-col md:flex-row">
                {/* Text Content - Takes available space */}
                <div className="flex-1 min-w-0 p-4 space-y-2">
                  {Object.values(value).map((v, i) => (
                    <div key={i + ""} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-500/20 text-primary-700 text-xs flex items-center justify-center font-semibold mt-0.5">
                        {i === 0 ? "አ" : "E"}
                      </span>
                      <p className="text-sm text-gray-800 leading-relaxed break-words flex-1">
                        {v}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Action Buttons - Fixed width, always visible */}
                <div className="flex md:flex-col border-t md:border-t-0 md:border-l border-primary-200/50 bg-white/50">
                  {updateValue && (
                    <Button
                      type="button"
                      onPress={() => setEditingIndex(index)}
                      color="primary"
                      variant="light"
                      isIconOnly
                      className="flex-1 md:flex-none h-12 md:h-1/2 rounded-none hover:bg-primary-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    onPress={() => removeValue(index)}
                    color="danger"
                    variant="light"
                    isIconOnly
                    className="flex-1 md:flex-none h-12 md:h-1/2 rounded-none hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
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
    <div className="p-4 sm:p-5 space-y-4 bg-white/70">
      <div className="space-y-3">
        <div className="relative">
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            Amharic (አማርኛ)
          </label>
          <CInput
            placeholder={placeHolderAm}
            value={values.am}
            onChange={({ target }) =>
              setValues((prev) => ({ ...prev, am: target.value }))
            }
            classNames={{
              inputWrapper: "border-primary-200 hover:border-primary-400"
            }}
          />
        </div>
        <div className="relative">
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            English
          </label>
          <CInput
            placeholder={placeHolderEn}
            value={values.en}
            onChange={({ target }) =>
              setValues((prev) => ({ ...prev, en: target.value }))
            }
            classNames={{
              inputWrapper: "border-primary-200 hover:border-primary-400"
            }}
          />
        </div>
      </div>
      <div className="flex gap-2 pt-2 border-t border-gray-200">
        <Button 
          type="button" 
          size="sm" 
          variant="flat" 
          onPress={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          type="button"
          size="sm"
          color="primary" 
          onPress={() => onSave(values)}
          isDisabled={!values.am || !values.en}
          className="flex-1"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
