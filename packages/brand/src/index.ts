import { z } from "zod";

const OwnerSchema = z.object({
  name: z.string().min(1),
  contact: z.string().min(3),
});

export const LexiconEntrySchema = z.object({
  term: z.string().min(1),
  definition: z.string().min(1),
  status: z.enum(["preferred", "allowed", "deprecated", "forbidden", "internal"]),
  replacement: z.string().min(1).optional(),
  locales: z.array(z.string().min(2)).min(1),
  owner: z.string().min(1),
});

export type ProductLexicon = z.infer<typeof LexiconEntrySchema>[];

export const BrandManifestSchema = z.object({
  id: z.string().regex(/^brand\.[a-z0-9-]+$/),
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  owner: OwnerSchema,
  personality: z.object({
    traits: z.array(z.string().min(1)).min(3).max(5),
    antiTraits: z.array(z.string().min(1)).min(2),
  }),
  marks: z.array(z.object({
    id: z.string().min(1),
    role: z.enum(["primary", "compact", "icon", "partner", "monochrome"]),
    assetPath: z.string().min(1),
    minPx: z.number().positive(),
    minMm: z.number().positive().optional(),
    safeArea: z.number().nonnegative(),
    allowedBackgrounds: z.array(z.enum(["light", "dark", "image", "brand"])).min(1),
  })).min(1),
  typography: z.array(z.object({
    id: z.string().min(1),
    role: z.enum(["display", "body", "mono", "ui", "editorial"]),
    family: z.string().min(1),
    fallback: z.string().min(1),
    scripts: z.array(z.string().min(4)).min(1),
    license: z.string().min(1),
  })).min(1),
  imagery: z.object({
    defaultMode: z.enum(["photography", "illustration", "mixed"]),
    syntheticMediaDisclosure: z.enum(["required", "contextual", "prohibited"]),
    requireRights: z.boolean(),
    requireAltText: z.boolean(),
  }),
  lexicon: z.array(LexiconEntrySchema),
  assets: z.array(z.object({
    id: z.string().min(1),
    path: z.string().min(1),
    license: z.string().min(1),
    checksum: z.string().regex(/^sha256:/),
    owner: z.string().min(1),
    status: z.enum(["draft", "active", "deprecated", "retired"]),
  })).min(1),
});

export type BrandManifest = z.infer<typeof BrandManifestSchema>;

export type CopyLintIssue = {
  term: string;
  severity: "warning" | "error";
  message: string;
  replacement?: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function termPattern(term: string) {
  const escaped = escapeRegExp(term);
  const usesWordSpacing = !/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(term);
  return new RegExp(
    usesWordSpacing ? `(^|[^\\p{L}\\p{N}])${escaped}(?=$|[^\\p{L}\\p{N}])` : escaped,
    "iu",
  );
}

export function lintProductCopy(text: string, lexicon: ProductLexicon, locale: string): CopyLintIssue[] {
  return lexicon.flatMap((entry) => {
    if (!entry.locales.includes(locale) || !["deprecated", "forbidden"].includes(entry.status)) return [];
    const pattern = termPattern(entry.term);
    if (!pattern.test(text)) return [];
    const severity = entry.status === "forbidden" ? "error" : "warning";
    return [{
      term: entry.term,
      severity,
      message: entry.status === "forbidden" ? `Do not use “${entry.term}”.` : `“${entry.term}” is deprecated.`,
      ...(entry.replacement ? { replacement: entry.replacement } : {}),
    } satisfies CopyLintIssue];
  });
}
