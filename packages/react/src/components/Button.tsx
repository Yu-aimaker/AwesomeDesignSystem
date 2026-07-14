"use client";

import { cx, stateAttributes } from "@awesome-ds/core";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { getComponentMetadata } from "../contracts";

export const buttonMetadata = getComponentMetadata("button");

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);
  return (
    <button
      type={type}
      className={cx("ads-btn", `ads-btn--${variant}`, `ads-btn--${size}`, "ads-focus-ring", className)}
      disabled={isDisabled}
      {...stateAttributes({ disabled: isDisabled, loading, state: loading ? "loading" : disabled ? "disabled" : "idle" })}
      {...rest}
    >
      {loading ? <span className="ads-spinner" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}
Button.metadata = buttonMetadata;
