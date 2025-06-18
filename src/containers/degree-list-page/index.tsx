"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { useColumns } from "./use-columns";
import { Degree } from "@/models/degree";
import { CreateDialog } from "./components/create-dialog";
import { ExcelUploadDialog } from "./components/excel-upload-dialog";
import { EditDialog } from "./components/edit-dialog";
import { DeleteDialog } from "./components/delete-dialog";
import { ViewDialog } from "./components/view-dialog";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDegreeList, useDegreePendingList } from "@/hooks/degree";
import { DegreeSearchParams } from "@/services/degree/degree.service";
import { Label } from "@/components/ui/label";

export default function DegreeListPage() {
  const { t } = useTranslation();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filterValues, setFilterValues] = useState({
    studentName: "",
    departmentName: "",
    className: "",
    studentCode: "",
    graduationYear: "",
  });
  const [searchParams, setSearchParams] = useState<DegreeSearchParams>({
    page: currentPage,
    size: pageSize,
    studentName: "",
    departmentName: "",
    className: "",
    studentCode: "",
    graduationYear: "",
  });

  const role = useSelector((state: RootState) => state.user.role) || "KHOA";

  // Debounce filter values
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams((prev) => ({
        ...prev,
        ...filterValues,
      }));
    }, 500);
    return () => clearTimeout(handler);
  }, [filterValues]);

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      page: currentPage,
      size: pageSize,
    }));
  }, [currentPage, pageSize]);

  // Fetch data using hooks
  const { data: allDegreesData, isLoading: isLoadingAll } = useDegreeList({
    role: role.toLowerCase(),
    ...searchParams,
  });

  const { data: pendingDegreesData, isLoading: isLoadingPending } =
    useDegreePendingList({
      role: role.toLowerCase(),
      ...searchParams,
    });

  // Pagination handler
  const handlePaginationChange = (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => {
    setCurrentPage(pagination.pageIndex);
  };

  // Filter handlers
  const handleFilterChange =
    (field: keyof DegreeSearchParams) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterValues((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleEdit = () => {
    setOpenEdit(false);
  };

  const handleDelete = () => {
    if (selectedDegree) {
      setOpenDelete(false);
    }
  };

  // Columns with action handlers
  const columns = useColumns({
    t,
    onView: (degree: Degree) => {
      setSelectedDegree(degree);
      setOpenView(true);
    },
    onEdit: (degree: Degree) => {
      setSelectedDegree(degree);
      setOpenEdit(true);
    },
    onDelete: (degree: Degree) => {
      setSelectedDegree(degree);
      setOpenDelete(true);
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{t("degrees.management")}</h1>
          <p className="text-sm text-gray-500">
            {t("degrees.total")}: {allDegreesData?.meta?.total || 0}
          </p>
        </div>
        {role !== "PDT" && role !== "ADMIN" && (
          <div className="flex gap-2">
            <ExcelUploadDialog />
            <Button onClick={() => setOpenCreate(true)}>
              <Plus className="w-4 h-4 mr-2" /> {t("degrees.create")}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1 items-end">
          <div className="flex flex-col">
            <Label className="mb-2">{t("degrees.studentName")}</Label>
            <Input
              value={filterValues.studentName}
              onChange={handleFilterChange("studentName")}
              placeholder={t("degrees.studentNamePlaceholder")}
              className="min-w-[140px]"
            />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2">{t("degrees.department")}</Label>
            <Input
              value={filterValues.departmentName}
              onChange={handleFilterChange("departmentName")}
              placeholder={t("degrees.departmentPlaceholder")}
              className="min-w-[140px]"
            />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2">{t("degrees.className")}</Label>
            <Input
              value={filterValues.className}
              onChange={handleFilterChange("className")}
              placeholder={t("degrees.classNamePlaceholder")}
              className="min-w-[120px]"
            />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2">{t("degrees.studentCode")}</Label>
            <Input
              value={filterValues.studentCode}
              onChange={handleFilterChange("studentCode")}
              placeholder={t("degrees.studentCodePlaceholder")}
              className="min-w-[120px]"
            />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2">{t("degrees.graduationYear")}</Label>
            <Input
              value={filterValues.graduationYear}
              onChange={handleFilterChange("graduationYear")}
              placeholder={t("degrees.graduationYearPlaceholder")}
              className="min-w-[100px]"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">{t("degrees.allDegrees")}</TabsTrigger>
          <TabsTrigger value="pending">
            {t("degrees.pendingDegrees")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <DataTable
            columns={columns}
            data={allDegreesData?.items || []}
            onPaginationChange={handlePaginationChange}
            listMeta={allDegreesData?.meta}
            isLoading={isLoadingAll}
            containerClassName="flex-1"
          />
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <DataTable
            columns={columns}
            data={pendingDegreesData?.items || []}
            onPaginationChange={handlePaginationChange}
            listMeta={pendingDegreesData?.meta}
            isLoading={isLoadingPending}
            containerClassName="flex-1"
          />
        </TabsContent>
      </Tabs>

      <CreateDialog open={openCreate} onClose={() => setOpenCreate(false)} />
      {selectedDegree && (
        <EditDialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          degree={selectedDegree}
          onEdit={handleEdit}
        />
      )}
      {selectedDegree && (
        <DeleteDialog
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          onDelete={handleDelete}
          name={selectedDegree.nameStudent}
        />
      )}
      {selectedDegree && (
        <ViewDialog
          open={openView}
          onClose={() => setOpenView(false)}
          degree={selectedDegree}
        />
      )}
    </div>
  );
}
