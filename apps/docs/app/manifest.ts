import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Awesome Design System",
    short_name: "AwesomeDS",
    description:
      "Evidence-backed design intelligence for humans and AI agents.",
    start_url: "/en",
    display: "standalone",
    background_color: "#f7f5ef",
    theme_color: "#171713",
    lang: "en",
    categories: ["design", "developer", "education"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
