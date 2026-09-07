import { Link } from "react-router";
import { EmptyState } from "../ds/components/EmptyState";

export function NotFound() {
  return (
    <EmptyState
      title="ページが見つかりません"
      description="URL が変わったか、削除された可能性があります。"
      action={
        <Link to="/" className="inline-flex h-8 items-center rounded-md border border-hairline-strong bg-surface px-3 text-sm font-medium text-ink no-underline hover:bg-surface-sunken">
          ホームへ戻る
        </Link>
      }
    />
  );
}
