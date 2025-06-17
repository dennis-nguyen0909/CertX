"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileUp } from "lucide-react";
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

const mockData: Degree[] = [
  {
    id: 114,
    nameStudent: "Nguyễn Văn Hiếu",
    className: "D21_TH06",
    department: "Kinh tế đối ngoại",
    issueDate: "2025-08-11",
    status: "Chưa duyệt",
    graduationYear: "2025",
    diplomaNumber: "21212131",
    createdAt: "2025-06-14T22:56:27",
  },
];

export default function DegreeListPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
  const [data, setData] = useState<Degree[]>(mockData);
  const role = useSelector((state: RootState) => state.user.role);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Dummy pagination handler for now
  const handlePaginationChange = () => {};

  // Dialog handlers
  const handleCreate = (degree: Omit<Degree, "id" | "createdAt">) => {
    setData((prev) => [
      ...prev,
      {
        ...degree,
        id: Math.max(...prev.map((d) => d.id), 0) + 1,
        createdAt: new Date().toISOString(),
      },
    ]);
  };
  const handleEdit = (degree: Degree) => {
    setData((prev) => prev.map((d) => (d.id === degree.id ? degree : d)));
  };
  const handleDelete = () => {
    if (selectedDegree) {
      setData((prev) => prev.filter((d) => d.id !== selectedDegree.id));
      setOpenDelete(false);
    }
  };
  const handleUpload = () => {
    setOpenUpload(false);
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
            {t("degrees.total")}: {data.length}
          </p>
        </div>
        {role !== "PDT" && role !== "ADMIN" && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpenUpload(true)}>
              <FileUp className="w-4 h-4 mr-2" /> {t("degrees.uploadExcel")}
            </Button>
            <Button onClick={() => setOpenCreate(true)}>
              <Plus className="w-4 h-4 mr-2" /> {t("degrees.create")}
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("degrees.searchPlaceholder")}
            className="pl-8"
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data.filter((item) =>
          item.nameStudent.toLowerCase().includes(debouncedSearch.toLowerCase())
        )}
        onPaginationChange={handlePaginationChange}
        listMeta={{
          total: data.length,
          count: data.length,
          per_page: 10,
          current_page: 1,
          total_pages: 1,
        }}
        containerClassName="flex-1"
      />
      <CreateDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={handleCreate}
      />
      <ExcelUploadDialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUpload={handleUpload}
      />
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
