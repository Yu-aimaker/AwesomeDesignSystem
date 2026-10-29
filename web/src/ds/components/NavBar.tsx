import type { ReactNode } from "react";
import { cx } from "../cx";
import { useT } from "../../i18n/context";
import { dsMessages } from "../../i18n/messages/dsComponents";

export interface NavBarLink {
  label: string;
  href: string;
  current?: boolean;
}

export interface NavBarProps {
  brand: ReactNode;
  links: NavBarLink[];
  actions?: ReactNode;
}

// 64px bar, hairline below, brand left, links center-left, actions right.
// Links never wrap: on narrow screens the parent swaps this for a menu.
export function NavBar({ brand, links, actions }: NavBarProps) {
  const m = useT(dsMessages);
  return (
    <header className="flex h-16 items-center gap-6 border-b border-hairline bg-canvas px-4">
      <div className="t-label shrink-0 text-ink">{brand}</div>
      <nav aria-label={m.mainNav} className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
        {links.map((l) => (
          <a
            key={`${l.href}-${l.label}`}
            href={l.href}
            aria-current={l.current ? "page" : undefined}
            className={cx(
              "t-label shrink-0 rounded-md px-3 py-2 no-underline transition-colors duration-instant ease-out-ds",
              l.current ? "bg-surface-sunken text-ink" : "text-ink-secondary hover:bg-surface-sunken hover:text-ink",
            )}
          >
            {l.label}
          </a>
        ))}
      </nav>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
