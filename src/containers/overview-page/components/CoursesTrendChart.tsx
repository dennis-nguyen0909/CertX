import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

export default function CoursesTrendChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Xu Hướng Số Lượng Khóa Học
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="courses"
            stroke="#8884d8"
            strokeWidth={2}
            name="Số Khóa Học"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
