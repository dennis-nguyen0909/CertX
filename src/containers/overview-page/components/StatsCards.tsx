import { useDashboardPdt } from "@/hooks/dashboard/use-dashboard-pdt";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import StatsCard from "./StatsCard";
import { useRouter } from "next/navigation";

export default function StatsCards() {
  const { t } = useTranslation();
  const role = useSelector((state: RootState) => state.user.role);
  const { data: dashboardPdt, isPending } = useDashboardPdt(role ?? "");
  const router = useRouter();
  const {
    classCount,
    degreePending,
    degreeApproved,
    degreeRejected,
    studentCount,
    certificatePending,
    certificateApproved,
    certificateRejected,
    departmentCount,
  } = dashboardPdt ?? {};

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-8 w-1/3" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
            <Skeleton className="h-3 w-1/2 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title={t("overview.stats.approvedCertificates")}
        value={certificateApproved ?? 0}
        onClick={() => router.push("/certificates?tab=approved")}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        }
        bgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatsCard
        title={t("overview.stats.pendingCertificates")}
        value={certificatePending ?? 0}
        onClick={() => router.push("/certificates?tab=pending")}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        }
        bgColor="bg-yellow-100"
        iconColor="text-yellow-600"
        description={t("overview.stats.pendingStatus")}
      />
      <StatsCard
        title={t("overview.stats.rejectedCertificates")}
        value={certificateRejected ?? 0}
        onClick={() => router.push("/certificates?tab=rejected")}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        }
        bgColor="bg-red-100"
        iconColor="text-red-600"
        description={t("overview.stats.reviewNeeded")}
        descriptionColor="text-red-500"
      />
      <StatsCard
        title={t("overview.stats.approvedDegrees")}
        value={degreeApproved ?? 0}
        onClick={() => router.push("/degree/list?tab=approved")}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        }
        bgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatsCard
        title={t("overview.stats.pendingDegrees")}
        value={degreePending ?? 0}
        onClick={() => router.push("/degree/list?tab=pending")}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        }
        bgColor="bg-yellow-100"
        iconColor="text-yellow-600"
        description={t("overview.stats.pendingStatus")}
      />

      <StatsCard
        title={t("overview.stats.rejectedDegrees")}
        value={degreeRejected ?? 0}
        onClick={() => router.push("/degree/list?tab=rejected")}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        }
        bgColor="bg-red-100"
        iconColor="text-red-600"
        description={t("overview.stats.reviewNeeded")}
        descriptionColor="text-red-500"
      />
      <StatsCard
        title={t("overview.stats.totalStudents")}
        value={studentCount ?? 0}
        onClick={() => router.push("/student-list")}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        }
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatsCard
        title={t("overview.stats.totalClasses")}
        value={classCount ?? 0}
        onClick={() => router.push("/class-list")}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        }
        bgColor="bg-purple-100"
        iconColor="text-purple-600"
      />
      {role === "PDT" && (
        <StatsCard
          title={t("overview.stats.totalDepartments")}
          value={departmentCount ?? 0}
          onClick={() => router.push("/department-list")}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          bgColor="bg-indigo-100"
          iconColor="text-indigo-600"
        />
      )}
    </div>
  );
}
