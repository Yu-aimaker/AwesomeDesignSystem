export type ThemeName = "light" | "dark" | "high-contrast";

export type ColorRoles = {
  "color-bg": string;
  "color-bg-subtle": string;
  "color-surface": string;
  "color-surface-2": string;
  "color-fg": string;
  "color-fg-muted": string;
  "color-fg-subtle": string;
  "color-border": string;
  "color-border-subtle": string;
  "color-accent": string;
  "color-accent-fg": string;
  "color-accent-hover": string;
  "color-success": string;
  "color-success-fg": string;
  "color-warning": string;
  "color-warning-fg": string;
  "color-danger": string;
  "color-danger-fg": string;
  "color-ring": string;
};

export type SpaceScale = Record<
  | "space-1"
  | "space-2"
  | "space-3"
  | "space-4"
  | "space-5"
  | "space-6"
  | "space-8"
  | "space-10"
  | "space-12"
  | "space-16"
  | "space-20"
  | "space-24"
  | "space-32",
  string
>;

export type MotionTokens = {
  "ease-out": string;
  "ease-in-out": string;
  "ease-spring": string;
  "dur-fast": string;
  "dur-base": string;
  "dur-slow": string;
  "dur-fast-reduced": string;
  "dur-base-reduced": string;
  "dur-slow-reduced": string;
};
