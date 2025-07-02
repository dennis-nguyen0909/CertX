"use client";
import {
  User,
  Mail,
  Calendar,
  GraduationCap,
  Users,
  School,
} from "lucide-react";
import { useStudentDetail } from "@/hooks/user/use-student-detail";
import { useTranslation } from "react-i18next";

export default function StudentInfoPage() {
  const { t } = useTranslation();
  const { data: student, isLoading } = useStudentDetail();

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">
        {t("student.infoTitle")}
      </h2>
      {isLoading ? (
        <div className="text-center text-gray-500 py-10">
          {t("student.loading")}
        </div>
      ) : !student ? (
        <div className="text-center text-gray-500 py-10">
          {t("student.noData")}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-5 border">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3 min-w-[220px]">
              <User className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.name")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.name}
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-[180px]">
              <Users className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.studentCode")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.studentCode}
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-[220px]">
              <Mail className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.email")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.email}
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-[200px]">
              <Calendar className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.birthDate")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.birthDate}
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-[140px]">
              <GraduationCap className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.course")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.course}
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-[140px]">
              <Users className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.className")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.className} (ID: {student.classId})
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-[220px]">
              <Users className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.departmentName")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.departmentName} (ID: {student.departmentId})
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-[220px]">
              <School className="text-primary" />
              <span className="font-medium text-gray-700">
                {t("student.universityName")}:
              </span>
              <span className="text-gray-900 font-semibold">
                {student.universityName}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
