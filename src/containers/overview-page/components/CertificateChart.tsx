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
    certificates: t("certificateChart.barApproved"),
    students: t("certificateChart.barPending"),
    rejected: t("certificateChart.barRejected"),
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t("certificateChart.title")}
      </h3>
      <div style={{ width: 600, height: 300, margin: "0 auto" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                value,
                legendLabelMap[name] || name,
              ]}
            />
            <Legend
              formatter={(value) => legendLabelMap[value as string] || value}
            />
            <Bar
              dataKey="certificates"
              fill="#8884d8"
              name={t("certificateChart.barApproved")}
            />
            <Bar
              dataKey="students"
              fill="#82ca9d"
              name={t("certificateChart.barPending")}
            />
            <Bar
              dataKey="rejected"
              fill="#f87171"
              name={t("certificateChart.barRejected")}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default React.memo(CertificateChart);
