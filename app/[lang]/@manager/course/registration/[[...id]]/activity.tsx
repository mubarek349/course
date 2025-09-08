import { Plus, Trash, BookOpen, List } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Button, cn, Card, CardBody, CardHeader, Divider } from "@heroui/react";
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
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  return (
    <Card className={cn("w-full", errorMessage && "border-danger-300")}>
      <CardHeader className="flex gap-3">
        <BookOpen className="size-6 text-primary" />
        <div className="flex flex-col">
          <p className="text-lg font-semibold">{lang === "en" ? "Course Activities" : "የኮርስ እንቅስቃሴዎች"}</p>
          <p className="text-sm text-default-500">{lang === "en" ? "Add modules and lessons" : "ሞጁሎች እና ትምህርቶች ይጨምሩ"}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-6">
        <Add
          add={addActivity}
          label={lang === "en" ? "Add New Module" : "አዲስ ሞጁል ይጨምሩ"}
          placeHolderEn={lang === "en" ? "Module title in English" : "የሞጁል ርዕስ በእንግሊዝኛ"}
          placeHolderAm={lang === "en" ? "Module title in Amharic" : "የሞጁል ርዕስ በአማርኛ"}
        />
        
        <div className="space-y-4">
          {list.map(({ subActivity, ...value }, index) => (
            <Card key={index} className="border border-primary-200 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 w-full">
                  <List className="size-5 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {lang === "en" ? "Module" : "ሞጁል"} {index + 1}
                  </span>
                </div>
              </CardHeader>
              <CardBody className="pt-0 space-y-4">
                <Item 
                  value={value} 
                  remove={() => {
                    const confirmMessage = lang === "en" 
                      ? "Are you sure you want to delete this module?"
                      : "ይህን ሞጁል መሰረዝ እርግጠኛ ነዎት?";
                    if (confirm(confirmMessage)) {
                      removeActivity(index);
                    }
                  }} 
                />
                
                <div className="ml-4 pl-4 border-l-2 border-primary-200 space-y-3">
                  <Add
                    add={(input) => addSubActivity(index, input)}
                    label={lang === "en" ? "Add Lesson" : "ትምህርት ይጨምሩ"}
                    placeHolderEn={lang === "en" ? "Lesson title in English" : "የትምህርት ርዕስ በእንግሊዝኛ"}
                    placeHolderAm={lang === "en" ? "Lesson title in Amharic" : "የትምህርት ርዕስ በአማርኛ"}
                    isSubItem
                  />
                  {subActivity.map((v, i) => (
                    <Item
                      key={i}
                      value={v}
                      remove={() => {
                        const confirmMessage = lang === "en" 
                          ? "Are you sure you want to delete this lesson?"
                          : "ይህን ትምህርት መሰረዝ እርግጠኛ ነዎት?";
                        if (confirm(confirmMessage)) {
                          removeSubActivity(index, i);
                        }
                      }}
                      isSubItem
                    />
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function Add({
  add,
  label,
  placeHolderEn,
  placeHolderAm,
  isSubItem = false,
}: {
  add: (payload: TInput) => void;
  label?: string;
  placeHolderAm?: string;
  placeHolderEn?: string;
  isSubItem?: boolean;
}) {
  const [input, setInput] = useState<TInput>({ am: "", en: "" });
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={cn("space-y-3", isSubItem && "bg-gray-50 p-3 rounded-lg")}>
      {!isExpanded ? (
        <Button
          variant="bordered"
          color="primary"
          onPress={() => setIsExpanded(true)}
          className="w-full justify-start"
          startContent={<Plus className="size-4" />}
        >
          {label}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">{label}</p>
            <Button
              size="sm"
              variant="light"
              onPress={() => {
                setIsExpanded(false);
                setInput({ am: "", en: "" });
              }}
            >
              Cancel
            </Button>
          </div>
          
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <CInput
              size="sm"
              placeholder={placeHolderAm}
              value={input.am}
              onChange={({ target }) => setInput(prev => ({ ...prev, am: target.value }))}
              label="Amharic"
            />
            <CInput
              size="sm"
              placeholder={placeHolderEn}
              value={input.en}
              onChange={({ target }) => setInput(prev => ({ ...prev, en: target.value }))}
              label="English"
            />
            <Button
              color="success"
              onPress={() => {
                if (input.am && input.en) {
                  add(input);
                  setInput({ am: "", en: "" });
                  setIsExpanded(false);
                }
              }}
              isDisabled={!input.am || !input.en}
              className="self-end"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Item({ value, remove, isSubItem = false }: { value: object; remove: () => void; isSubItem?: boolean }) {
  return (
    <div className={cn(
      "bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20",
      "flex items-center justify-between p-3",
      isSubItem && "bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20"
    )}>
      <div className="flex-1 space-y-1">
        {Object.values(value).map((v, i) => (
          <p key={i} className={cn(
            "text-sm",
            i === 0 ? "font-medium text-gray-800" : "text-gray-600"
          )}>
            {v}
          </p>
        ))}
      </div>
      <Button
        size="sm"
        variant="light"
        color="danger"
        onPress={remove}
        isIconOnly
      >
        <Trash className="size-4" />
      </Button>
    </div>
  );
}
