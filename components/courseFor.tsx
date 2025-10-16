import { useParams } from "next/navigation";

export default function CourseFor({
  data,
}: {
  data: { courseForEn: string; courseForAm: string }[];
}) {
  const params = useParams<{ lang: string }>();
             const lang = params?.lang || "en";
  return (
    <div className="">
      <p className="pb-2 md:text-2xl font-extrabold ">
        {lang == "en" ? "Who is this course for?" : "ይህ ኮርስ ለማን ነው?"}
      </p>
      <ul className="list-['a']- list-disc list-inside ">
        {data.map(({ courseForEn, courseForAm }, i) => (
          <li key={i + ""} className="break-words overflow-wrap-anywhere">
            {lang == "en" ? courseForEn : courseForAm}
          </li>
        ))}
      </ul>
    </div>
  );
}
