export interface FlagshipPosterColors {
  /** Solid OGP surface. Never #000 / #fff; those invert under color-scheme: dark. */
  bg: string;
  fg: string;
  accent: string;
  /** Flip to canvas/ink in dark theme so monochrome brand cards stay readable. */
  invertInDark?: boolean;
}

export type OgpStatus = "ok" | "missing";

export interface FlagshipOgp {
  /** Live fetch of og:image / twitter:image on 2026-10-07. */
  status: OgpStatus;
  /** Committed 1200x630 JPEG under web/public/ogp/. */
  image?: string;
  /** Absolute URL of the origin og:image or twitter:image. */
  sourceUrl?: string;
  /** Why this card uses a geometric fallback. */
  note?: string;
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
  ogp: FlagshipOgp;
  category: "platform" | "component-library" | "company" | "government" | "cookbook";
}

/**
 * Curated flagship design-system / guideline / cookbook references.
 * Card artwork prefers a committed copy of the origin og:image / twitter:image.
 * Geometric posters are fallback only when the live page has no usable OGP.
 * Fetched 2026-10-07. Refresh: `node scripts/fetch-flagship-ogp.mjs`.
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
    image: "/ogp/apple-hig.jpg",
    brandColor: "#1d1d1f",
    poster: { bg: "#1d1d1f", fg: "#f5f5f7", accent: "#86868b", invertInDark: true },
    ogp: {
      status: "ok",
      image: "/ogp/apple-hig.jpg",
      sourceUrl: "https://developer.apple.com/tutorials/developer-og.jpg",
      note: "HIG ページの og:image は Developer Documentation 共通カード。",
    },
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
    image: "/ogp/material-design.jpg",
    brandColor: "#1a73e8",
    poster: { bg: "#f8f9fa", fg: "#1f1f1f", accent: "#1a73e8" },
    ogp: {
      status: "ok",
      image: "/ogp/material-design.jpg",
      sourceUrl: "https://m3.material.io/static/assets/m3-social.jpg",
    },
    category: "platform",
  },
  {
    id: "vercel-design",
    name: "Vercel Design System",
    nameJa: "Vercel デザインシステム",
    description: "Vercel's Geist-based design system. Minimal, monochrome, edge-first. The aesthetic that shaped modern developer tools.",
    descriptionJa: "Geist フォントを軸にしたモノクロ基調の開発者ツール向け美学。モダン Web の標準。",
    url: "https://vercel.com/geist/introduction",
    domain: "vercel.com",
    image: "/ogp/vercel-design.jpg",
    brandColor: "#0a0a0a",
    poster: { bg: "#0a0a0a", fg: "#fafafa", accent: "#a3a3a3", invertInDark: true },
    ogp: {
      status: "ok",
      image: "/ogp/vercel-design.jpg",
      sourceUrl: "https://k2mkucxia43oc7fa.public.blob.vercel-storage.com/front/design/geist-og.jpg",
    },
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
    image: "/ogp/shadcn-ui.jpg",
    brandColor: "#09090b",
    poster: { bg: "#09090b", fg: "#fafafa", accent: "#71717a", invertInDark: true },
    ogp: {
      status: "ok",
      image: "/ogp/shadcn-ui.jpg",
      sourceUrl: "https://ui.shadcn.com/og?title=The%20Foundation%20for%20your%20Design%20System&description=Composable%2C%20accessible%20components%20with%20thoughtful%20defaults.%20Build%20your%20own%20component%20library%20with%20code%20you%20can%20customize%2C%20extend%2C%20and%20make%20your%20own.",
    },
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
    image: "/ogp/goodpatch.jpg",
    brandColor: "#c81e1e",
    poster: { bg: "#fafafa", fg: "#0a0a0a", accent: "#c81e1e" },
    ogp: {
      status: "ok",
      image: "/ogp/goodpatch.jpg",
      sourceUrl: "https://goodpatch.com/ogp.png",
    },
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
    image: "/ogp/duolingo.jpg",
    brandColor: "#58cc02",
    poster: { bg: "#f3fce9", fg: "#0a0a0a", accent: "#2f9e00" },
    ogp: {
      status: "ok",
      image: "/ogp/duolingo.jpg",
      sourceUrl: "https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/size/w1200/2024/09/BlogLogo.png",
      note: "design.duolingo.com は Ghost ブログになっており、og:image はブログロゴ。",
    },
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
    image: "/ogp/digital-agency-jp.jpg",
    brandColor: "#0017c1",
    poster: { bg: "#fafafa", fg: "#0a0a0a", accent: "#0017c1" },
    ogp: {
      status: "ok",
      image: "/ogp/digital-agency-jp.jpg",
      sourceUrl: "https://design.digital.go.jp/dads/images/ogp_default.png",
    },
    category: "government",
  },
  {
    id: "fluent",
    name: "Fluent 2 Design System",
    nameJa: "Fluent 2",
    description: "Microsoft's design system for Microsoft 365 and Windows. Fluent 2 covers React v9, Web Components, and cross-platform guidance.",
    descriptionJa: "Microsoft 365 と Windows 向け。React v9・Web Components を含むクロスプラットフォーム指針。",
    url: "https://fluent2.microsoft.design/",
    domain: "fluent2.microsoft.design",
    image: "/ogp/fluent.jpg",
    brandColor: "#0f6cbd",
    poster: { bg: "#f5f5f5", fg: "#0a0a0a", accent: "#0f6cbd" },
    ogp: {
      status: "ok",
      image: "/ogp/fluent.jpg",
      sourceUrl: "https://fluent2websitecdn.azureedge.net/cdn/fluent-logo-metadata.Cwa-_8F7.png",
    },
    category: "platform",
  },
  {
    id: "carbon",
    name: "Carbon Design System",
    nameJa: "IBM Carbon",
    description: "IBM's open-source design system for products and digital experiences, built on the IBM Design Language.",
    descriptionJa: "IBM Design Language を基盤とするオープンソース。React・Web Components・トークンを公開。",
    url: "https://carbondesignsystem.com/",
    domain: "carbondesignsystem.com",
    image: "/ogp/carbon.jpg",
    brandColor: "#0f62fe",
    poster: { bg: "#fafafa", fg: "#0a0a0a", accent: "#0f62fe" },
    ogp: {
      status: "ok",
      image: "/ogp/carbon.jpg",
      sourceUrl: "https://www.carbondesignsystem.com/ogimage.png",
    },
    category: "component-library",
  },
  {
    id: "polaris",
    name: "Shopify Polaris",
    nameJa: "Shopify Polaris",
    description: "Shopify's design system for admin, checkout, and merchant-facing product UI.",
    descriptionJa: "Shopify 管理画面・Checkout 向け。polaris.shopify.com は shopify.dev へリダイレクト。",
    url: "https://polaris.shopify.com/",
    domain: "polaris.shopify.com",
    image: "/ogp/polaris.jpg",
    brandColor: "#008060",
    poster: { bg: "#fafafa", fg: "#0a0a0a", accent: "#008060" },
    ogp: {
      status: "ok",
      image: "/ogp/polaris.jpg",
      sourceUrl: "https://shopify.dev/images/social-share-24de3afa0326f705b84a0a98714acc192611e5a21ade3b7c8f2bd12ba7d1457f.jpg",
      note: "リダイレクト先 shopify.dev のサイト共通 og:image。Polaris 専用カードではない。",
    },
    category: "component-library",
  },
  {
    id: "primer",
    name: "GitHub Primer",
    nameJa: "GitHub Primer",
    description: "GitHub's design system. Primer React implements the system used across github.com.",
    descriptionJa: "github.com で使われる GitHub のデザインシステム。ドキュメントは primer.style。",
    url: "https://primer.style/",
    domain: "primer.style",
    image: "",
    brandColor: "#1f2328",
    poster: { bg: "#f6f8fa", fg: "#1f2328", accent: "#0969da" },
    ogp: {
      status: "missing",
      note: "primer.style の HTML に og:image / twitter:image がない（クライアント描画）。",
    },
    category: "component-library",
  },
  {
    id: "atlassian",
    name: "Atlassian Design System",
    nameJa: "Atlassian Design",
    description: "Atlassian's design system for Jira, Confluence, and Trello. Tokens, components, and brand guidance.",
    descriptionJa: "Jira・Confluence などの Atlassian 製品向け。トークンとコンポーネントの公式ハブ。",
    url: "https://atlassian.design/",
    domain: "atlassian.design",
    image: "/ogp/atlassian.jpg",
    brandColor: "#1868db",
    poster: { bg: "#fafafa", fg: "#0a0a0a", accent: "#1868db" },
    ogp: {
      status: "ok",
      image: "/ogp/atlassian.jpg",
      sourceUrl: "https://atlassian.design/assets/df6dcb86d48a/static/0b4e62efc0d2c7d917e11f3860855c05/meta.png",
    },
    category: "company",
  },
  {
    id: "stripe",
    name: "Stripe",
    nameJa: "Stripe",
    description: "Stripe's product and marketing design language. Navy, indigo CTA, and Söhne typography.",
    descriptionJa: "決済インフラのプロダクト／マーケティング言語。navy と indigo CTA、Söhne。",
    url: "https://stripe.com/",
    domain: "stripe.com",
    image: "/ogp/stripe.jpg",
    brandColor: "#533afd",
    poster: { bg: "#0a2540", fg: "#fafafa", accent: "#533afd" },
    ogp: {
      status: "ok",
      image: "/ogp/stripe.jpg",
      sourceUrl: "https://b.stripecdn.com/mkt-ssr-statics/assets/_next/static/media/stripe.37119086.jpg",
    },
    category: "company",
  },
  {
    id: "linear",
    name: "Linear",
    nameJa: "Linear",
    description: "Linear's product-development UI. Dark surfaces, hairline structure, one lavender accent.",
    descriptionJa: "課題管理ツールの UI。暗い面、1px hairline、lavender 1 色の SaaS 様式。",
    url: "https://linear.app/",
    domain: "linear.app",
    image: "/ogp/linear.jpg",
    brandColor: "#5e6ad2",
    poster: { bg: "#0a0a0a", fg: "#fafafa", accent: "#5e6ad2", invertInDark: true },
    ogp: {
      status: "ok",
      image: "/ogp/linear.jpg",
      sourceUrl: "https://linear.app/api/og/main?title=Linear&v=4",
    },
    category: "company",
  },
  {
    id: "smarthr",
    name: "SmartHR Design System",
    nameJa: "SmartHR Design System",
    description: "Japanese HR SaaS design system. Warm greys, product blue, 6px radius, accessibility as a requirement.",
    descriptionJa: "人事労務 SaaS の公開デザインシステム。ウォームグレーと 6px 角丸。",
    url: "https://smarthr.design/",
    domain: "smarthr.design",
    image: "/ogp/smarthr.jpg",
    brandColor: "#00c4cc",
    poster: { bg: "#f8f7f6", fg: "#23221e", accent: "#0077c7" },
    ogp: {
      status: "ok",
      image: "/ogp/smarthr.jpg",
      sourceUrl: "https://smarthr.design/images/ogp.png",
    },
    category: "company",
  },
  {
    id: "spectrum",
    name: "Adobe Spectrum",
    nameJa: "Adobe Spectrum",
    description: "Adobe's design system. Spectrum, React Aria, and React Stately cover visual language plus accessible behavior.",
    descriptionJa: "Adobe 製品横断の共有言語。React Spectrum / Aria / Stately で実装。",
    url: "https://spectrum.adobe.com/",
    domain: "spectrum.adobe.com",
    image: "/ogp/spectrum.jpg",
    brandColor: "#1473e6",
    poster: { bg: "#0a0a0a", fg: "#fafafa", accent: "#1473e6" },
    ogp: {
      status: "ok",
      image: "/ogp/spectrum.jpg",
      sourceUrl: "https://spectrum.adobe.com/media_1270372ba73a31b64cb998d3c4a0a3d44e565196f.png",
    },
    category: "component-library",
  },
  {
    id: "antd",
    name: "Ant Design",
    nameJa: "Ant Design",
    description: "Enterprise-class React UI library and design language. TypeScript, theming, and dozens of locales.",
    descriptionJa: "企業向け React UI とデザイン言語。TypeScript、テーマ、多言語。",
    url: "https://ant.design/",
    domain: "ant.design",
    image: "/ogp/antd.jpg",
    brandColor: "#1677ff",
    poster: { bg: "#0a0a0a", fg: "#fafafa", accent: "#1677ff" },
    ogp: {
      status: "ok",
      image: "/ogp/antd.jpg",
      sourceUrl: "https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png",
      note: "公式 og:image は 200x200 ロゴ。1200x630 にパディングして掲載。",
    },
    category: "component-library",
  },
  {
    id: "base-ui",
    name: "Base UI",
    nameJa: "Base UI",
    description: "Unstyled accessible React components from the MUI team. Headless primitives for design systems.",
    descriptionJa: "MUI チームのヘッドレス React。デザインシステム向けの非スタイル部品。",
    url: "https://base-ui.com/",
    domain: "base-ui.com",
    image: "/ogp/base-ui.jpg",
    brandColor: "#0a0a0a",
    poster: { bg: "#0a0a0a", fg: "#fafafa", accent: "#71717a", invertInDark: true },
    ogp: {
      status: "ok",
      image: "/ogp/base-ui.jpg",
      sourceUrl: "https://base-ui.com/opengraph-image-j8qpfc.png?b1b9e0366e512854",
    },
    category: "component-library",
  },
  {
    id: "radix",
    name: "Radix Primitives",
    nameJa: "Radix Primitives",
    description: "Unstyled, accessible React primitives. WAI-ARIA behavior for high-quality design systems.",
    descriptionJa: "非スタイルのアクセシブルな React primitives。WAI-ARIA の振る舞いを提供。",
    url: "https://www.radix-ui.com/primitives",
    domain: "radix-ui.com",
    image: "/ogp/radix.jpg",
    brandColor: "#11181c",
    poster: { bg: "#f8fafc", fg: "#0a0a0a", accent: "#3e63dd" },
    ogp: {
      status: "ok",
      image: "/ogp/radix.jpg",
      sourceUrl: "https://www.radix-ui.com/primitives/opengraph-image.png?opengraph-image.0rn7txzeny89p.png",
      note: "トップ radix-ui.com には twitter:image がなく、Primitives ページの og:image を使用。",
    },
    category: "component-library",
  },
  {
    id: "govuk",
    name: "GOV.UK Design System",
    nameJa: "GOV.UK Design System",
    description: "UK government design system. GOV.UK Frontend helps services meet WCAG 2.2 AA.",
    descriptionJa: "英国政府のデザインシステム。Frontend は WCAG 2.2 AA 達成を助ける。",
    url: "https://design-system.service.gov.uk/",
    domain: "design-system.service.gov.uk",
    image: "/ogp/govuk.jpg",
    brandColor: "#1d70b8",
    poster: { bg: "#1d70b8", fg: "#fafafa", accent: "#1d70b8" },
    ogp: {
      status: "ok",
      image: "/ogp/govuk.jpg",
      sourceUrl: "https://design-system.service.gov.uk/assets/images/govuk-opengraph-image.png",
    },
    category: "government",
  },
  {
    id: "uswds",
    name: "U.S. Web Design System",
    nameJa: "USWDS",
    description: "Design system for U.S. federal government websites. Public-domain components and a visual style guide.",
    descriptionJa: "米国連邦政府サイト向け。パブリックドメインの部品と視覚スタイルガイド。",
    url: "https://designsystem.digital.gov/",
    domain: "designsystem.digital.gov",
    image: "/ogp/uswds.jpg",
    brandColor: "#005ea2",
    poster: { bg: "#fafafa", fg: "#0a0a0a", accent: "#005ea2" },
    ogp: {
      status: "ok",
      image: "/ogp/uswds.jpg",
      sourceUrl: "https://designsystem.digital.gov/img/uswds-logo/lg-black.png",
      note: "公式 og:image は 200x200 ロゴ。1200x630 にパディングして掲載。",
    },
    category: "government",
  },
  {
    id: "gitlab-pajamas",
    name: "Pajamas Design System",
    nameJa: "GitLab Pajamas",
    description: "GitLab's single source of truth for resources, components, and design guidelines.",
    descriptionJa: "GitLab の単一の正本。コンポーネントは GitLab UI、Figma UI kit は参照用。",
    url: "https://design.gitlab.com/",
    domain: "design.gitlab.com",
    image: "/ogp/gitlab-pajamas.jpg",
    brandColor: "#6b4fbb",
    poster: { bg: "#6b4fbb", fg: "#fafafa", accent: "#fc6d26" },
    ogp: {
      status: "ok",
      image: "/ogp/gitlab-pajamas.jpg",
      sourceUrl: "https://design.gitlab.com/img/social/link-preview.png",
    },
    category: "company",
  },
  {
    id: "nordhealth",
    name: "Nord Design System",
    nameJa: "Nord Design System",
    description: "Nordhealth's design system for coherent product experiences. Web components, any framework.",
    descriptionJa: "Nordhealth の公開デザインシステム。Web Components でフレームワーク非依存。",
    url: "https://nordhealth.design/",
    domain: "nordhealth.design",
    image: "/ogp/nordhealth.jpg",
    brandColor: "#1860f0",
    poster: { bg: "#f4f7fb", fg: "#0a0a0a", accent: "#1860f0" },
    ogp: {
      status: "ok",
      image: "/ogp/nordhealth.jpg",
      sourceUrl:
        "https://nordhealth.design/_og/s/c_Banner,title_Nord+Design+System,description_~RGVzaWduLCBidWlsZCwgYW5kIHNoaXAgY29oZXJlbnQgZXhwZXJpZW5jZXMgd2l0aCBOb3JkaGVhbHRoJ3MgTm9yZCBEZXNpZ24gU3lzdGVtLg,rev_2.png",
    },
    category: "company",
  },
  {
    id: "inclusive-components",
    name: "Inclusive Components",
    nameJa: "Inclusive Components",
    description: "Heydon Pickering's pattern library for accessible UI components, piece by piece.",
    descriptionJa: "Heydon Pickering のアクセシブル UI パターン集。部品ごとに HTML と ARIA を示す。",
    url: "https://inclusive-components.design/",
    domain: "inclusive-components.design",
    image: "",
    brandColor: "#111111",
    poster: { bg: "#f4efe6", fg: "#0a0a0a", accent: "#0b5fff" },
    ogp: {
      status: "missing",
      note: "og:title はあるが og:image / twitter:image がない（twitter:card は summary）。",
    },
    category: "cookbook",
  },
  {
    id: "laws-of-ux",
    name: "Laws of UX",
    nameJa: "Laws of UX",
    description: "Jon Yablonski's collection of psychology principles for interface design.",
    descriptionJa: "Jon Yablonski がまとめた UI 設計の心理学法則。定義と背景を 1 法則ずつ掲載。",
    url: "https://lawsofux.com/",
    domain: "lawsofux.com",
    image: "/ogp/laws-of-ux.jpg",
    brandColor: "#1a1a1a",
    poster: { bg: "#1a1a1a", fg: "#f5f0e6", accent: "#c4a35a" },
    ogp: {
      status: "ok",
      image: "/ogp/laws-of-ux.jpg",
      sourceUrl: "https://lawsofux.com/home/social.en.png",
    },
    category: "cookbook",
  },
  {
    id: "refactoring-ui",
    name: "Refactoring UI",
    nameJa: "Refactoring UI",
    description: "Adam Wathan and Steve Schoger's practical visual-design handbook for developers.",
    descriptionJa: "Adam Wathan と Steve Schoger の開発者向け視覚デザイン実務書。",
    url: "https://www.refactoringui.com/",
    domain: "refactoringui.com",
    image: "/ogp/refactoring-ui.jpg",
    brandColor: "#38bdf8",
    poster: { bg: "#0b1220", fg: "#fafafa", accent: "#38bdf8" },
    ogp: {
      status: "ok",
      image: "/ogp/refactoring-ui.jpg",
      sourceUrl: "https://refactoringui.com/img/homepage/og-image.png",
      note: "og:image は無く twitter:image を使用。",
    },
    category: "cookbook",
  },
  {
    id: "nielsen",
    name: "Nielsen 10 Usability Heuristics",
    nameJa: "Nielsen 10 ヒューリスティクス",
    description: "Jakob Nielsen's 10 usability heuristics. The most widely used criteria for UI review.",
    descriptionJa: "Jakob Nielsen の 10 ユーザビリティヒューリスティクス。UI レビューの標準的な基準。",
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/",
    domain: "nngroup.com",
    image: "/ogp/nielsen.jpg",
    brandColor: "#ffc20e",
    poster: { bg: "#1b1464", fg: "#fafafa", accent: "#ffc20e" },
    ogp: {
      status: "ok",
      image: "/ogp/nielsen.jpg",
      sourceUrl: "https://media.nngroup.com/media/articles/opengraph_images/Updated10HeuristicSocialCard-36.png",
    },
    category: "cookbook",
  },
];

const categoryLabelMap: Record<DesignSystemRef["category"], string> = {
  platform: "プラットフォーム",
  "component-library": "コンポーネントライブラリ",
  company: "企業・プロダクト",
  government: "行政・公共",
  cookbook: "ガイドライン・クックブック",
};

export function categoryLabel(category: DesignSystemRef["category"]): string {
  return categoryLabelMap[category];
}

export function ogpStats(list: DesignSystemRef[] = flagshipSystems) {
  const ok = list.filter((s) => s.ogp.status === "ok");
  const missing = list.filter((s) => s.ogp.status === "missing");
  return { total: list.length, ok: ok.length, missing };
}
