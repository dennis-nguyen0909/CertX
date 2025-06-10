"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "T1", delivered: 45, issued: 48, pending: 12 },
  { month: "T2", delivered: 52, issued: 55, pending: 8 },
  { month: "T3", delivered: 38, issued: 42, pending: 15 },
  { month: "T4", delivered: 60, issued: 65, pending: 10 },
  { month: "T5", delivered: 48, issued: 50, pending: 7 },
  { month: "T6", delivered: 55, issued: 58, pending: 9 },
];

export default function DiplomaDeliveryChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Tình Trạng Cấp Văn Bằng
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Đã giao</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Đã cấp</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Chờ xử lý</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value} văn bằng`,
                name === "delivered"
                  ? "Đã giao"
                  : name === "issued"
                  ? "Đã cấp"
                  : "Chờ xử lý",
              ]}
              labelFormatter={(label) => `Tháng ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="delivered"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
              name="Đã giao"
            />
            <Line
              type="monotone"
              dataKey="issued"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              name="Đã cấp"
            />
            <Line
              type="monotone"
              dataKey="pending"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
              name="Chờ xử lý"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">298</div>
          <div className="text-sm text-green-700">Đã Giao</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">318</div>
          <div className="text-sm text-blue-700">Đã Cấp</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">61</div>
          <div className="text-sm text-orange-700">Chờ Xử Lý</div>
        </div>
      </div>
    </div>
  );
}
