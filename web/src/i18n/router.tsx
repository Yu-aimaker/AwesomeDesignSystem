// Locale-aware wrappers for react-router. Import Link / NavLink / Navigate /
// useNavigate from here inside the site so absolute paths keep the locale.
import { forwardRef } from "react";
import {
  Link as RRLink,
  NavLink as RRNavLink,
  Navigate as RRNavigate,
  useNavigate as useRRNavigate,
  type LinkProps,
  type NavigateProps,
  type NavLinkProps,
  type To,
} from "react-router";
import { useLocale } from "./context";
import { localizePath, type Locale } from "./locales";

function localizeTo(to: To, locale: Locale): To {
  if (typeof to === "string") return localizePath(to, locale);
  return to.pathname ? { ...to, pathname: localizePath(to.pathname, locale) } : to;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, ...rest }, ref) {
  const { locale } = useLocale();
  return <RRLink ref={ref} to={localizeTo(to, locale)} {...rest} />;
});

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink({ to, end, ...rest }, ref) {
  const { locale } = useLocale();
  const localized = localizeTo(to, locale);
  // The localized home is `/en`; without `end` it would match every English page.
  return <RRNavLink ref={ref} to={localized} end={end ?? (to === "/")} {...rest} />;
});

export function Navigate({ to, ...rest }: NavigateProps) {
  const { locale } = useLocale();
  return <RRNavigate to={localizeTo(to, locale)} {...rest} />;
}

export function useNavigate() {
  const navigate = useRRNavigate();
  const { locale } = useLocale();
  return (to: To) => navigate(localizeTo(to, locale));
}
