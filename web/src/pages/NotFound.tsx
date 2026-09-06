import { Link } from "react-router";
import { EmptyState } from "../ds/components/EmptyState";
import { Button } from "../ds/components/Button";

export function NotFound() {
  return (
    <EmptyState
      title="ページが見つかりません"
      description="URL が変わったか、削除された可能性があります。"
      action={
        <Button variant="secondary" size="sm" render={undefined as never}>
          <Link to="/" className="text-inherit no-underline">ホームへ戻る</Link>
        </Button>
      }
    />
  );
}
