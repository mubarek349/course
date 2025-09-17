"use client";

import { getPermission } from "@/actions/manager/manager";
import useData from "@/hooks/useData";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
 const params= useParams<{ lang: string }>();
         const lang = params?.lang || "en",
    router = useRouter();
  useData({
    func: getPermission,
    args: [],
    onSuccess(data) {
      if (data.length > 0) {
        const temp = data.map((v) => v.permission)[0] ?? "";
        router.replace(`/${lang}/${temp}`);
      }
    },
  });

  return <div className="grid place-content-center "></div>;
}
