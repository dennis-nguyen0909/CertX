"use client";

import React from "react";
import StatsCards from "./components/StatsCards";
import CertificateChart from "./components/CertificateChart";
import DepartmentPieChart from "./components/DepartmentPieChart";
import DiplomaTypesChart from "./components/DiplomaTypesChart";
import DiplomaDeliveryChart from "./components/DiplomaDeliveryChart";
import CertificateTypesStats from "./components/CertificateTypesStats";
import MonthlyDataTable from "./components/MonthlyDataTable";
import SummaryFooter from "./components/SummaryFooter";
import { useTranslation } from "react-i18next";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export default function OverviewPage() {
  const { t } = useTranslation();
  const role = useSelector((state: RootState) => state.user.role);

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("overview.header.title")}
        </h1>
        <p className="text-gray-600">{t("overview.header.description")}</p>
      </div>

      {/* Thống kê tổng quan */}
      <StatsCards />

      {/* Biểu đồ chính */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <CertificateChart />
        {role === "PDT" && <DepartmentPieChart />}
        <DiplomaTypesChart />
        <DiplomaDeliveryChart />
      </div>

      {/* Thống kê loại chứng chỉ - Enhanced */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("overview.charts.certificateStatsTitle")}
              </h2>
              <p className="text-gray-600">
                {t("overview.charts.certificateStatsDescription")}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <CertificateTypesStats />
        </div>
      </div>

      {/* Bảng dữ liệu chi tiết */}
      <MonthlyDataTable />

      {/* Footer thống kê */}
      <SummaryFooter />
    </div>
  );
}
