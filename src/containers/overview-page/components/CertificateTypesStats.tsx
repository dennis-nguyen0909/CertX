import { useCountCertificateType } from "@/hooks/dashboard/use-dashboard-certificate-type";
import { RootState } from "@/store";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const CertificateTypesStats: React.FC = () => {
  const role = useSelector((state: RootState) => state.user.role);
  const { data: dataCertificateTypes } = useCountCertificateType(role ?? "");
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100 mb-8 mt-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("overview.charts.certificateStatsTitle")}
          </h2>
          <p className="text-gray-600">
            {t("overview.charts.certificateStatsDescription")}
          </p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mt-5">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("overview.charts.certificateTypesStatsTitle")}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {dataCertificateTypes?.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {item.approved}
              </div>
              <div className="text-sm font-medium text-gray-600 mb-2">
                {item.name}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${item.percentage?.toFixed(2)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {item.percentage?.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CertificateTypesStats);
