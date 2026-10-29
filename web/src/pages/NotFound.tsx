import { Link } from "../i18n/router";
import { useT } from "../i18n/context";
import { shellMessages } from "../i18n/messages/shell";
import { EmptyState } from "../ds/components/EmptyState";

export function NotFound() {
  const t = useT(shellMessages);
  return (
    <EmptyState
      title={t.notFoundTitle}
      description={t.notFoundBody}
      action={
        <Link to="/" className="inline-flex h-8 items-center rounded-md border border-hairline-strong bg-surface px-3 text-sm font-medium text-ink no-underline hover:bg-surface-sunken">
          {t.backHome}
        </Link>
      }
    />
  );
}
