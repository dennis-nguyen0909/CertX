"use client";

import { useDegreeRatingStatisticsPdt } from "@/hooks/dashboard/use-dashboard-rating-statistics";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTranslation } from "react-i18next";

const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

export default function DiplomaTypesChart() {
  const { t } = useTranslation();
  const { data: degreeRatingStatisticsPdt } = useDegreeRatingStatisticsPdt();

  // Build chart data from API response
  const chartData = React.useMemo(() => {
    if (!degreeRatingStatisticsPdt) return [];
    const total =
      (degreeRatingStatisticsPdt.excellent || 0) +
      (degreeRatingStatisticsPdt.veryGood || 0) +
      (degreeRatingStatisticsPdt.good || 0) +
      (degreeRatingStatisticsPdt.average || 0);
    return [
      {
        name: t("diplomaTypesChart.excellent"),
        count: degreeRatingStatisticsPdt.excellent || 0,
        percentage: total
          ? ((degreeRatingStatisticsPdt.excellent || 0) / total) * 100
          : 0,
      },
      {
        name: t("diplomaTypesChart.veryGood"),
        count: degreeRatingStatisticsPdt.veryGood || 0,
        percentage: total
          ? ((degreeRatingStatisticsPdt.veryGood || 0) / total) * 100
          : 0,
      },
      {
        name: t("diplomaTypesChart.good"),
        count: degreeRatingStatisticsPdt.good || 0,
        percentage: total
          ? ((degreeRatingStatisticsPdt.good || 0) / total) * 100
          : 0,
      },
      {
        name: t("diplomaTypesChart.average"),
        count: degreeRatingStatisticsPdt.average || 0,
        percentage: total
          ? ((degreeRatingStatisticsPdt.average || 0) / total) * 100
          : 0,
      },
    ];
  }, [degreeRatingStatisticsPdt, t]);

  const totalDiplomas = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("diplomaTypesChart.title")}
        </h3>
        <div className="text-sm text-gray-500">
          {t("diplomaTypesChart.total", { count: totalDiplomas })}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => [
                t("diplomaTypesChart.tooltipCount", { count: value }),
                t("diplomaTypesChart.count"),
              ]}
              labelFormatter={(label) =>
                t("diplomaTypesChart.tooltipType", { type: label })
              }
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index] }}
            />
            <span className="text-sm text-gray-600">
              {item.name}: {item.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
