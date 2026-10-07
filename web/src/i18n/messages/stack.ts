import type { Localized } from "../locales";

const ja = {
  title: "スタック",
  lead: "1 層に 1 つ。代替は「いつ勝つか」を 1 行で持つ。",
  statLabel: "層",
  when: "いつ",
  official: "公式",
  dataNote: (layers: number, tools: number) =>
    `${layers} 層、${tools} ツール。選定は大規模プロダクトの採用実績と AI コーディングエージェントの生成精度を基準に。毎週の調査 Issue で見直します。仕様は AwesomeDS/foundations/stack.md。`,
};

export type StackMessages = typeof ja;

const en: StackMessages = {
  title: "Stack",
  lead: "One pick per layer. Each alternative has one line on when it wins.",
  statLabel: "layers",
  when: "When",
  official: "Official site",
  dataNote: (layers, tools) =>
    `${layers} layers, ${tools} tools. Picked by adoption in large products and by how well AI coding agents generate code for them. Reviewed in the weekly research issue. Spec: AwesomeDS/foundations/stack.md.`,
};

export const stackMessages: Localized<StackMessages> = { ja, en };
