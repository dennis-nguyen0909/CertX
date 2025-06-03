import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Dữ liệu phân bố chứng chỉ theo khoa
const departmentData = [
  { name: "Công Nghệ Thông Tin", value: 850, color: "#0088FE" },
  { name: "Kinh Tế", value: 650, color: "#00C49F" },
  { name: "Kỹ Thuật", value: 720, color: "#FFBB28" },
  { name: "Ngoại Ngữ", value: 480, color: "#FF8042" },
  { name: "Y Khoa", value: 380, color: "#8884D8" },
];

export default function DepartmentPieChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Phân Bố Chứng Chỉ Theo Khoa
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={departmentData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {departmentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
