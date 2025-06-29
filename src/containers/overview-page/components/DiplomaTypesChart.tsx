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
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const colors = ["#60a5fa", "#34d399", "#fbbf24", "#fb923c"];

export default function DiplomaTypesChart() {
  const { t } = useTranslation();
  const role = useSelector((state: RootState) => state.user.role);
  const { data: degreeRatingStatisticsPdt } = useDegreeRatingStatisticsPdt(
    role ?? ""
  );

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
    <div className="bg-background p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t("diplomaTypesChart.title")}
        </h3>
        <div className="text-sm text-muted-foreground">
          {t("diplomaTypesChart.total", { count: totalDiplomas })}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#374151" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
              stroke="#9ca3af"
            />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} stroke="#9ca3af" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div className="bg-popover text-foreground p-2 rounded shadow border text-xs">
                    <div className="font-semibold mb-1">{label}</div>
                    {payload.map((entry, idx) => (
                      <div
                        key={idx}
                        className="mb-1"
                        style={{ color: entry.color }}
                      >
                        {entry.name}:{" "}
                        <span className="font-bold">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
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
            <span className="text-sm text-muted-foreground">
              {item.name}: {item.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
