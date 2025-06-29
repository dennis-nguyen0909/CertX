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
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function OverviewPage() {
  const { t } = useTranslation();
  const role = useSelector((state: RootState) => state.user.role);
  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("overview.header.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("overview.header.description")}
        </p>
      </div>

      {/* Thống kê tổng quan */}
      <StatsCards />

      {/* Biểu đồ chính */}
      {role === "KHOA" ? (
        <div className="mb-8">
          <DiplomaTypesChart />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DiplomaTypesChart />
          {role === "PDT" && <DepartmentPieChart />}
        </div>
      )}
      <div className="mt-5">
        <CertificateChart />
      </div>
      <div className="mt-5">
        <DiplomaDeliveryChart />
      </div>

      {/* Thống kê loại chứng chỉ - Enhanced */}
      <CertificateTypesStats />
      <MonthlyDataTable />
      <SummaryFooter />
    </div>
  );
}
