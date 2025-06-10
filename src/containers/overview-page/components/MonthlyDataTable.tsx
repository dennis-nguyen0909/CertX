import React from "react";

// Dữ liệu mẫu cho thống kê theo tháng
const monthlyData = [
  {
    month: "Jan",
    certificates: 120,
    students: 450,
    courses: 25,
    revenue: 15000000,
  },
  {
    month: "Feb",
    certificates: 95,
    students: 380,
    courses: 22,
    revenue: 12000000,
  },
  {
    month: "Mar",
    certificates: 150,
    students: 520,
    courses: 28,
    revenue: 18500000,
  },
  {
    month: "Apr",
    certificates: 180,
    students: 600,
    courses: 32,
    revenue: 22000000,
  },
  {
    month: "May",
    certificates: 140,
    students: 480,
    courses: 26,
    revenue: 16800000,
  },
  {
    month: "Jun",
    certificates: 200,
    students: 680,
    courses: 35,
    revenue: 25000000,
  },
  {
    month: "Jul",
    certificates: 220,
    students: 750,
    courses: 40,
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
                Khóa Học
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doanh Thu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TB Chứng Chỉ/Sinh Viên
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
                  {row.certificates}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.students}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.courses}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.revenue.toLocaleString("vi-VN")} VNĐ
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(row.certificates / row.students).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
