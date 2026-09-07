import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorState } from "../ds/components/ErrorState";

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
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.compact) {
      return (
        <div role="alert" className="flex h-full min-h-32 items-center justify-center rounded-md border border-dashed border-hairline-strong p-4 text-center">
          <p className="t-caption text-ink-muted">{this.props.label ?? "この部分"}を表示できませんでした。</p>
        </div>
      );
    }
    return (
      <ErrorState
        title={`${this.props.label ?? "このページ"}を表示できませんでした`}
        description="再読み込みで直ることがあります。直らない場合は GitHub の Issue で知らせてください。"
        action={
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="inline-flex h-8 items-center rounded-md border border-hairline-strong bg-surface px-3 text-sm font-medium text-ink hover:bg-surface-sunken"
          >
            もう一度試す
          </button>
        }
      />
    );
  }
}
