import type { ColorRoles, MotionTokens, SpaceScale, ThemeName } from "./types";

export const primitives = {
  brand: {
    50: "oklch(0.971 0.013 264)",
    100: "oklch(0.936 0.032 264)",
    500: "oklch(0.637 0.200 264)",
    600: "oklch(0.560 0.190 264)",
    700: "oklch(0.476 0.160 264)",
  },
  accent: {
    500: "oklch(0.780 0.210 84)",
    600: "oklch(0.700 0.190 84)",
  },
  neutral: {
    0: "oklch(1 0 0)",
    50: "oklch(0.985 0.004 264)",
    100: "oklch(0.967 0.006 264)",
    200: "oklch(0.928 0.008 264)",
    300: "oklch(0.872 0.010 264)",
    400: "oklch(0.715 0.012 264)",
    500: "oklch(0.556 0.013 264)",
    600: "oklch(0.446 0.013 264)",
    700: "oklch(0.372 0.012 264)",
    800: "oklch(0.279 0.011 264)",
    900: "oklch(0.210 0.012 264)",
    950: "oklch(0.145 0.010 264)",
  },
  success: "oklch(0.700 0.160 150)",
  warning: "oklch(0.800 0.160 80)",
  danger: "oklch(0.637 0.237 25)",
} as const;

export const space: SpaceScale = {
  "space-1": "0.25rem",
  "space-2": "0.5rem",
  "space-3": "0.75rem",
  "space-4": "1rem",
  "space-5": "1.25rem",
  "space-6": "1.5rem",
  "space-8": "2rem",
  "space-10": "2.5rem",
  "space-12": "3rem",
  "space-16": "4rem",
  "space-20": "5rem",
  "space-24": "6rem",
  "space-32": "8rem",
};

export const radius = {
  "radius-sm": "0.25rem",
  "radius-md": "0.5rem",
  "radius-lg": "0.75rem",
  "radius-xl": "1rem",
  "radius-2xl": "1.25rem",
  "radius-full": "9999px",
} as const;

export const typography = {
  "font-display":
    '"Iowan Old Style", "Palatino Linotype", Palatino, "Hiragino Mincho ProN", "Yu Mincho", serif',
  "font-body":
    '"IBM Plex Sans", "Hiragino Sans", "Noto Sans JP", system-ui, sans-serif',
  "font-mono":
    '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  "text-xs": "0.75rem",
  "text-sm": "0.875rem",
  "text-base": "1rem",
  "text-lg": "1.125rem",
  "text-xl": "1.25rem",
  "text-2xl": "1.5rem",
  "text-3xl": "1.875rem",
  "text-4xl": "2.25rem",
  "text-5xl": "3rem",
  "text-6xl": "3.75rem",
  "text-7xl": "4.5rem",
  "leading-tight": "1.2",
  "leading-normal": "1.55",
  "leading-relaxed": "1.7",
  "tracking-tight": "-0.02em",
  "tracking-normal": "0",
} as const;

export const elevation = {
  "shadow-sm": "0 1px 2px oklch(0.2 0.02 264 / 0.06)",
  "shadow-md": "0 4px 12px oklch(0.2 0.02 264 / 0.08)",
  "shadow-lg": "0 12px 32px oklch(0.2 0.02 264 / 0.12)",
  "shadow-xl": "0 24px 48px oklch(0.2 0.02 264 / 0.16)",
} as const;

export const motionTokens: MotionTokens = {
  "ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
  "ease-in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
  "ease-spring": "cubic-bezier(0.34, 1.4, 0.64, 1)",
  "dur-fast": "120ms",
  "dur-base": "200ms",
  "dur-slow": "360ms",
  "dur-fast-reduced": "0ms",
  "dur-base-reduced": "0ms",
  "dur-slow-reduced": "0ms",
};

export const lightTheme: ColorRoles = {
  "color-bg": primitives.neutral[0],
  "color-bg-subtle": primitives.neutral[50],
  "color-surface": primitives.neutral[0],
  "color-surface-2": primitives.neutral[100],
  "color-fg": primitives.neutral[900],
  "color-fg-muted": primitives.neutral[600],
  "color-fg-subtle": primitives.neutral[500],
  "color-border": primitives.neutral[200],
  "color-border-subtle": primitives.neutral[100],
  "color-accent": primitives.brand[500],
  "color-accent-fg": primitives.neutral[0],
  "color-accent-hover": primitives.brand[600],
  "color-success": primitives.success,
  "color-success-fg": primitives.neutral[0],
  "color-warning": primitives.warning,
  "color-warning-fg": primitives.neutral[900],
  "color-danger": primitives.danger,
  "color-danger-fg": primitives.neutral[0],
  "color-ring": primitives.brand[500],
};

export const darkTheme: ColorRoles = {
  "color-bg": primitives.neutral[950],
  "color-bg-subtle": primitives.neutral[900],
  "color-surface": primitives.neutral[900],
  "color-surface-2": primitives.neutral[800],
  "color-fg": primitives.neutral[50],
  "color-fg-muted": primitives.neutral[400],
  "color-fg-subtle": primitives.neutral[500],
  "color-border": primitives.neutral[700],
  "color-border-subtle": primitives.neutral[800],
  "color-accent": "oklch(0.704 0.165 264)",
  "color-accent-fg": primitives.neutral[950],
  "color-accent-hover": primitives.brand[500],
  "color-success": primitives.success,
  "color-success-fg": primitives.neutral[950],
  "color-warning": primitives.warning,
  "color-warning-fg": primitives.neutral[950],
  "color-danger": primitives.danger,
  "color-danger-fg": primitives.neutral[0],
  "color-ring": "oklch(0.704 0.165 264)",
};

export const highContrastTheme: ColorRoles = {
  "color-bg": "oklch(1 0 0)",
  "color-bg-subtle": "oklch(1 0 0)",
  "color-surface": "oklch(1 0 0)",
  "color-surface-2": "oklch(0.97 0 0)",
  "color-fg": "oklch(0 0 0)",
  "color-fg-muted": "oklch(0.2 0 0)",
  "color-fg-subtle": "oklch(0.25 0 0)",
  "color-border": "oklch(0 0 0)",
  "color-border-subtle": "oklch(0.2 0 0)",
  "color-accent": "oklch(0.35 0.2 264)",
  "color-accent-fg": "oklch(1 0 0)",
  "color-accent-hover": "oklch(0.25 0.18 264)",
  "color-success": "oklch(0.35 0.16 150)",
  "color-success-fg": "oklch(1 0 0)",
  "color-warning": "oklch(0.55 0.16 80)",
  "color-warning-fg": "oklch(0 0 0)",
  "color-danger": "oklch(0.4 0.23 25)",
  "color-danger-fg": "oklch(1 0 0)",
  "color-ring": "oklch(0 0 0)",
};

export const themes: Record<ThemeName, ColorRoles> = {
  light: lightTheme,
  dark: darkTheme,
  "high-contrast": highContrastTheme,
};

export const tokens = {
  primitives,
  space,
  radius,
  typography,
  elevation,
  motion: motionTokens,
  themes,
} as const;
