import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Awesome Design System",
    short_name: "AwesomeDS",
    description:
      "The taste layer for AI agents — doctrine, tokens, components, and motion with receipts.",
    // Locale-neutral entry: "/" is negotiated by the proxy (cookie →
    // Accept-Language → default) and redirected to /en or /ja, so a Japanese
    // install is never forced onto the English route. `id` stays "/" so the PWA
    // identity is the same regardless of the negotiated locale.
    id: "/",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF9",
    theme_color: "#FF2EA6",
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
