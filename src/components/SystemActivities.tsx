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
} from "lucide-react";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useListLog } from "@/hooks/log/use-list-log";
import React, { useRef, useEffect } from "react";
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
    default:
      return "border-blue-500";
  }
}

function formatValue(value: string) {
  return value;
}

function changesDisplay(actionChange?: Log["actionChange"]) {
  if (!actionChange || actionChange.length === 0) return null;
  return (
    <div className="text-[12px] text-gray-600 mt-1">
      <b>• Các thay đổi:</b>
      {actionChange.map((change: NonNullable<Log["actionChange"]>[number]) => (
        <p key={change.id} className="flex items-center gap-2 ml-2 w-full">
          {change.fieldName === "Url ảnh" ? (
            <>
              <b className="whitespace-nowrap">• {change.fieldName}:</b>
              <a
                href={change.oldValue}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline line-through max-w-[80px] truncate inline-block"
              >
                Xem ảnh cũ
              </a>
              <ArrowRight className="w-3 h-3" />
              <a
                href={change.newValue}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline max-w-[80px] truncate inline-block"
              >
                Xem ảnh mới
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
  { value: "ALL", label: "Tất cả" },
  { value: "CREATED", label: "Tạo" },
  { value: "UPDATED", label: "Cập nhật" },
  { value: "DELETED", label: "Xóa" },
  { value: "REJECTED", label: "Từ chối" },
  { value: "CHANGE_PASSWORD", label: "Thay đổi mật khẩu" },
  { value: "CHANGE_PASSWORD_DEPARTMENT", label: "Thay đổi mật khẩu của khoa" },
  { value: "LOCKED", label: "Khóa tài khoản" },
  { value: "UNLOCKED", label: "Mở khóa tài khoản" },
  { value: "LOCK_READ", label: "Khóa quyền read của" },
  { value: "UNLOCK_READ", label: "Mở khóa quyền đọc của" },
  { value: "LOCK_WRITE", label: "Khóa quyền write của" },
  { value: "UNLOCK_WRITE", label: "Mở khóa quyền write" },
  { value: "VERIFIED", label: "Xác thực" },
];

export default function SystemActivities() {
  const { pageIndex, pageSize, setPagination } = usePaginationQuery();
  const role = useSelector((state: RootState) => state.user.role);
  const [actionType, setActionType] = React.useState<string>("ALL");
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();

  const timelineRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useListLog({
    page: pageIndex + 1,
    size: pageSize,
    role: role ?? "",
    actionType: actionType === "ALL" ? undefined : actionType,
    startDate: startDate ? startDate.toISOString() : undefined,
    endDate: endDate ? endDate.toISOString() : undefined,
  });

  const total = data?.meta?.total ?? 0;
  const pageCount = Math.ceil(total / pageSize) || 1;

  // Scroll về top timeline khi filter đổi (không scroll khi chỉ phân trang)
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // eslint-disable-next-line
  }, [actionType, startDate, endDate]);

  return (
    <div className="p-4 max-w-full mx-6">
      {/* Filter */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div className="w-56">
          <label className="block text-xs font-semibold mb-1 text-gray-700">
            Loại thao tác
          </label>
          <Select value={actionType} onValueChange={setActionType}>
            <SelectTrigger className="w-full h-8 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-[13px] font-medium px-2 py-1">
              <SelectValue placeholder="Chọn loại thao tác" />
            </SelectTrigger>
            <SelectContent className="rounded-md shadow-lg border border-gray-200">
              <SelectGroup>
                {ACTION_TYPE_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="py-0.5 px-2 rounded text-[13px] hover:bg-blue-50 data-[state=checked]:bg-blue-100 data-[state=checked]:font-semibold transition"
                  >
                    {opt.label}
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
            label="Từ ngày"
            placeholder="Ngày bắt đầu"
          />
        </div>
        <div className="w-40">
          <DateTimePickerRange
            value={endDate}
            onChange={setEndDate}
            label="Đến ngày"
            placeholder="Ngày kết thúc"
          />
        </div>
      </div>
      {/* Activity Timeline */}
      <div className="relative">
        <div ref={timelineRef} className="relative min-h-[400px]">
          {/* Overlay loading */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
              <span className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></span>
            </div>
          )}
          {/* Vertical timeline line */}
          <div className="absolute left-[-5px] mt-[33px] z-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          {data?.items?.map((activity: Log) => (
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
                      ? "Bạn đã " +
                        activity.description.charAt(0).toLowerCase() +
                        activity.description.slice(1)
                      : ""}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="mt-1 text-[12px] text-gray-600">
                      <p>
                        • <b>Loại đối tượng:</b> {activity.entityName}
                      </p>
                      {activity.entityId && (
                        <p>
                          • <b>ID đối tượng:</b> {activity.entityId}
                        </p>
                      )}
                      <p>
                        • <b>IP:</b> {activity.ipAddress}
                      </p>
                      <p>
                        • <b>Ngày tạo:</b>{" "}
                        {format(activity.createdAt, "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Hiển thị các thay đổi nếu có */}
                {activity.actionChange && changesDisplay(activity.actionChange)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Pagination đơn giản */}
      <div className="flex items-center justify-center gap-2 mt-6 text-[13px]">
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => setPagination({ pageIndex: pageIndex - 1, pageSize })}
          disabled={pageIndex === 0}
        >
          &laquo;
        </button>
        <span>
          Trang {pageIndex + 1} / {pageCount}
        </span>
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => setPagination({ pageIndex: pageIndex + 1, pageSize })}
          disabled={pageIndex >= pageCount - 1}
        >
          &raquo;
        </button>
        <select
          className="ml-2 border rounded px-1 py-0.5"
          value={pageSize}
          onChange={(e) =>
            setPagination({ pageIndex: 0, pageSize: Number(e.target.value) })
          }
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size} / trang
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
