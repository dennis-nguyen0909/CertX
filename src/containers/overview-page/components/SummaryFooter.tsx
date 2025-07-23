import React from "react";
import { useDashboardStatistics } from "@/hooks/dashboard/use-dashboard-statistics";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function SummaryFooter() {
  const { role } = useSelector((state: RootState) => state.user);
  const { data: statistics } = useDashboardStatistics(role || "");
  const {
    topDepartmentCertificates,
    getTopCertificateType,
    topClassCertificates,
    topDepartmentDegrees,
    topClassDegrees,
  } = statistics || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
      {role === "PDT" ? (
        <>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
            <h4 className="text-lg font-semibold mb-2">
              Top Khoa Xuất Sắc (Chứng chỉ)
            </h4>
            <p className="text-2xl font-bold">
              {topDepartmentCertificates?.departmentName}
            </p>
            <p className="text-sm opacity-90">
              {topDepartmentCertificates?.total} chứng chỉ đã cấp
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
            <h4 className="text-lg font-semibold mb-2">
              Chứng chỉ Phổ Biến Nhất
            </h4>
            <p className="text-2xl font-bold">
              {getTopCertificateType?.certificateTypeName}
            </p>
            <p className="text-sm opacity-90">
              {getTopCertificateType?.total} sinh viên đăng ký
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
            <h4 className="text-lg font-semibold mb-2">
              Top Lớp Xuất Sắc (Chứng chỉ)
            </h4>
            <p className="text-2xl font-bold">
              {topClassCertificates?.className}
            </p>
            <p className="text-sm opacity-90">
              {topClassCertificates?.total} chứng chỉ đã cấp
            </p>
          </div>

          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-lg text-white">
            <h4 className="text-lg font-semibold mb-2">
              Top Khoa Xuất Sắc (Văn bằng)
            </h4>
            <p className="text-2xl font-bold">
              {topDepartmentDegrees?.departmentName}
            </p>
            <p className="text-sm opacity-90">
              {topDepartmentDegrees?.total} văn bằng đã cấp
            </p>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 rounded-lg text-white">
            <h4 className="text-lg font-semibold mb-2">
              Top Lớp Xuất Sắc (Văn bằng)
            </h4>
            <p className="text-2xl font-bold">{topClassDegrees?.className}</p>
            <p className="text-sm opacity-90">
              {topClassDegrees?.total} văn bằng đã cấp
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
            <h4 className="text-lg font-semibold mb-2">
              Top Lớp Xuất Sắc (Chứng chỉ)
            </h4>
            <p className="text-2xl font-bold">
              {topClassCertificates?.className}
            </p>
            <p className="text-sm opacity-90">
              {topClassCertificates?.total} chứng chỉ đã cấp
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
            <h4 className="text-lg font-semibold mb-2">
              Chứng chỉ Phổ Biến Nhất
            </h4>
            <p className="text-2xl font-bold">
              {getTopCertificateType?.certificateTypeName}
            </p>
            <p className="text-sm opacity-90">
              {getTopCertificateType?.total} sinh viên đăng ký
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
            <h4 className="text-lg font-semibold mb-2">
              Top Lớp Xuất Sắc (Văn bằng)
            </h4>
            <p className="text-2xl font-bold">{topClassDegrees?.className}</p>
            <p className="text-sm opacity-90">
              {topClassDegrees?.total} văn bằng đã cấp
            </p>
          </div>
        </>
      )}
    </div>
  );
}
