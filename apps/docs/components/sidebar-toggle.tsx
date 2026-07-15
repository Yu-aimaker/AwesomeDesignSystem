"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { SIDEBAR_COOKIE, type SidebarState } from "../lib/sidebar-state";

export function SidebarToggle({
  initialState,
  collapseLabel,
  expandLabel,
}: {
  initialState: SidebarState;
  collapseLabel: string;
  expandLabel: string;
}) {
  const [state, setState] = useState(initialState);
  const hydrated = useSyncExternalStore(subscribeToHydration, getClientSnapshot, getServerSnapshot);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const expanded = state === "expanded";
  const label = expanded ? collapseLabel : expandLabel;

  function toggle() {
    const next: SidebarState = expanded ? "collapsed" : "expanded";
    setState(next);
    const shell = buttonRef.current?.closest<HTMLElement>(".shell");
    if (shell) shell.dataset.sidebarState = next;

    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${SIDEBAR_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className="sidebar-toggle"
      aria-controls="desktop-site-navigation"
      aria-expanded={expanded}
      aria-label={label}
      title={label}
      disabled={!hydrated}
      onClick={toggle}
    >
      <span className="sidebar-toggle__glyph" aria-hidden="true">
        <i />
        <i />
      </span>
      <span className="sidebar-toggle__label">{label}</span>
    </button>
  );
}

function subscribeToHydration() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}
