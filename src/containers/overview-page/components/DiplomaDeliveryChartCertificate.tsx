"use client";

import { useYearlyCertificateStatistics } from "@/hooks/dashboard/use-dashboard-yearly-certificate";
import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from "recharts";
import { useTranslation } from "react-i18next";

const DiplomaDeliveryChartCertificate = () => {
  const { t } = useTranslation();
  const role = useSelector((state: RootState) => state.user.role);
  const { data: dataYearly } = useYearlyCertificateStatistics(role ?? "");

  interface YearlyStat {
    year: number;
    pending: number;
    approved: number;
    rejected: number;
  }
  interface ChartData {
    year: string;
    delivered: number;
    rejected: number;
    pending: number;
  }

  // Map API data to chart format
  const chartData = React.useMemo<ChartData[]>(() => {
    if (!dataYearly) return [];
    return (dataYearly as YearlyStat[]).map((item) => ({
      year: `${t("overview.charts.yearPrefix", { year: item.year })}`,
      delivered: item.approved, // Đã giao
      rejected: item.rejected, // Đã bị từ chối
      pending: item.pending, // Chờ xử lý
    }));
  }, [dataYearly, t]);

  // Tính tổng cho các thẻ thống kê
  const totalDelivered = chartData.reduce(
    (sum: number, item: ChartData) => sum + (item.delivered || 0),
    0
  );
  const totalRejected = chartData.reduce(
    (sum: number, item: ChartData) => sum + (item.rejected || 0),
    0
  );
  const totalPending = chartData.reduce(
    (sum: number, item: ChartData) => sum + (item.pending || 0),
    0
  );

  // Custom Tooltip component
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
    label,
  }) => {
    if (!active || !payload || !payload.length) return null;
    // Map key to label and color
    const labelMap: Record<string, { label: string; color: string }> = {
      delivered: {
        label: t("overview.charts.diplomaDelivered"),
        color: "#10B981",
      },
      rejected: {
        label: t("overview.charts.diplomaRejected"),
        color: "#EF4444",
      },
      pending: { label: t("overview.charts.diplomaPending"), color: "#F59E0B" },
    };
    return (
      <div className="bg-white p-3 rounded shadow border text-sm">
        <div className="font-semibold mb-1">{label}</div>
        {payload.map((entry) => {
          if (!entry) return null;
          const info = labelMap[entry.dataKey as string] || {
            label: String(entry.dataKey),
            color: entry.color as string,
          };
          return (
            <div
              key={entry.dataKey as string}
              style={{ color: info.color, marginBottom: 2 }}
            >
              {info.label}: <span className="font-bold">{entry.value}</span>{" "}
              {t("certificates.total")?.toLowerCase()}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("overview.charts.diplomaDelivery5YearsTitle")}
        </h3>
      </div>

      <div style={{ height: 300, margin: "0 auto" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => {
                if (value === "delivered")
                  return t("overview.charts.diplomaDelivered");
                if (value === "rejected")
                  return t("overview.charts.diplomaRejected");
                if (value === "pending")
                  return t("overview.charts.diplomaPending");
                return value;
              }}
            />
            <Line
              type="monotone"
              dataKey="delivered"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
              name={t("overview.charts.diplomaDelivered")}
            />
            <Line
              type="monotone"
              dataKey="rejected"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
              name={t("overview.charts.diplomaRejected")}
            />
            <Line
              type="monotone"
              dataKey="pending"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
              name={t("overview.charts.diplomaPending")}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {totalDelivered}
          </div>
          <div className="text-sm text-green-700">
            {t("overview.charts.diplomaDelivered")}
          </div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{totalRejected}</div>
          <div className="text-sm text-red-700">
            {t("overview.charts.diplomaRejected")}
          </div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {totalPending}
          </div>
          <div className="text-sm text-orange-700">
            {t("overview.charts.diplomaPending")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DiplomaDeliveryChartCertificate);
