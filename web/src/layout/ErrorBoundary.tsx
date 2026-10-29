import { Component, type ContextType, type ErrorInfo, type ReactNode } from "react";
import { ErrorState } from "../ds/components/ErrorState";
import { LocaleContext } from "../i18n/context";
import { shellMessages } from "../i18n/messages/shell";

interface Props {
  children: ReactNode;
  /** Short label of what failed, shown to the visitor. */
  label?: string;
  /** Smaller fallback for a single demo or tile instead of a whole route. */
  compact?: boolean;
}

interface State {
  error: Error | null;
}

/** Catches render errors so one broken demo never takes the page down. */
export class ErrorBoundary extends Component<Props, State> {
  static contextType = LocaleContext;
  declare context: ContextType<typeof LocaleContext>;
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    const t = shellMessages[this.context.locale];
    if (this.props.compact) {
      return (
        <div role="alert" className="flex h-full min-h-32 items-center justify-center rounded-md border border-dashed border-hairline-strong p-4 text-center">
          <p className="t-caption text-ink-muted">{t.cannotShowPart(this.props.label ?? t.thisPart)}</p>
        </div>
      );
    }
    return (
      <ErrorState
        title={t.cannotShowPage(this.props.label ?? t.thisPage)}
        description={t.errorHelp}
        action={
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="inline-flex h-8 items-center rounded-md border border-hairline-strong bg-surface px-3 text-sm font-medium text-ink hover:bg-surface-sunken"
          >
            {t.retry}
          </button>
        }
      />
    );
  }
}
