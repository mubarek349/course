import { cn } from "@/lib/utils";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@heroui/react";

export default function CourseAbout({ data }: { data: string }) {
  const { lang } = useParams<{ lang: string }>(),
    [more, setMore] = useState(false);

  return (
    <div className="">
      <div className="pb-5 grid grid-cols-[1fr_auto] items-center">
        <p className="md:text-2xl font-extrabold">
          {lang == "en" ? "About the Course" : "ስለ ትምህርቱ"}
        </p>
        <Button
          variant="flat"
          color="primary"
          startContent={<Share2 className="size-5" />}
        >
          {lang == "en" ? "share" : "አጋራ"}
        </Button>
      </div>
      <div className="">
        <p className={cn(more ? "" : "line-clamp-3")}>{data}</p>
        <Button
          variant="light"
          color="primary"
          onPress={() => setMore((prev) => !prev)}
        >
          {more
            ? lang == "en"
              ? "hide more"
              : "የበለጠ ደብቅ"
            : lang == "en"
            ? "show more"
            : "ተጨማሪ አሳይ"}
        </Button>
      </div>
    </div>
  );
}
