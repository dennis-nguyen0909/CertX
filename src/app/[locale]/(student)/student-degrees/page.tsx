"use client";
import { GraduationCap } from "lucide-react";
import { useStudentDegreeList } from "@/hooks/degree/use-student-degree-list";
import { useTranslation } from "react-i18next";

// Định nghĩa type cho degree nếu cần
type Degree = {
  id: number;
  degreeName?: string;
  name?: string;
  graduationYear?: string | number;
  year?: string | number;
  degreeType?: string;
  type?: string;
};

export default function StudentDegreesPage() {
  const { t } = useTranslation();
  const { data: degreeList, isLoading } = useStudentDegreeList({
    page: 1,
    size: 10,
  });
  const degrees: Degree[] = degreeList?.items || [];

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">
        {t("studentDegrees.title")}
      </h2>
      {isLoading ? (
        <div className="text-center text-gray-500 py-10">
          {t("studentDegrees.loading")}
        </div>
      ) : degrees.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          {t("studentDegrees.noData")}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {degrees.map((d: Degree) => (
            <div
              key={d.id}
              className="group border bg-white rounded-2xl p-6 flex flex-col gap-3 shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer min-h-[160px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="text-blue-500" size={28} />
                <div className="font-semibold text-lg text-gray-800 group-hover:text-primary transition-colors">
                  {d.degreeName || d.name}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {t("studentDegrees.graduationYear")}:{" "}
                {d.graduationYear || d.year}
              </div>
              <div className="text-sm text-gray-500">
                {t("studentDegrees.degreeType")}: {d.degreeType || d.type}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
