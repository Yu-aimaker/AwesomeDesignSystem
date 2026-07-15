// The canonical information architecture: four navigation verbs.
//   START  — decide: the Canon and its principles.
//   EXPLORE — orient: the Reference Atlas, AI-design guidance, and the brand.
//   BUILD  — make: foundations, components, motion, patterns, interaction.
//   VERIFY — check: review/governance, release reports, system status, and the playground.
// The three-step production loop on the home page (Canon → Build → Verify) is the
// linear spine through START → BUILD → VERIFY; EXPLORE is the reference layer you
// can open at any step. Keep this file and the home/README copy in agreement.
export const nav = [
  { href: "/", label: "Home", section: "start" },
  { href: "/canon", label: "Canon", section: "start" },
  { href: "/principles", label: "Principles", section: "start" },
  { href: "/references", label: "Reference Atlas", section: "explore" },
  { href: "/ai-design", label: "AI Design", section: "explore" },
  { href: "/brand", label: "Brand", section: "explore" },
  { href: "/foundations", label: "Foundations", section: "build" },
  { href: "/components", label: "Components", section: "build" },
  { href: "/motion", label: "Motion", section: "build" },
  { href: "/patterns", label: "Patterns", section: "build" },
  { href: "/interaction", label: "Interaction", section: "build" },
  { href: "/review", label: "Review", section: "verify" },
  { href: "/reports", label: "Reports", section: "verify" },
  { href: "/status", label: "Status", section: "verify" },
  { href: "/playground", label: "Playground", section: "verify" },
] as const;
