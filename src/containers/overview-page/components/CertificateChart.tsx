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
import { monthlyData } from "../data/mockData";

export default function CertificateChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Thống Kê Chứng Chỉ & Sinh Viên Theo Tháng
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="certificates" fill="#8884d8" name="Chứng Chỉ" />
          <Bar dataKey="students" fill="#82ca9d" name="Sinh Viên Đăng Ký" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
