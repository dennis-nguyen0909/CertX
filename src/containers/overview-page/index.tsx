"use client";

import React from "react";
import StatsCards from "./components/StatsCards";
import CertificateChart from "./components/CertificateChart";
import DepartmentPieChart from "./components/DepartmentPieChart";
import CoursesTrendChart from "./components/CoursesTrendChart";
import CertificateTypesStats from "./components/CertificateTypesStats";
import MonthlyDataTable from "./components/MonthlyDataTable";
import SummaryFooter from "./components/SummaryFooter";

export default function OverviewPage() {
  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hệ Thống Quản Lý Chứng Chỉ - Tổng Quan
        </h1>
        <p className="text-gray-600">
          Thống kê và quản lý chứng chỉ, sinh viên, khóa học theo thời gian thực
        </p>
      </div>

      {/* Thống kê tổng quan */}
      <StatsCards />

      {/* Biểu đồ chính */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CertificateChart />
        <DepartmentPieChart />
        <CoursesTrendChart />
        {/* Placeholder for EnrollmentAreaChart - will add later */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Xu Hướng Đăng Ký Khóa Học (Sẽ cập nhật sau)
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Component sẽ được thêm sau
          </div>
        </div>
      </div>

      {/* Thống kê loại chứng chỉ */}
      <CertificateTypesStats />

      {/* Bảng dữ liệu chi tiết */}
      <MonthlyDataTable />

      {/* Footer thống kê */}
      <SummaryFooter />
    </div>
  );
}
