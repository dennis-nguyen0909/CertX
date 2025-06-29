"use client";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/data-table";
import { useRatingList } from "@/hooks/rating/use-rating-list";
import { Row } from "@tanstack/react-table";
import { Rating } from "@/models/rating";
import { useGuardRoute } from "@/hooks/use-guard-route";

export default function DegreeRatingPage() {
  const { t } = useTranslation();
  const { data: ratingData } = useRatingList();
  useGuardRoute();
  // Add columns for rating table
  const ratingColumns = [
    {
      id: "STT",
      accessorKey: "id",
      header: t("common.stt"),
      cell: ({ row }: { row: Row<Rating> }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: t("degrees.ratingName") || "Tên xếp loại",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("degrees.ratingList")}</h1>
      </div>
      <DataTable
        columns={ratingColumns}
        data={ratingData?.items || []}
        onPaginationChange={() => {}}
        listMeta={ratingData?.meta}
        containerClassName="flex-1"
        isLoading={false}
      />
    </div>
  );
}
