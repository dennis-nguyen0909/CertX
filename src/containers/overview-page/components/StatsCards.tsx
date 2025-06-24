import { useDashboardPdt } from "@/hooks/dashboard/use-dashboard-pdt";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function StatsCards() {
  const { t } = useTranslation();
  const role = useSelector((state: RootState) => state.user.role);
  const { data: dashboardPdt, isPending } = useDashboardPdt(role ?? "");
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
      {/* Card 1: Total Students */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {t("overview.stats.totalStudents")}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {studentCount ?? 0}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <svg
              className="w-6 h-6 text-blue-600"
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
          </div>
        </div>
        {/* <p className="text-xs text-green-600 mt-2">+8.5% so với kỳ trước</p> */}
      </div>

      {/* Card 2: Approved Certificates */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {t("overview.stats.approvedCertificates")}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {certificateApproved ?? 0}
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <svg
              className="w-6 h-6 text-green-600"
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
          </div>
        </div>
        {/* <p className="text-xs text-green-600 mt-2">+15% so với tháng trước</p> */}
      </div>

      {/* Card 3: Approved Degrees */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {t("overview.stats.approvedDegrees")}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {degreeApproved ?? 0}
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <svg
              className="w-6 h-6 text-green-600"
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
          </div>
        </div>
        {/* <p className="text-xs text-green-600 mt-2">+5% so với tháng trước</p> */}
      </div>

      {/* Card 4: Pending Certificates */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {t("overview.stats.pendingCertificates")}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {certificatePending ?? 0}
            </p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <svg
              className="w-6 h-6 text-yellow-600"
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
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {t("overview.stats.pendingStatus")}
        </p>
      </div>

      {/* Card 5: Pending Degrees */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {t("overview.stats.pendingDegrees")}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {degreePending ?? 0}
            </p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <svg
              className="w-6 h-6 text-yellow-600"
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
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {t("overview.stats.pendingStatus")}
        </p>
      </div>

      {/* Card 6: Rejected Certificates */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {t("overview.stats.rejectedCertificates")}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {certificateRejected ?? 0}
            </p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <svg
              className="w-6 h-6 text-red-600"
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
          </div>
        </div>
        <p className="text-xs text-red-500 mt-2">
          {t("overview.stats.reviewNeeded")}
        </p>
      </div>

      {/* Card 7: Rejected Degrees */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {t("overview.stats.rejectedDegrees")}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {degreeRejected ?? 0}
            </p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <svg
              className="w-6 h-6 text-red-600"
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
          </div>
        </div>
        <p className="text-xs text-red-500 mt-2">
          {t("overview.stats.reviewNeeded")}
        </p>
      </div>

      {/* Card 8: Total Classes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {t("overview.stats.totalClasses")}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {classCount ?? 0}
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <svg
              className="w-6 h-6 text-purple-600"
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
          </div>
        </div>
        {/* <p className="text-xs text-green-600 mt-2">+12 khóa mới tháng này</p> */}
      </div>

      {/* Card 9: Total Departments */}
      {role === "PDT" && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t("overview.stats.totalDepartments")}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {departmentCount ?? 0}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <svg
                className="w-6 h-6 text-indigo-600"
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
