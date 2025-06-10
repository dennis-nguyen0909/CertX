import React from "react";

// Dữ liệu loại chứng chỉ
const certificateTypeData = [
  { type: "Chứng chỉ Nghề", count: 1200, percentage: 35 },
  { type: "Chứng chỉ Tiếng Anh", count: 900, percentage: 26 },
  { type: "Chứng chỉ Tin học", count: 800, percentage: 23 },
  { type: "Chứng chỉ Kỹ năng mềm", count: 550, percentage: 16 },
];

export default function CertificateTypesStats() {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden mt-5">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">
          Thống Kê Loại Chứng Chỉ
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {certificateTypeData.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {item.count}
            </div>
            <div className="text-sm font-medium text-gray-600 mb-2">
              {item.type}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{item.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
