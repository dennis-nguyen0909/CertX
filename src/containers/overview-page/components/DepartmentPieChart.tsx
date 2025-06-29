import { useFacultyDegreeStatisticsPdt } from "@/hooks/dashboard/use-dashboard-faculty-degree";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

export default function DepartmentPieChart() {
  const { t } = useTranslation();
  const role = useSelector((state: RootState) => state.user.role);
  const { data: facultyDegreeStatisticsPdt, isPending } =
    useFacultyDegreeStatisticsPdt(role ?? "");

  const chartData = React.useMemo(() => {
    if (!facultyDegreeStatisticsPdt) return [];
    return facultyDegreeStatisticsPdt
      .map((stat, index) => ({
        name: stat.departmentName,
        value: (stat.degreeApproved || 0) + (stat.certificateApproved || 0),
        color: COLORS[index % COLORS.length],
      }))
      .filter((item) => item.value > 0);
  }, [facultyDegreeStatisticsPdt]);

  if (isPending) {
    return (
      <div className="bg-background p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {t("overview.charts.departmentDistributionTitle")}
        </h3>
        <div className="flex justify-center items-center h-[300px]">
          <Skeleton className="h-64 w-64 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {t("overview.charts.departmentDistributionTitle")}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
            }
            outerRadius={100}
            fill="#60a5fa"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
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
          <Legend wrapperStyle={{ color: "#9ca3af" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
