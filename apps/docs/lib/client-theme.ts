export const THEME_CHANGE_EVENT = "awesome-theme-change";

export function persistTheme(theme: string) {
  document.documentElement.setAttribute("data-theme", theme);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `awesome-theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme }));
}
