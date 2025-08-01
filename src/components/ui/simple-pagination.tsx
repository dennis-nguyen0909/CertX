import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useTranslation } from "react-i18next";

interface SimplePaginationProps {
  pageIndex: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

const SimplePagination: React.FC<SimplePaginationProps> = (props) => {
  const { t } = useTranslation();
  const {
    pageIndex,
    pageCount,
    onPageChange,
    className = "",
    pageSize,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 30, 50, 100],
  } = props;

  if (pageCount <= 1 && !onPageSizeChange) return null;

  return (
    <div
      className={`
        flex flex-col-reverse sm:flex-row-reverse items-center justify-between w-full gap-2 sm:gap-4
        ${className}
      `}
    >
      {/* Pagination controls */}
      <Pagination className={`w-full sm:w-auto ${className}`}>
        <PaginationContent className="flex flex-wrap items-center">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(pageIndex - 1)}
              aria-disabled={pageIndex === 0}
              tabIndex={pageIndex === 0 ? -1 : 0}
              style={{
                pointerEvents: pageIndex === 0 ? "none" : undefined,
                opacity: pageIndex === 0 ? 0.5 : 1,
              }}
              href="#"
            />
          </PaginationItem>
          {/* Mobile: chỉ hiển thị số trang hiện tại / tổng số trang */}
          <div className="block sm:hidden min-w-[80px] text-center px-2">
            <span className="text-sm font-medium">
              {t("common.page") && t("common.page") !== "common.page"
                ? t("common.page") + `: ${pageIndex + 1} / ${pageCount}`
                : `${pageIndex + 1} / ${pageCount}`}
            </span>
          </div>
          {/* Desktop: hiển thị tất cả các trang */}
          <div className="hidden sm:flex">
            {Array.from({ length: pageCount }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  isActive={idx === pageIndex}
                  href="#"
                  onClick={() => onPageChange(idx)}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </div>
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(pageIndex + 1)}
              aria-disabled={pageIndex >= pageCount - 1}
              tabIndex={pageIndex >= pageCount - 1 ? -1 : 0}
              style={{
                pointerEvents: pageIndex >= pageCount - 1 ? "none" : undefined,
                opacity: pageIndex >= pageCount - 1 ? 0.5 : 1,
              }}
              href="#"
            />
          </PaginationItem>
          {/* Page size selector ngay sau nút Sau */}
          {onPageSizeChange && (
            <PaginationItem>
              <div className="flex items-center gap-2 ml-0 sm:ml-4 mt-2 sm:mt-0">
                <label
                  htmlFor="page-size-select"
                  className="text-sm text-muted-foreground font-medium"
                >
                  {t("common.rowsPerPage")}
                </label>
                <select
                  id="page-size-select"
                  className="border border-input bg-background rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors shadow-sm hover:border-primary"
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >
                  {pageSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default SimplePagination;
