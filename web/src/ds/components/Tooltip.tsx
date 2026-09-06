import { useId, type ReactElement, cloneElement } from "react";

export interface TooltipProps {
  label: string;
  children: ReactElement<{ "aria-describedby"?: string }>;
}

// Tooltips appear on hover and on keyboard focus, and are read by screen readers
// via aria-describedby. They carry no interactive content.
export function Tooltip({ label, children }: TooltipProps) {
  const id = useId();
  return (
    <span className="group relative inline-flex">
      {cloneElement(children, { "aria-describedby": id })}
      <span
        role="tooltip"
        id={id}
        className={[
          "pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap",
          "rounded-sm border border-hairline bg-surface px-2 py-1 text-xs text-ink shadow-2",
          "opacity-0 transition-[opacity,transform] duration-instant ease-out-ds",
          "group-hover:translate-y-0 group-hover:opacity-100 group-has-[:focus-visible]:translate-y-0 group-has-[:focus-visible]:opacity-100",
        ].join(" ")}
      >
        {label}
      </span>
    </span>
  );
}
