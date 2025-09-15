"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import NoData from "@/components/noData";
import Overview01 from "../../@manager/_components/overview01";
import Overview02 from "../../@manager/_components/overview02";
import Overview03 from "../../@manager/_components/overview03";
import useData from "@/hooks/useData";
import { useSearchParams } from "next/navigation";
import { getOverview } from "@/actions/instructor/overview";

export default function Page() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [filterData, setFilterData] = useState<{
    start: Date | undefined;
    end: Date | undefined;
  }>({ start: undefined, end: undefined });
  
  const { data, loading, error } = useData({
    func: getOverview,
    args: [filterData],
  });

  useEffect(() => {
    const startDateParam = searchParams?.get("startDate") ?? "",
      endDateParam = searchParams?.get("endDate") ?? "",
      startDate = new Date(startDateParam),
      endDate = new Date(endDateParam);
      
    setFilterData({
      start: String(startDate) === "Invalid Date" ? undefined : startDate,
      end: String(endDate) === "Invalid Date" ? undefined : endDate,
    });
  }, [searchParams]);

  return status === "loading" ? (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p>Checking authentication...</p>
      </div>
    </div>
  ) : status === "unauthenticated" ? (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-red-500 text-6xl">🔒</div>
        <h2 className="text-xl font-semibold text-gray-800">Authentication Required</h2>
        <p className="text-gray-600">Please log in to access the instructor dashboard.</p>
        <button 
          onClick={() => window.location.href = '/login'} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    </div>
  ) : session?.user?.role !== 'instructor' ? (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-orange-500 text-6xl">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800">Access Denied</h2>
        <p className="text-gray-600">You need instructor privileges to access this page.</p>
        <div className="text-sm bg-gray-100 p-4 rounded">
          <p>Current role: <strong>{session?.user?.role || 'Unknown'}</strong></p>
          <p>Required role: <strong>instructor</strong></p>
        </div>
      </div>
    </div>
  ) : loading ? (
    <Loading />
  ) : error ? (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-red-500 text-6xl">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800">Error Loading Dashboard</h2>
        <p className="text-gray-600">There was an issue loading your dashboard data.</p>
        <details className="text-left text-sm bg-gray-100 p-4 rounded">
          <summary className="cursor-pointer font-medium">Error Details</summary>
          <pre className="mt-2 whitespace-pre-wrap">{String(error)}</pre>
        </details>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    </div>
  ) : !data ? (
    <NoData />
  ) : (
    <div className="overflow-auto">
      <div className="py-4 grid gap-4 md:grid-cols-[1fr_auto] ">
        <div className="grid gap-4">
          <Overview01 data={data[0]} />
          <div className="grid gap-4 md:grid-cols-2">
            <Overview02 height={300} data={data[2]} />
          </div>
        </div>
        <Overview02 width={400} data={data[1]} />
      </div>
      <Overview03 data={data[3]} />
    </div>
  );
}