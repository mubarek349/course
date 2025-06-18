import { useParams, useSearchParams } from "next/navigation";

export default function OrderProgressOverviewForSeller({
  totalSales,
  totalIncome,
  thisMonthSales,
  thisMonthIncome,
  thisDaySales,
  thisDayIncome,
}: {
  totalSales: number;
  totalIncome: number;
  thisMonthSales: number;
  thisMonthIncome: number;
  thisDaySales: number;
  thisDayIncome: number;
}) {
  const searchParams = useSearchParams(),
    { lang } = useParams<{ lang: string }>();

  return (
    <div className="md:p-2 grid gap-1 md:gap-4 md:grid-cols-3  ">
      <div className="p-2 bg-primary-600/20 grid grid-cols-2 rounded-md md:rounded-full divide-x-2 divide-primary-600/20 overflow-hidden text-center">
        <div className="p-2 ">
          <p className="text-sm">
            {lang == "en" ? "Total Sales" : "ጠቅላላ ሽያጮች"}
          </p>
          <p className="text-3xl font-extrabold">{totalSales}</p>
        </div>
        <div className="p-2">
          <p className="text-sm">{lang == "en" ? "Total Income" : "ጠቅላላ ገቢ"}</p>
          <p className="flex gap-4 items-center justify-center ">
            <span className="text-3xl font-extrabold">{totalIncome}</span>
            <span className="">ETB</span>
          </p>
        </div>
      </div>
      {/*  */}
      <div className="p-2 bg-primary-600/20 grid grid-cols-2 rounded-md md:rounded-full divide-x-2 divide-primary-600/20 overflow-hidden text-center">
        <div className="p-2  ">
          <p className="text-sm">
            {searchParams.get("date")
              ? new Date(searchParams.get("date")!).toString().slice(3, 7)
              : lang == "en"
              ? "This Month"
              : "የዚህ ወር"}{" "}
            {lang == "en" ? "Sales" : "ሽያጭ"}
          </p>
          <p className="text-3xl font-extrabold">{thisMonthSales}</p>
        </div>
        <div className="p-2 ">
          <p className="text-sm">
            {searchParams.get("date")
              ? new Date(searchParams.get("date")!).toString().slice(3, 7)
              : "This Month"}{" "}
            {lang == "en" ? "Income" : "ገቢ"}
          </p>
          <p className="flex gap-4 items-center justify-center ">
            <span className="text-3xl font-extrabold text-center">
              {thisMonthIncome}
            </span>
            <span className="">ETB</span>
          </p>
        </div>
      </div>
      {/*  */}
      <div className="p-2 bg-primary-600/20 grid grid-cols-2 rounded-md md:rounded-full divide-x-2 divide-primary-600/20 overflow-hidden text-center">
        <div className="p-2  ">
          <p className="text-sm">
            {searchParams.get("date")
              ? `${new Date(searchParams.get("date")!).getDate()}th Day`
              : lang == "en"
              ? "Today"
              : "ዛሬ"}{" "}
            {lang == "en" ? "Sales" : "ሽያጭ"}
          </p>
          <p className="text-3xl font-extrabold">{thisDaySales}</p>
        </div>
        <div className="p-2 ">
          <p className="text-sm">
            {searchParams.get("date")
              ? `${new Date(searchParams.get("date")!).getDate()}th Day`
              : lang == "en"
              ? "Today"
              : "ዛሬ"}{" "}
            {lang == "en" ? "Income" : "ገቢ"}
          </p>
          <p className="flex gap-4 items-center justify-center ">
            <span className="text-3xl font-extrabold text-center">
              {thisDayIncome}
            </span>
            <span className="">ETB</span>
          </p>
        </div>
      </div>
    </div>
  );
}
