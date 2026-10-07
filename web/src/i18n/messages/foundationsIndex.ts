import type { Localized } from "../locales";

const ja = {
  title: "基盤",
  lead: "見て、触って、比べる。理由は各ページの「なぜ」に。",
  more: "ほかの観点",
  moreLead: "仕様と理由は各解説に。1 行は覚えるべき規則。",
  readAll: "すべての解説を読む",
  tokenSummary: (colors: number, space: number, radius: number) => `トークンは ${colors} 色役割、${space} 段階の余白、${radius} 段階の角丸。`,
};

export type FoundationsIndexMessages = typeof ja;

const en: FoundationsIndexMessages = {
  title: "Foundations",
  lead: "See it, try it, compare. The reasons are under \"Why\" on each page.",
  more: "More perspectives",
  moreLead: "Specs and reasons are in each note. The line under each title is the rule to remember.",
  readAll: "Read all notes",
  tokenSummary: (colors, space, radius) => `Tokens: ${colors} color roles, ${space} spacing steps, ${radius} radius steps.`,
};

export const foundationsIndexMessages: Localized<FoundationsIndexMessages> = { ja, en };
