import { useParams } from "next/navigation";

export default function CourseRequirement({
  data,
}: {
  data: { requirementEn: string; requirementAm: string }[];
}) {
  const params = useParams<{ lang: string }>();
             const lang = params?.lang || "en";

  return (
    <div className="">
      <p className="pb-2 md:text-2xl font-extrabold">
        {lang == "en" ? "Requirements" : "መስፈርቶች"}
      </p>
      <ul className="list-['a']- list-disc list-inside ">
        {data.map(({ requirementEn, requirementAm }, i) => (
          <li key={i + ""} className="break-words overflow-wrap-anywhere">
            {lang == "en" ? requirementEn : requirementAm}
          </li>
        ))}
      </ul>
    </div>
  );
}
