"use client";

import React, { useCallback, useEffect, useState } from "react";
import useData from "@/hooks/useData";
import { getOverviewData } from "@/actions/manager/course";
import Loading from "@/components/loading";
import { useParams, useSearchParams } from "next/navigation";
import Overview01 from "../../_components/overview01";
import Overview02 from "../../_components/overview02";
import Overview03 from "../../_components/overview03";

export default function Page() {
  const { id } = useParams<{ id: string }>(),
    searchParams = useSearchParams(),
    getDate = useCallback(() => {
      const startDate = searchParams.get("startDate"),
        endDate = searchParams.get("endDate"),
        now = new Date();

      return {
        start: startDate
          ? new Date(startDate)
          : new Date(now.getFullYear(), now.getMonth(), 1),
        end: endDate
          ? new Date(endDate)
          : new Date(now.getFullYear(), now.getMonth() + 1, 1),
      };
    }, [searchParams]),
    [date, setDate] = useState<ReturnType<typeof getDate>>(getDate),
    { data, loading } = useData({
      func: getOverviewData,
      args: [date, id],
    });

  useEffect(() => {
    setDate(getDate());
  }, [getDate]);

  return loading ? (
    <Loading />
  ) : (
    data && (
      <div className="overflow-auto">
        <div className="py-4 grid gap-4 md:grid-cols-[1fr_auto] ">
          <div className="grid gap-4">
            <Overview01 data={data[0]} />
            <div className="grid gap-4 md:grid-cols-2">
              <Overview02 height={300} data={data[2]} />
              <Overview02 height={300} data={data[3]} />
            </div>
          </div>
          <Overview02 width={400} data={data[1]} />
        </div>
        <Overview03 data={data[4]} />
      </div>
    )
  );
}
