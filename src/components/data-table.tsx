"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Column,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { PaginatedListResponse } from "@/models/common";
import { cn } from "@/libs/utils";
import { transformMetaToPaginationState } from "@/utils/pagination";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

/**
 * DataTable component hỗ trợ ẩn/hiện (toggle) columns và drag & drop sắp xếp thứ tự columns:
 * - Sử dụng state columnVisibility để lưu trạng thái các cột đang hiển thị.
 * - Sử dụng state columnOrder để lưu thứ tự các cột (theo id).
 * - UI chọn columns dùng Popover + Checkbox + Drag&Drop (dnd-kit), nằm góc phải trên bảng.
 * - Khi người dùng tick/untick, state columnVisibility cập nhật và table sẽ tự động ẩn/hiện cột.
 * - Khi người dùng kéo thả, state columnOrder cập nhật và table sẽ tự động đổi thứ tự cột.
 * - Các cột có meta.disableHiding sẽ không thể ẩn (checkbox bị disable) và không thể drag.
 * - Có thể tắt tính năng này bằng prop enableColumnVisibility.
 * - Nếu header không phải string, sẽ fallback về col.id trong UI chọn columns.
 *
 * Cách code:
 * - Định nghĩa type TableColumn = Column<TData, unknown> để khớp với getAllLeafColumns.
 * - Luôn ép kiểu boolean cho các prop như checked, disabled, disableHiding để tránh lỗi typescript.
 * - Khởi tạo sensors dnd-kit ngoài render để tránh lỗi hooks.
 * - Khi render danh sách columns trong popover, dùng columnOrder để đảm bảo đúng thứ tự người dùng kéo thả.
 * - Khi dragEnd, dùng arrayMove để cập nhật lại columnOrder.
 */

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onPaginationChange: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  listMeta?: PaginatedListResponse<TData>["meta"];
  containerClassName?: string;
  isLoading?: boolean;
  onSelectedRowsChange?: (rows: TData[]) => void;
  enableColumnVisibility?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onPaginationChange,
  listMeta,
  containerClassName,
  isLoading,
  onSelectedRowsChange,
  enableColumnVisibility = true,
}: DataTableProps<TData, TValue> & { enableColumnVisibility?: boolean }) {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<
    Record<string, boolean>
  >({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const table = useReactTable({
    pageCount: listMeta?.total_pages || 0,
    data,
    state: {
      pagination: transformMetaToPaginationState(listMeta),
      rowSelection,
      columnVisibility,
      columnOrder,
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const state = updater(transformMetaToPaginationState(listMeta));
        onPaginationChange(state);
      } else {
        onPaginationChange(updater);
      }
    },
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
  });

  React.useEffect(() => {
    if (onSelectedRowsChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((r) => r.original);
      onSelectedRowsChange(selectedRows);
    }
  }, [onSelectedRowsChange, table, rowSelection]);

  React.useEffect(() => {
    if (columnOrder.length === 0 && table.getAllLeafColumns().length > 0) {
      setColumnOrder(table.getAllLeafColumns().map((col) => col.id));
    }
  }, [table, columnOrder.length]);

  type TableColumn = Column<TData, unknown>;

  function SortableColumnItem({
    col,
    disableHiding,
  }: {
    col: TableColumn;
    disableHiding: boolean;
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: col.id,
      disabled: disableHiding,
    });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 10 : undefined,
      background: isDragging ? "#f1f5f9" : undefined,
    };
    return (
      <label
        ref={setNodeRef}
        style={style}
        className={
          `flex items-center gap-3 text-sm px-2 py-2 rounded-lg cursor-pointer transition-colors select-none ` +
          (disableHiding
            ? "opacity-50 cursor-not-allowed bg-transparent"
            : "hover:bg-accent/60")
        }
        tabIndex={disableHiding ? -1 : 0}
      >
        <span
          {...attributes}
          {...listeners}
          className={
            "flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-400 " +
            (disableHiding ? "opacity-30" : "")
          }
          tabIndex={-1}
        >
          <GripVertical className="w-4 h-4" />
        </span>
        <Checkbox
          checked={!!col.getIsVisible()}
          onCheckedChange={(checked) => col.toggleVisibility(!!checked)}
          disabled={Boolean(disableHiding)}
          className="size-5"
        />
        <span className="truncate">
          {typeof col.columnDef.header === "string"
            ? col.columnDef.header
            : col.id}
        </span>
      </label>
    );
  }

  return (
    <div className={cn("rounded-md border pb-2", containerClassName)}>
      <div className="flex justify-end items-center px-2 pt-2">
        {enableColumnVisibility && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-full bg-white shadow-sm hover:bg-accent hover:border-primary transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label={t("common.toggleColumns", "Ẩn/hiện cột")}
                type="button"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t("common.toggleColumns", "Ẩn/hiện cột")}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-64 p-0 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50">
                <Checkbox
                  checked={table
                    .getAllLeafColumns()
                    .filter((col) => {
                      const disableHiding =
                        col.columnDef.meta &&
                        typeof col.columnDef.meta === "object" &&
                        "disableHiding" in col.columnDef.meta
                          ? (col.columnDef.meta as { disableHiding?: boolean })
                              .disableHiding
                          : false;
                      return !disableHiding;
                    })
                    .every((col) => col.getIsVisible())}
                  indeterminate={
                    table
                      .getAllLeafColumns()
                      .filter((col) => {
                        const disableHiding =
                          col.columnDef.meta &&
                          typeof col.columnDef.meta === "object" &&
                          "disableHiding" in col.columnDef.meta
                            ? (
                                col.columnDef.meta as {
                                  disableHiding?: boolean;
                                }
                              ).disableHiding
                            : false;
                        return !disableHiding;
                      })
                      .some((col) => col.getIsVisible()) &&
                    !table
                      .getAllLeafColumns()
                      .filter((col) => {
                        const disableHiding =
                          col.columnDef.meta &&
                          typeof col.columnDef.meta === "object" &&
                          "disableHiding" in col.columnDef.meta
                            ? (
                                col.columnDef.meta as {
                                  disableHiding?: boolean;
                                }
                              ).disableHiding
                            : false;
                        return !disableHiding;
                      })
                      .every((col) => col.getIsVisible())
                  }
                  onCheckedChange={(checked) => {
                    table.getAllLeafColumns().forEach((col) => {
                      const disableHiding =
                        col.columnDef.meta &&
                        typeof col.columnDef.meta === "object" &&
                        "disableHiding" in col.columnDef.meta
                          ? (col.columnDef.meta as { disableHiding?: boolean })
                              .disableHiding
                          : false;
                      if (!disableHiding) {
                        col.toggleVisibility(!!checked);
                      }
                    });
                  }}
                  className="size-5"
                />
                <span className="font-medium text-sm select-none">
                  {t("common.selectAll", "Chọn tất cả")}
                </span>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => {
                  const { active, over } = event;
                  if (active.id !== over?.id) {
                    const oldIndex = columnOrder.indexOf(active.id as string);
                    const newIndex = columnOrder.indexOf(over?.id as string);
                    setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex));
                  }
                }}
              >
                <SortableContext
                  items={columnOrder}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-1 max-h-64 overflow-auto px-2 py-2">
                    {columnOrder.map((colId) => {
                      const col = table
                        .getAllLeafColumns()
                        .find((c) => c.id === colId);
                      if (!col) return null;
                      const disableHiding = Boolean(
                        col.columnDef.meta &&
                          typeof col.columnDef.meta === "object" &&
                          "disableHiding" in col.columnDef.meta
                          ? (col.columnDef.meta as { disableHiding?: boolean })
                              .disableHiding
                          : false
                      );
                      return (
                        <SortableColumnItem
                          key={col.id}
                          col={col}
                          disableHiding={disableHiding}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  t("common.noResults")
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
