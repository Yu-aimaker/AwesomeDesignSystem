import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Awesome Design System",
    short_name: "AwesomeDS",
    description:
      "Evidence-backed design intelligence for humans and AI agents.",
    // Locale-neutral entry: "/" is negotiated by the proxy (cookie →
    // Accept-Language → default) and redirected to /en or /ja, so a Japanese
    // install is never forced onto the English route. `id` stays "/" so the PWA
    // identity is the same regardless of the negotiated locale.
    id: "/",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF9",
    theme_color: "#C0472A",
    categories: ["design", "developer", "education"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
