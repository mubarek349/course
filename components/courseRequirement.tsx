import { useParams } from "next/navigation";

export default function CourseRequirement({
  data,
}: {
  data: { requirementEn: string; requirementAm: string }[];
}) {
  const { lang } = useParams<{ lang: string }>();

  return (
    <div className="">
      <p className="pb-2 md:text-2xl font-extrabold">
        {lang == "en" ? "Requirements" : "መስፈርቶች"}
      </p>
      <ul className="list-['a']- list-disc list-inside ">
        {data.map(({ requirementEn, requirementAm }, i) => (
          <li key={i + ""} className="">
            {lang == "en" ? requirementEn : requirementAm}
          </li>
        ))}
      </ul>
    </div>
  );
}
