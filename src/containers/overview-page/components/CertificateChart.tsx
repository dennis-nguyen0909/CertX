import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMonthlyCertificateStatistics } from "@/hooks/dashboard/use-dashboard-monthly-certificate";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useTranslation } from "react-i18next";

const CertificateChart = () => {
  const { t } = useTranslation();
  const role = useSelector((state: RootState) => state.user.role);
  const { data: monthlyData } = useMonthlyCertificateStatistics(role || "");
  // Transform API data to chart format
  type MonthlyStat = {
    month: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  const chartDataRaw = React.useMemo(() => {
    if (!monthlyData) return [];
    return (monthlyData as MonthlyStat[]).map((item) => ({
      month: `${t("certificateChart.month")} ${item.month}`,
      certificates: item.approved,
      students: item.pending,
      rejected: item.rejected,
    }));
  }, [monthlyData, t]);
  const chartData = React.useDeferredValue(chartDataRaw);

  const legendLabelMap: Record<string, string> = {
    certificates: t("overview.charts.diplomaDelivered"),
    students: t("overview.charts.diplomaPending"),
    rejected: t("overview.charts.diplomaRejected"),
  };

  return (
    <div className="bg-background p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {t("certificateChart.title")}
      </h3>
      <div style={{ width: 1000, height: 300, margin: "0 auto" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#374151" />
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
            />
            <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
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
                        {legendLabelMap[entry.dataKey] || entry.dataKey}:{" "}
                        <span className="font-bold">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            <Legend
              formatter={(value) => legendLabelMap[value as string] || value}
              wrapperStyle={{ color: "#9ca3af" }}
            />
            <Bar
              dataKey="certificates"
              fill="#60a5fa"
              name={t("overview.charts.diplomaDelivered")}
            />
            <Bar
              dataKey="students"
              fill="#fbbf24"
              name={t("overview.charts.diplomaPending")}
            />
            <Bar
              dataKey="rejected"
              fill="#f87171"
              name={t("overview.charts.diplomaRejected")}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default React.memo(CertificateChart);
