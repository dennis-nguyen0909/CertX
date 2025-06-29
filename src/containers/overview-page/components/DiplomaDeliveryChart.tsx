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

const DiplomaDeliveryChart = () => {
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
        color: "#34d399",
      },
      rejected: {
        label: t("overview.charts.diplomaRejected"),
        color: "#f87171",
      },
      pending: { label: t("overview.charts.diplomaPending"), color: "#fbbf24" },
    };
    return (
      <div className="bg-popover text-foreground p-2 rounded shadow border text-xs">
        <div className="font-semibold mb-1">{label}</div>
        {payload.map((entry, idx) => {
          const info = labelMap[entry.dataKey] || {
            label: entry.dataKey,
            color: entry.color,
          };
          return (
            <div key={idx} className="mb-1" style={{ color: info.color }}>
              {info.label}: <span className="font-bold">{entry.value}</span>{" "}
              {t("certificates.total")?.toLowerCase()}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-background p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t("overview.charts.diplomaDelivery5YearsTitle")}
        </h3>
      </div>

      <div style={{ width: 1000, height: 300, margin: "0 auto" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              stroke="#9ca3af"
            />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} stroke="#9ca3af" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const labelMap = {
                  delivered: {
                    label: t("overview.charts.diplomaDelivered"),
                    color: "#34d399",
                  },
                  rejected: {
                    label: t("overview.charts.diplomaRejected"),
                    color: "#f87171",
                  },
                  pending: {
                    label: t("overview.charts.diplomaPending"),
                    color: "#fbbf24",
                  },
                };
                return (
                  <div className="bg-popover text-foreground p-2 rounded shadow border text-xs">
                    <div className="font-semibold mb-1">{label}</div>
                    {payload.map((entry, idx) => {
                      const info = labelMap[entry.dataKey] || {
                        label: entry.dataKey,
                        color: entry.color,
                      };
                      return (
                        <div
                          key={idx}
                          className="mb-1"
                          style={{ color: info.color }}
                        >
                          {info.label}:{" "}
                          <span className="font-bold">{entry.value}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
            <Legend wrapperStyle={{ color: "#9ca3af" }} />
            <Line
              type="monotone"
              dataKey="delivered"
              stroke="#34d399"
              strokeWidth={3}
              dot={{ fill: "#34d399", strokeWidth: 2, r: 4 }}
              name={t("overview.charts.diplomaDelivered")}
            />
            <Line
              type="monotone"
              dataKey="rejected"
              stroke="#f87171"
              strokeWidth={3}
              dot={{ fill: "#f87171", strokeWidth: 2, r: 4 }}
              name={t("overview.charts.diplomaRejected")}
            />
            <Line
              type="monotone"
              dataKey="pending"
              stroke="#fbbf24"
              strokeWidth={3}
              dot={{ fill: "#fbbf24", strokeWidth: 2, r: 4 }}
              name={t("overview.charts.diplomaPending")}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {totalDelivered}
          </div>
          <div className="text-sm text-green-700">
            {t("overview.charts.diplomaDelivered")}
          </div>
        </div>
        <div className="text-center p-3 bg-red-50 dark:bg-red-900 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{totalRejected}</div>
          <div className="text-sm text-red-700">
            {t("overview.charts.diplomaRejected")}
          </div>
        </div>
        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900 rounded-lg">
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

export default React.memo(DiplomaDeliveryChart);
