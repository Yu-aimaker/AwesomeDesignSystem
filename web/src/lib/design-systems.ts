export interface FlagshipPosterColors {
  /** Solid OGP surface. Never #000 / #fff — those invert under color-scheme: dark. */
  bg: string;
  fg: string;
  accent: string;
  /** Flip to canvas/ink in dark theme so monochrome brand cards stay readable. */
  invertInDark?: boolean;
}

export interface DesignSystemRef {
  id: string;
  name: string;
  nameJa?: string;
  description: string;
  descriptionJa: string;
  url: string;
  domain: string;
  image: string;
  brandColor: string;
  poster: FlagshipPosterColors;
  category: "platform" | "component-library" | "company" | "government";
}

/**
 * Curated flagship design-system / guideline references.
 * Images are committed SVGs under web/public/ogp/ — no runtime fetching.
 */
export const flagshipSystems: DesignSystemRef[] = [
  {
    id: "apple-hig",
    name: "Apple Human Interface Guidelines",
    nameJa: "Apple HIG",
    description: "Apple's comprehensive design guidelines for iOS, macOS, watchOS, tvOS, and visionOS. The gold standard for platform-native design.",
    descriptionJa: "iOS・macOS・visionOS 等すべての Apple プラットフォームの設計指針。ネイティブ体験の基準。",
    url: "https://developer.apple.com/design/human-interface-guidelines",
    domain: "developer.apple.com",
    image: "/ogp/apple-hig.svg",
    brandColor: "#1d1d1f",
    poster: { bg: "#1d1d1f", fg: "#f5f5f7", accent: "#86868b", invertInDark: true },
    category: "platform",
  },
  {
    id: "material-design",
    name: "Material Design 3",
    nameJa: "Material Design 3",
    description: "Google's open-source design system. Material 3 brings dynamic color, updated components, and expressive design foundations.",
    descriptionJa: "Google のオープンソースデザインシステム。Dynamic Color と表現力豊かなコンポーネント群。",
    url: "https://m3.material.io/",
    domain: "m3.material.io",
    image: "/ogp/material-design.svg",
    brandColor: "#1a73e8",
    poster: { bg: "#f8f9fa", fg: "#1f1f1f", accent: "#1a73e8" },
    category: "platform",
  },
  {
    id: "vercel-design",
    name: "Vercel Design System",
    nameJa: "Vercel デザインシステム",
    description: "Vercel's Geist-based design system. Minimal, monochrome, edge-first — the aesthetic that shaped modern developer tools.",
    descriptionJa: "Geist フォントを軸にしたモノクロ基調の開発者ツール向け美学。モダン Web の標準。",
    url: "https://vercel.com/geist/introduction",
    domain: "vercel.com",
    image: "/ogp/vercel-design.svg",
    brandColor: "#0a0a0a",
    poster: { bg: "#0a0a0a", fg: "#fafafa", accent: "#a3a3a3", invertInDark: true },
    category: "company",
  },
  {
    id: "shadcn-ui",
    name: "shadcn/ui",
    nameJa: "shadcn/ui",
    description: "Beautifully designed, accessible components built with Radix UI and Tailwind CSS. Copy-paste, not npm install.",
    descriptionJa: "Radix UI + Tailwind CSS のコピペ型コンポーネント集。美しく、アクセシブル。",
    url: "https://ui.shadcn.com/",
    domain: "ui.shadcn.com",
    image: "/ogp/shadcn-ui.svg",
    brandColor: "#09090b",
    poster: { bg: "#09090b", fg: "#fafafa", accent: "#71717a", invertInDark: true },
    category: "component-library",
  },
  {
    id: "goodpatch",
    name: "Goodpatch",
    nameJa: "Goodpatch",
    description: "Japan's leading design company. Known for Prott, ReDesigner, and a design-driven approach to product development.",
    descriptionJa: "日本を代表するデザイン会社。Prott・ReDesigner を生んだデザイン駆動の開発手法。",
    url: "https://goodpatch.com/",
    domain: "goodpatch.com",
    image: "/ogp/goodpatch.svg",
    brandColor: "#c81e1e",
    poster: { bg: "#fafafa", fg: "#0a0a0a", accent: "#c81e1e" },
    category: "company",
  },
  {
    id: "duolingo",
    name: "Duolingo Design",
    nameJa: "Duolingo デザイン",
    description: "Duolingo's playful, accessible, and motivating design system. A masterclass in gamification UX and inclusive design.",
    descriptionJa: "遊び心とアクセシビリティを両立するゲーミフィケーション UX の教科書。",
    url: "https://design.duolingo.com/",
    domain: "design.duolingo.com",
    image: "/ogp/duolingo.svg",
    brandColor: "#58cc02",
    poster: { bg: "#f3fce9", fg: "#0a0a0a", accent: "#2f9e00" },
    category: "company",
  },
  {
    id: "digital-agency-jp",
    name: "デジタル庁デザインシステム",
    nameJa: "デジタル庁デザインシステム",
    description: "Japan Digital Agency's design system for government services. Built for accessibility and inclusivity at national scale.",
    descriptionJa: "「誰一人取り残されない」を掲げる日本政府のデザインシステム。行政サービスのアクセシビリティ基準。",
    url: "https://design.digital.go.jp/",
    domain: "design.digital.go.jp",
    image: "/ogp/digital-agency-jp.svg",
    brandColor: "#0017c1",
    poster: { bg: "#fafafa", fg: "#0a0a0a", accent: "#0017c1" },
    category: "government",
  },
];

const categoryLabelMap: Record<DesignSystemRef["category"], string> = {
  platform: "プラットフォーム",
  "component-library": "コンポーネントライブラリ",
  company: "企業・プロダクト",
  government: "行政・公共",
};

export function categoryLabel(category: DesignSystemRef["category"]): string {
  return categoryLabelMap[category];
}
