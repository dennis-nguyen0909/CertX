import { useCountCertificateType } from "@/hooks/dashboard/use-dashboard-certificate-type";
import { RootState } from "@/store";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function CertificateTypesStats() {
  const role = useSelector((state: RootState) => state.user.role);
  const { data: dataCertificateTypes } = useCountCertificateType(role ?? "");
  const { t } = useTranslation();

  return (
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
            {/* <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `16%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{16}%</div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
