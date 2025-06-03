import React from "react";

export default function SummaryFooter() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
        <h4 className="text-lg font-semibold mb-2">Top Khoa Xuất Sắc</h4>
        <p className="text-2xl font-bold">Công Nghệ Thông Tin</p>
        <p className="text-sm opacity-90">850 chứng chỉ đã cấp</p>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
        <h4 className="text-lg font-semibold mb-2">Khóa Học Phổ Biến Nhất</h4>
        <p className="text-2xl font-bold">Lập Trình Web</p>
        <p className="text-sm opacity-90">450 sinh viên đăng ký</p>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
        <h4 className="text-lg font-semibold mb-2">Tỷ Lệ Thành Công</h4>
        <p className="text-2xl font-bold">87.5%</p>
        <p className="text-sm opacity-90">Sinh viên hoàn thành khóa học</p>
      </div>
    </div>
  );
}
