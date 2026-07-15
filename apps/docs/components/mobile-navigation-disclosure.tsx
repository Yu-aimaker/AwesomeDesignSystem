"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

export function MobileNavigationDisclosure({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false;
  }, [pathname]);

  return (
    <details className="nav-disclosure" ref={detailsRef}>
      <summary aria-label={label} aria-controls="mobile-site-navigation"><span /><span /></summary>
      {children}
    </details>
  );
}
