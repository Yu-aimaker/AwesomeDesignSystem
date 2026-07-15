"use client";

import { cx, stateAttributes } from "@awesome-ds/core/runtime";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { getComponentMetadata } from "@awesome-ds/core/metadata";

export const iconButtonMetadata = getComponentMetadata("icon-button");

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  loading?: boolean;
  children: ReactNode;
};

export function IconButton({ label, loading, disabled, className, children, type = "button", ...rest }: IconButtonProps) {
  const isDisabled = Boolean(disabled || loading);
  return (
    <button type={type} aria-label={label} className={cx("ads-icon-btn", "ads-focus-ring", className)} disabled={isDisabled} {...stateAttributes({ disabled: isDisabled, loading })} {...rest}>
      {children}
    </button>
  );
}
IconButton.metadata = iconButtonMetadata;
