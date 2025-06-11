import React from "react";
import { useDashboard } from "@/hooks/dashboard";
import { Loader2, Users, Award, GraduationCap, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export default function StatsCards() {
  const { data, isLoading, error } = useDashboard();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            {t("dashboard.stats.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
        {t("dashboard.stats.error")}
      </div>
    );
  }

  const dashboardData = data;

  const cards = [
    {
      title: t("dashboard.stats.totalStudents"),
      value: dashboardData?.studentCount || 0,
      icon: Users,
      color: "blue",
    },
    {
      title: t("dashboard.stats.certificates"),
      mainValue: dashboardData?.certificateApproved || 0,
      mainLabel: t("dashboard.stats.approved"),
      secondaryValue: dashboardData?.certificatePending || 0,
      secondaryLabel: t("dashboard.stats.pending"),
      icon: Award,
      color: "green",
    },
    {
      title: t("dashboard.stats.degrees"),
      mainValue: dashboardData?.degreeApproved || 0,
      mainLabel: t("dashboard.stats.approved"),
      secondaryValue: dashboardData?.degreePending || 0,
      secondaryLabel: t("dashboard.stats.pending"),
      icon: GraduationCap,
      color: "yellow",
    },
    {
      title: t("dashboard.stats.statistics"),
      mainValue: dashboardData?.departmentCount || 0,
      mainLabel: t("dashboard.stats.departments"),
      secondaryValue: dashboardData?.classCount || 0,
      secondaryLabel: t("dashboard.stats.classes"),
      icon: BarChart3,
      color: "purple",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              {card.value !== undefined ? (
                <p className="text-2xl font-bold text-gray-900">
                  {card.value.toLocaleString()}
                </p>
              ) : (
                <div>
                  <div className="flex gap-2 items-baseline">
                    <p className="text-2xl font-bold text-gray-900">
                      {card.mainValue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{card.mainLabel}</p>
                  </div>
                  <div className="flex gap-2 items-baseline mt-1">
                    <p className="text-sm font-medium text-orange-500">
                      {card.secondaryValue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {card.secondaryLabel}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div
              className={cn("p-3 rounded-full", {
                "bg-blue-100": card.color === "blue",
                "bg-green-100": card.color === "green",
                "bg-yellow-100": card.color === "yellow",
                "bg-purple-100": card.color === "purple",
              })}
            >
              <card.icon
                className={cn("w-6 h-6", {
                  "text-blue-600": card.color === "blue",
                  "text-green-600": card.color === "green",
                  "text-yellow-600": card.color === "yellow",
                  "text-purple-600": card.color === "purple",
                })}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
