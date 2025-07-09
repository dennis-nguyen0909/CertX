"use client";

import {
  Plus,
  Pencil,
  Info,
  Lock,
  Unlock,
  Check,
  X,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useListLog, useDepartmentLog } from "@/hooks/log/use-list-log";
import React from "react";
import { Log } from "@/models/log";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePickerRange } from "@/components/ui/datetime-picker-range";
import { format } from "date-fns";
import SimplePagination from "@/components/ui/simple-pagination";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

function getActivityIcon(actionType: string) {
  switch (actionType) {
    case "CREATED":
      return <Plus className="text-blue-500" size={16} />;
    case "DELETED":
      return <X className="text-red-500" size={16} />;
    case "UPDATED":
      return <Pencil className="text-green-500" size={16} />;
    case "VERIFIED":
      return <Check className="text-green-500" size={16} />;
    case "REJECTED":
      return <X className="text-red-500" size={16} />;
    case "LOCKED":
      return <Lock className="text-gray-700 line-through" size={16} />;
    case "UNLOCKED":
      return <Unlock className="text-blue-500" size={16} />;
    case "EXPORT_EXCEL":
      return <ArrowDown className="text-yellow-500" size={16} />;
    default:
      return <Info className="text-blue-500" size={16} />;
  }
}

function getBorderColor(actionType: string) {
  switch (actionType) {
    case "CREATED":
      return "border-blue-500";
    case "UPDATED":
      return "border-green-500";
    case "DELETED":
      return "border-red-500";
    case "VERIFIED":
      return "border-green-500";
    case "REJECTED":
      return "border-red-500";
    case "LOCKED":
      return "border-gray-700";
    case "UNLOCKED":
      return "border-blue-500";
    case "EXPORT_EXCEL":
      return "border-yellow-500";
    default:
      return "border-blue-500";
  }
}

function formatValue(value: string) {
  return value;
}

function changesDisplay(
  actionChange?: Log["actionChange"],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t?: (key: string, options?: any) => string
) {
  if (!actionChange || actionChange.length === 0 || !t) return null;
  return (
    <div className="text-[12px] text-gray-600 mt-1">
      <b>• {t("systemActivities.changes")}:</b>
      {actionChange.map((change: NonNullable<Log["actionChange"]>[number]) => (
        <p key={change.id} className="flex items-center gap-2 ml-2 w-full">
          {change.fieldName === t("systemActivities.imageUrl") ? (
            <>
              <b className="whitespace-nowrap">• {change.fieldName}:</b>
              <a
                href={change.oldValue}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline line-through max-w-[80px] truncate inline-block"
              >
                {t("systemActivities.viewOldImage")}
              </a>
              <ArrowRight className="w-3 h-3" />
              <a
                href={change.newValue}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline max-w-[80px] truncate inline-block"
              >
                {t("systemActivities.viewNewImage")}
              </a>
            </>
          ) : (
            <>
              <b className="whitespace-nowrap">• {change.fieldName}:</b>
              <span className="text-gray-400 line-through whitespace-nowrap overflow-hidden text-ellipsis">
                {formatValue(change.oldValue)}
              </span>
              <ArrowRight className="w-3 h-3" />
              <span className="text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                {formatValue(change.newValue)}
              </span>
            </>
          )}
        </p>
      ))}
    </div>
  );
}

const ACTION_TYPE_OPTIONS = [
  "ALL",
  "CREATED",
  "UPDATED",
  "DELETED",
  "REJECTED",
  "CHANGE_PASSWORD",
  "CHANGE_PASSWORD_DEPARTMENT",
  "LOCKED",
  "UNLOCKED",
  "LOCK_READ",
  "UNLOCK_READ",
  "LOCK_WRITE",
  "UNLOCK_WRITE",
  "VERIFIED",
  "EXPORT_EXCEL",
];

export default function SystemActivities() {
  const { t } = useTranslation();
  const { pageIndex, pageSize, setPagination } = usePaginationQuery();
  const role = useSelector((state: RootState) => state.user.role);
  const [actionType, setActionType] = React.useState<string>("ALL");
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();

  const searchParams = useSearchParams();
  const departmentIdParam = searchParams.get("departmentId");
  const departmentId = departmentIdParam
    ? Number(departmentIdParam)
    : undefined;

  const departmentNameParam = searchParams.get("departmentName");
  const departmentName = departmentNameParam
    ? decodeURIComponent(departmentNameParam)
    : undefined;

  function lowerFirst(str: string) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }
  const departmentLabel = departmentId
    ? departmentName
      ? t("systemActivities.departmentLabel", {
          name: lowerFirst(departmentName),
        })
      : t("systemActivities.defaultDepartmentLabel")
    : t("systemActivities.youLabel");

  const departmentLog = useDepartmentLog(
    {
      page: pageIndex + 1,
      size: pageSize,
      departmentId,
      actionType: actionType === "ALL" ? undefined : actionType,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    },
    { enabled: !!departmentId }
  );
  const listLog = useListLog(
    {
      page: pageIndex + 1,
      size: pageSize,
      role: role ?? "",
      actionType: actionType === "ALL" ? undefined : actionType,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    },
    { enabled: !departmentId }
  );

  const items = departmentId
    ? departmentLog.data?.items ?? []
    : listLog.data?.items ?? [];
  const isLoading = departmentId ? departmentLog.isLoading : listLog.isLoading;
  const total = departmentId
    ? departmentLog.data?.meta?.total ?? 0
    : listLog.data?.meta?.total ?? 0;
  const pageCount = Math.ceil(total / pageSize) || 1;

  return (
    <div className="max-w-full  px-10">
      {/* Filter */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div className="w-56 pt-4">
          <label className="block text-xs font-semibold mb-1 text-gray-700">
            {t("systemActivities.actionTypeLabel")}
          </label>
          <Select value={actionType} onValueChange={setActionType}>
            <SelectTrigger className="w-full h-8 rounded-md border border-gray-200 shadow-sm focus:ring-1 focus:ring-primary focus:border-primary transition text-[14px] font-medium px-2.5 py-1.5 bg-white hover:border-primary/50 hover:shadow-sm">
              <SelectValue
                placeholder={t("systemActivities.actionTypePlaceholder")}
              />
            </SelectTrigger>
            <SelectContent className="rounded-md shadow-lg border border-gray-100 bg-white">
              <SelectGroup>
                {ACTION_TYPE_OPTIONS.map((value) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="py-1.5 px-2.5 rounded text-[14px] font-medium hover:bg-primary/5 data-[state=checked]:bg-primary/10 data-[state=checked]:font-semibold transition cursor-pointer flex items-center gap-2"
                  >
                    {t(`systemActivities.actionType.${value.toLowerCase()}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="w-40">
          <DateTimePickerRange
            value={startDate}
            onChange={setStartDate}
            // label={t("systemActivities.startDateLabel")}
            placeholder={t("systemActivities.startDatePlaceholder")}
          />
        </div>
        <div className="w-40">
          <DateTimePickerRange
            value={endDate}
            onChange={setEndDate}
            // label={t("systemActivities.endDateLabel")}
            placeholder={t("systemActivities.endDatePlaceholder")}
          />
        </div>
      </div>
      {/* Activity Timeline */}
      <div className="relative">
        <div className="relative min-h-[400px]">
          {/* Overlay loading */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
              <span className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></span>
            </div>
          )}
          {/* Vertical timeline line and items only if there is data */}
          {isLoading ? null : items.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              {t("systemActivities.noHistory")}
            </div>
          ) : (
            <>
              <div className="absolute left-[-5px] mt-[33px] z-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              {items.map((activity: Log) => (
                <div key={activity.id} className="relative pl-4 ">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute bg-white -left-4 top-2.5 flex items-center justify-center w-6 h-6 border rounded-full z-[20] ${getBorderColor(
                      activity.actionType
                    )}`}
                  >
                    {getActivityIcon(activity.actionType)}
                  </div>

                  <div className="bg-white rounded-lg p-2 ">
                    <div className="flex items-start justify-start flex-col-reverse">
                      <span className="font-medium text-[14px]">
                        {activity.description
                          ? departmentLabel +
                            " " +
                            activity.description.charAt(0).toLowerCase() +
                            activity.description.slice(1)
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <div className="mt-1 text-[12px] text-gray-600">
                          <p>
                            • <b>{t("systemActivities.entityType")}:</b>{" "}
                            {activity.entityName}
                          </p>
                          {activity.entityId && (
                            <p>
                              • <b>{t("systemActivities.entityId")}:</b>{" "}
                              {activity.entityId}
                            </p>
                          )}
                          <p>
                            • <b>{t("systemActivities.ip")}:</b>{" "}
                            {activity.ipAddress}
                          </p>
                          <p>
                            • <b>{t("systemActivities.createdAt")}:</b>{" "}
                            {format(activity.createdAt, "dd/MM/yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Hiển thị các thay đổi nếu có */}
                    {activity.actionChange &&
                      changesDisplay(activity.actionChange, t)}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      {/* Pagination đơn giản */}
      <div className="flex items-center justify-center gap-2 mt-6 text-[13px] mb-10">
        <SimplePagination
          pageIndex={pageIndex}
          pageCount={pageCount}
          onPageChange={(newPage) =>
            setPagination({ pageIndex: newPage, pageSize })
          }
        />
      </div>
    </div>
  );
}
