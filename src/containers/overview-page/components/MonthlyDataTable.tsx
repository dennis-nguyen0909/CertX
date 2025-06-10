import React from "react";

// Dữ liệu mẫu cho thống kê theo tháng
const monthlyData = [
  {
    month: "Jan",
    certificates: 120,
    students: 450,
    diplomas: 85,
    pendingDiplomas: 35,
    revenue: 15000000,
  },
  {
    month: "Feb",
    certificates: 95,
    students: 380,
    diplomas: 70,
    pendingDiplomas: 25,
    revenue: 12000000,
  },
  {
    month: "Mar",
    certificates: 150,
    students: 520,
    diplomas: 110,
    pendingDiplomas: 40,
    revenue: 18500000,
  },
  {
    month: "Apr",
    certificates: 180,
    students: 600,
    diplomas: 135,
    pendingDiplomas: 45,
    revenue: 22000000,
  },
  {
    month: "May",
    certificates: 140,
    students: 480,
    diplomas: 100,
    pendingDiplomas: 40,
    revenue: 16800000,
  },
  {
    month: "Jun",
    certificates: 200,
    students: 680,
    diplomas: 150,
    pendingDiplomas: 50,
    revenue: 25000000,
  },
  {
    month: "Jul",
    certificates: 220,
    students: 750,
    diplomas: 165,
    pendingDiplomas: 55,
    revenue: 28000000,
  },
];

export default function MonthlyDataTable() {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden mt-5">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">
          Chi Tiết Thống Kê Hàng Tháng
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Thống kê chứng chỉ, văn bằng và sinh viên theo từng tháng
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tháng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chứng Chỉ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sinh Viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Văn Bằng Đã Cấp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Văn Bằng Chờ Cấp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doanh Thu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tỷ Lệ Hoàn Thành
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {monthlyData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.month}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {row.certificates}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {row.students}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {row.diplomas}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {row.pendingDiplomas}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="font-medium text-gray-900">
                    {row.revenue.toLocaleString("vi-VN")} VNĐ
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">
                      {(
                        (row.diplomas / (row.diplomas + row.pendingDiplomas)) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (row.diplomas /
                              (row.diplomas + row.pendingDiplomas)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tổng kết */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-900">
              {monthlyData.reduce((sum, row) => sum + row.certificates, 0)}
            </div>
            <div className="text-gray-600">Tổng Chứng Chỉ</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">
              {monthlyData.reduce((sum, row) => sum + row.students, 0)}
            </div>
            <div className="text-gray-600">Tổng Sinh Viên</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">
              {monthlyData.reduce((sum, row) => sum + row.diplomas, 0)}
            </div>
            <div className="text-gray-600">Tổng Văn Bằng</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">
              {monthlyData
                .reduce((sum, row) => sum + row.revenue, 0)
                .toLocaleString("vi-VN")}{" "}
              VNĐ
            </div>
            <div className="text-gray-600">Tổng Doanh Thu</div>
          </div>
        </div>
      </div>
    </div>
  );
}
