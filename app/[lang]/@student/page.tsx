import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/layout/Section";

function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Dashboard"
        subtitle="Welcome back! Here is an overview of your learning progress."
      />

      <Section
        title="Your Courses"
        description="Continue where you left off or explore new content."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="card p-4">
            <div className="h-24 skeleton" />
            <div className="mt-3">
              <div className="h-5 w-2/3 skeleton" />
              <div className="mt-2 h-4 w-1/2 skeleton" />
            </div>
          </div>
          <div className="card p-4">
            <div className="h-24 skeleton" />
            <div className="mt-3">
              <div className="h-5 w-2/3 skeleton" />
              <div className="mt-2 h-4 w-1/2 skeleton" />
            </div>
          </div>
          <div className="card p-4">
            <div className="h-24 skeleton" />
            <div className="mt-3">
              <div className="h-5 w-2/3 skeleton" />
              <div className="mt-2 h-4 w-1/2 skeleton" />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default Page;
