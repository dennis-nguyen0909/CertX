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

const MAX_VISIBLE_PAGES = 5;

function getVisiblePages(pageIndex: number, pageCount: number) {
  // Always show at most MAX_VISIBLE_PAGES, centered around current page if possible
  if (pageCount <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: pageCount }, (_, i) => i);
  }
  let start = Math.max(0, pageIndex - Math.floor(MAX_VISIBLE_PAGES / 2));
  let end = start + MAX_VISIBLE_PAGES - 1;
  if (end >= pageCount) {
    end = pageCount - 1;
    start = end - MAX_VISIBLE_PAGES + 1;
  }
  return Array.from({ length: MAX_VISIBLE_PAGES }, (_, i) => start + i);
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

  const visiblePages = getVisiblePages(pageIndex, pageCount);

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
          {/* Desktop: chỉ hiển thị tối đa 5 trang */}
          <div className="hidden sm:flex">
            {visiblePages[0] > 0 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    isActive={0 === pageIndex}
                    href="#"
                    onClick={() => onPageChange(0)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {visiblePages[0] > 1 && (
                  <PaginationItem>
                    <span className="px-2 text-muted-foreground">...</span>
                  </PaginationItem>
                )}
              </>
            )}
            {visiblePages.map((idx) => (
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
            {visiblePages[visiblePages.length - 1] < pageCount - 1 && (
              <>
                {visiblePages[visiblePages.length - 1] < pageCount - 2 && (
                  <PaginationItem>
                    <span className="px-2 text-muted-foreground">...</span>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    isActive={pageCount - 1 === pageIndex}
                    href="#"
                    onClick={() => onPageChange(pageCount - 1)}
                  >
                    {pageCount}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
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
