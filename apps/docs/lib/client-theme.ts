export function persistTheme(theme: string) {
  document.documentElement.setAttribute("data-theme", theme);
  document.cookie = `awesome-theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
