import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "../components/site-shell";

export const metadata: Metadata = {
  title: {
    default: "Awesome Design System",
    template: "%s · AwesomeDS",
  },
  description: "Evidence-backed design bible, Reference Atlas, React components, and motion recipes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
