"use client";

import { getComponentMetadata } from "@awesome-ds/core/metadata";
import { Button } from "./Button";
import { Link } from "./Link";

export const navigationMetadata = getComponentMetadata("breadcrumb");

export type BreadcrumbItem = { href?: string; label: string };
export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  ariaLabel?: string;
};

export function Breadcrumb({ items, ariaLabel = "Breadcrumb" }: BreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel}>
      <ol className="ads-breadcrumb">
        {items.map((item, index) => (
          <li key={item.label + "-" + index}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
            {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export type PaginationProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  ariaLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  formatPageStatus?: (page: number, pageCount: number) => string;
};

export function Pagination({
  page,
  pageCount,
  onChange,
  ariaLabel = "Pagination",
  previousLabel = "Previous",
  nextLabel = "Next",
  formatPageStatus = (currentPage, totalPages) => `Page ${currentPage} of ${totalPages}`,
}: PaginationProps) {
  return (
    <nav className="ads-pagination" aria-label={ariaLabel}>
      <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>{previousLabel}</Button>
      <span aria-live="polite">{formatPageStatus(page, pageCount)}</span>
      <Button variant="secondary" size="sm" disabled={page >= pageCount} onClick={() => onChange(page + 1)}>{nextLabel}</Button>
    </nav>
  );
}
Breadcrumb.metadata = navigationMetadata;
Pagination.metadata = getComponentMetadata("pagination");
