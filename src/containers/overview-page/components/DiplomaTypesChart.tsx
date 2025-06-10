"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Cử Nhân", count: 245, percentage: 40.8 },
  { name: "Thạc Sĩ", count: 180, percentage: 30.0 },
  { name: "Tiến Sĩ", count: 95, percentage: 15.8 },
  { name: "Chứng Chỉ Nghề", count: 80, percentage: 13.4 },
];

const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

export default function DiplomaTypesChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Phân Loại Văn Bằng
        </h3>
        <div className="text-sm text-gray-500">
          Tổng: {data.reduce((sum, item) => sum + item.count, 0)} văn bằng
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => [`${value} văn bằng`, "Số lượng"]}
              labelFormatter={(label) => `Loại: ${label}`}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index] }}
            />
            <span className="text-sm text-gray-600">
              {item.name}: {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
