"use client";
import { GraduationCap } from "lucide-react";
import { useStudentDegreeList } from "@/hooks/degree/use-student-degree-list";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Calendar, Hash, School, User } from "lucide-react";
import { ViewDialog } from "@/containers/degree-list-page/components/view-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useDegreeDetail } from "@/hooks/degree/use-degree-detail";

// Định nghĩa type cho degree nếu cần
type Degree = {
  id: number;
  nameStudent?: string;
  className?: string;
  department?: string;
  issueDate?: string;
  status?: string;
  graduationYear?: string | number;
  diplomaNumber?: string;
  createdAt?: string;
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Đã duyệt":
      return "default";
    case "Chờ duyệt":
      return "secondary";
    case "Từ chối":
      return "destructive";
    default:
      return "outline";
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function StudentDegreesPage() {
  const { t } = useTranslation();
  const { data: degreeList, isLoading } = useStudentDegreeList({
    page: 1,
    size: 20,
  });
  const degrees: Degree[] = degreeList?.items || [];

  // Dialog logic
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get("id");
  const open = !!idParam;
  const selectedId = idParam ? Number(idParam) : null;
  const { data: selectedDegree, isLoading: isDegreeLoading } = useDegreeDetail(
    selectedId || 0
  );

  const handleCardClick = (id: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("id", id.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleClose = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("id");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

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
              className="group border bg-white rounded-2xl p-6 flex flex-col gap-3 shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer min-h-[200px]"
              onClick={() => handleCardClick(d.id)}
            >
              <div className="flex flex-col items-start gap-1 min-h-[72px]">
                <div className="flex items-center space-x-2 w-full">
                  <GraduationCap
                    className="text-blue-500 flex-shrink-0"
                    size={28}
                  />
                  <div
                    className="font-semibold text-lg text-gray-800 group-hover:text-primary transition-colors break-words w-full"
                    style={{ wordBreak: "break-word", minHeight: 40 }}
                  >
                    {d.nameStudent}
                  </div>
                </div>
                <Badge
                  variant={getStatusVariant(d.status || "")}
                  className="text-xs mt-2"
                >
                  {d.status}
                </Badge>
              </div>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium">{d.nameStudent}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <School className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium">{d.department}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium">{d.className}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-mono text-sm">{d.diplomaNumber}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{formatDate(d.issueDate)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {t("studentDegrees.graduationYear")}: {d.graduationYear}
                </div>
                <div className="pt-2 border-t text-xs text-muted-foreground">
                  {t("common.createdAt")}: {formatDate(d.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ViewDialog
        open={open}
        onClose={handleClose}
        degree={selectedDegree ?? null}
        loading={isDegreeLoading}
      />
    </div>
  );
}
