// Dữ liệu mẫu cho thống kê theo tháng
export const monthlyData = [
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

// Dữ liệu phân bố chứng chỉ theo khoa
export const departmentData = [
  { name: "Công Nghệ Thông Tin", value: 850, color: "#0088FE" },
  { name: "Kinh Tế", value: 650, color: "#00C49F" },
  { name: "Kỹ Thuật", value: 720, color: "#FFBB28" },
  { name: "Ngoại Ngữ", value: 480, color: "#FF8042" },
  { name: "Y Khoa", value: 380, color: "#8884D8" },
];

// Dữ liệu loại chứng chỉ
export const certificateTypeData = [
  { type: "Chứng chỉ Nghề", count: 1200, percentage: 35 },
  { type: "Chứng chỉ Tiếng Anh", count: 900, percentage: 26 },
  { type: "Chứng chỉ Tin học", count: 800, percentage: 23 },
  { type: "Chứng chỉ Kỹ năng mềm", count: 550, percentage: 16 },
];

// Dữ liệu xu hướng đăng ký khóa học
export const enrollmentTrend = [
  { week: "Tuần 1", online: 120, offline: 80, total: 200 },
  { week: "Tuần 2", online: 140, offline: 95, total: 235 },
  { week: "Tuần 3", online: 160, offline: 110, total: 270 },
  { week: "Tuần 4", online: 180, offline: 120, total: 300 },
  { week: "Tuần 5", online: 200, offline: 130, total: 330 },
];

// Dữ liệu tiến độ mục tiêu các khoa
export const departmentGoals = [
  { name: "CNTT", value: 88, fill: "#8884d8" },
  { name: "Kinh tế", value: 72, fill: "#83a6ed" },
  { name: "Kỹ thuật", value: 95, fill: "#8dd1e1" },
  { name: "Ngoại ngữ", value: 65, fill: "#82ca9d" },
];

// Thống kê tổng quan
export const statsData = {
  totalStudents: 4860,
  totalCertificates: 1105,
  totalCourses: 208,
  completionRate: 87.5,
  trends: {
    students: "+8.5%",
    certificates: "+15%",
    courses: "+12 khóa mới",
    completion: "+3.2%",
  },
};
