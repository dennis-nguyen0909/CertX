import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface SimplePaginationProps {
  pageIndex: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const SimplePagination: React.FC<SimplePaginationProps> = ({
  pageIndex,
  pageCount,
  onPageChange,
  className = "",
}) => {
  if (pageCount <= 1) return null;

  return (
    <Pagination className={className}>
      <PaginationContent>
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
      </PaginationContent>
    </Pagination>
  );
};

export default SimplePagination;
