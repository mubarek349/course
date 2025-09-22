"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Calendar, TrendingUp } from "lucide-react";
import { Button } from "@heroui/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/layout/Section";
import Overview01 from "../_components/overview01";
import Overview02 from "../_components/overview02";
import Overview03 from "../_components/overview03";
import { getOverviewData } from "@/actions/manager/course";
import useData from "@/hooks/useData";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams(),
    getDate = useCallback(() => {
      const startDate = searchParams?.get("startDate"),
        endDate = searchParams?.get("endDate"),
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
      args: [date],
    });

  useEffect(() => {
    const value = getDate();
    setDate(value);
  }, [getDate]);

  // Loading state
  if (loading) {
    return (
      <div className="h-full overflow-y-auto px-4 md:px-8 py-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <PageHeader
            title="Manager Dashboard"
            subtitle="Loading analytics and overview data..."
          />
          <div className="space-y-6">
            <div className="card p-6">
              <div className="h-32 skeleton" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <div className="h-64 skeleton" />
              </div>
              <div className="card p-6">
                <div className="h-64 skeleton" />
              </div>
            </div>
            <div className="card p-6">
              <div className="h-48 skeleton" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="h-full overflow-y-auto px-4 md:px-8 py-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <PageHeader
            title="Manager Dashboard"
            subtitle="No data available at the moment."
          />
          <div className="card p-8 text-center">
            <TrendingUp className="size-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              No Data Available
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              There's no analytics data to display for the selected period.
            </p>
            <Button
              color="primary"
              variant="flat"
              onPress={() => window.location.reload()}
            >
              Refresh Data
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success state with data
  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader
          title="Manager Dashboard"
          subtitle="Comprehensive overview of platform analytics and performance metrics."
          actions={
            <Button
              color="primary"
              variant="flat"
              startContent={<Calendar className="size-4" />}
              size="sm"
            >
              Filter by Date
            </Button>
          }
        />
        
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-[1fr_auto]">
            <div className="grid gap-6">
              <Section>
                <Overview01 data={data[0]} />
              </Section>
              <div className="grid gap-6 md:grid-cols-2">
                <Section>
                  <Overview02 height={300} data={data[2]} />
                </Section>
                <Section>
                  <Overview02 height={300} data={data[3]} />
                </Section>
              </div>
            </div>
            <Section className="md:w-96">
              <Overview02 width={400} data={data[1]} />
            </Section>
          </div>
          
          <Section>
            <Overview03 data={data[4]} />
          </Section>
        </div>
      </div>
    </div>
  );
}
