"use client";

import { getComponentMetadata } from "../contracts";
import { Button } from "./Button";
import { Link } from "./Link";

export const navigationMetadata = getComponentMetadata("breadcrumb");

export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
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

export function Pagination({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (page: number) => void }) {
  return (
    <nav className="ads-pagination" aria-label="Pagination">
      <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</Button>
      <span aria-live="polite">Page {page} of {pageCount}</span>
      <Button variant="secondary" size="sm" disabled={page >= pageCount} onClick={() => onChange(page + 1)}>Next</Button>
    </nav>
  );
}
Breadcrumb.metadata = navigationMetadata;
