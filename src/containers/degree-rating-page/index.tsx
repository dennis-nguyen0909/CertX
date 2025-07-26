"use client";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/data-table";
import { useRatingList } from "@/hooks/rating/use-rating-list";
import { useGuardRoute } from "@/hooks/use-guard-route";
import { CreateRatingDialog } from "./components/create-rating-dialog";
import { useRatingColumns } from "./use-columns";
import { useSearchParams } from "next/navigation";
import { DeleteRatingDialog } from "./components/delete-rating-dialog";
import { EditRatingDialog } from "./components/edit-rating-dialog";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export default function DegreeRatingPage() {
  const { t } = useTranslation();
  const { data: ratingData } = useRatingList();
  const role = useSelector((state: RootState) => state.user.role);

  // const [search, setSearch] = useState<string>("");
  useGuardRoute();
  const columns = useRatingColumns();
  const searchParams = useSearchParams();
  const openEditDialog =
    searchParams.get("action") === "edit" && searchParams.has("id");

  const openDeleteDialog =
    searchParams.get("action") === "delete" && searchParams.has("id");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("degrees.ratingList")}</h1>
        {role === "PDT" && <CreateRatingDialog />}
      </div>
      {/* <div className="flex flex-row gap-4">
         <div className="relative w-full  sm:w-1/4">
           <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder={t("degrees.searchRating")}
             className="pl-8"
           />
         </div>
       </div> */}
      <DataTable
        columns={columns}
        data={ratingData?.items || []}
        onPaginationChange={() => {}}
        listMeta={ratingData?.meta}
        containerClassName="flex-1"
        isLoading={false}
      />
      {openEditDialog && searchParams.get("id") && (
        <EditRatingDialog
          open={openEditDialog}
          id={searchParams.get("id")!}
          name={searchParams.get("name") ?? ""}
        />
      )}

      {openDeleteDialog &&
        searchParams.get("id") &&
        searchParams.get("name") && (
          <DeleteRatingDialog
            open={openDeleteDialog}
            id={searchParams.get("id")!}
            name={decodeURIComponent(searchParams.get("name")!)}
          />
        )}
    </div>
  );
}
