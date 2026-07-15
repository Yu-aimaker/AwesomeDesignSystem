<div align="center">

<img src="./assets/banner.svg" alt="AwesomeDesignSystem — 面向 AI 代理的品味层" width="100%">

&nbsp;

[![License: MIT](https://img.shields.io/badge/License-MIT-1FB8B8?style=flat-square)](./LICENSE)
[![Reference Atlas: 127](https://img.shields.io/badge/Reference_Atlas-127-E5484D?style=flat-square)](./content/references)
[![Canon rules: 47](https://img.shields.io/badge/canon_rules-47-7C5CFC?style=flat-square)](./content/canon)
[![Components: 32](https://img.shields.io/badge/components-32-D6409F?style=flat-square)](./packages/react)
[![Skills: 5](https://img.shields.io/badge/skills-5-46C26B?style=flat-square)](#-五个技能)
[![Built for: AI agents](https://img.shields.io/badge/built_for-AI_agents-18181D?style=flat-square)](#-快速开始)
[![PRs: welcome](https://img.shields.io/badge/PRs-welcome-1FB8B8?style=flat-square)](./CONTRIBUTING.md)

[English](./README.md) · [日本語](./README.ja.md) · **简体中文** · [한국어](./README.ko.md) · [Español](./README.es.md)

</div>

---

> **避开中位数。坚持观点。**  
> AwesomeDesignSystem 已不只是「Markdown + 技能」。它是 **面向 AI 代理的设计平台**：策展教义、可版本化的证据图、可执行的 tokens / 组件 / 动效，以及英日双语本地文档站——让代理交付有人情味的现代（2026）UI，而不是千篇一律的 “AI slop”。

## 🧭 为什么存在

让 LLM「做一个落地页」，你得到的往往不是 _设计_，而是全网 Tailwind 教程的**统计中位数**：Inter、紫到蓝渐变、居中 hero、三张 emoji 卡片。模型默认落在中心，除非被舵控。

AwesomeDesignSystem 用 **四层互相链接** 来舵控：

| 层             | 是什么                                | 位置                     |
| -------------- | ------------------------------------- | ------------------------ |
| **Doctrine**   | 带代码的有观点设计知识                | `design-system/`         |
| **Evidence**   | 结构化、可校验的一手来源与 canon 规则 | `content/`               |
| **Executable** | Tokens、React 基线、动效、品牌契约    | `packages/`              |
| **Verbs**      | 渐进披露的代理技能                    | `skills/` + `install.sh` |

## 🎁 你能得到什么

| 结果                  | 方式                                           |
| --------------------- | ---------------------------------------------- |
| **停止产出 AI slop**  | 品味原则、反中位数模式、审查技能               |
| **主张可追溯**        | Reference Atlas → canon → artifact → 测试      |
| **更快交付无访问 UI** | 32 个带共享契约 + React Aria 的组件            |
| **有意图的动效**      | 尊重 `prefers-reduced-motion` 的配方库         |
| **品牌即代码**        | Product Lexicon、语气规则、文案 lint           |
| **保持新鲜**          | Freshness / 链接治理脚本与 CI                  |
| **本地浏览**          | Next.js 文档站（**英 / 日**，`/en/*` `/ja/*`） |

当前证据图（已校验）：**105 Reference Atlas · 42 canon 规则 · 54 artifact · 6 隔离 signal**。

## 📂 仓库内容

```
design-system/     人类可读教义
content/           机器图：references / canon / artifacts / signals
packages/          tokens · core · react · motion · brand · content
apps/docs/         本地 Next.js 16 文档 + Reference Atlas + 预览
skills/            五个可移植技能
research/          一手调研笔记
docs/              架构 / 运维 / QA / 完成审计
scripts/           校验、鲜度、证据、链接检查
```

## 🛠️ 五个技能

|     | 技能               | 用途                                          |
| :-: | ------------------ | --------------------------------------------- |
| 🎨  | **/AwesomeDS**     | 用品味层构建或打磨 UI                         |
| 🏗️  | **/MakeAwesomeDS** | 生成产品自有 DS（OKLCH + `DESIGN.md` + 预览） |
| 📄  | **/AwesomeHTML**   | 将 Markdown / 笔记变成精美单文件 HTML         |
| 🔍  | **/AwesomeReview** | 审查 AI slop 与 a11y 问题                     |
| ✨  | **/AwesomeMotion** | 设计有目的的动效                              |

## 🚀 快速开始

### 1) AI 代理 — 无需安装

先读 [`DESIGN.md`](./DESIGN.md) 与 [`design-system/INDEX.md`](./design-system/INDEX.md)，再按任务打开模块；引用 `rule.*`，追溯到 `ref.*`。

### 2) Claude Code 技能

```bash
git clone https://github.com/Yu-aimaker/AwesomeDesignSystem.git
cd AwesomeDesignSystem
./install.sh
```

### 3) 本地 monorepo + 文档站

需要 **Node ≥ 22.13.0** 与 **pnpm 10.5.2**。

```bash
pnpm install
pnpm --filter @awesome-ds/docs dev   # http://127.0.0.1:3000
pnpm validate && pnpm test && pnpm qa:core
```

详见 [`docs/architecture.md`](./docs/architecture.md) 与 [`docs/completion-audit.md`](./docs/completion-audit.md)。

## 📐 一句话标准

> 避开中位数。坚持观点。主色 + 锐利强调色。有意识的字体选择。真实层级；一屏一个焦点。克制即自信。动效传达状态而非装饰。主题化原语。设计错误 / 空 / 加载态。满足 WCAG 2.2 AA。交付连贯整体。

## 🔬 证据与鲜度

- Reference Atlas、canon 规则、隔离 signals
- 命令：`pnpm check:links` · `pnpm check:freshness` · `pnpm evidence:check`
- **不是链接合集**——一手来源被吸收为教义与可执行契约，再经图校验保持诚实。

## 🌐 本地化

文档 UI 为英 / 日；canon Markdown 以英文为准，未翻译处有明确回退提示。

## 🤝 贡献 · ⚖️ 许可

见 [CONTRIBUTING.md](./CONTRIBUTING.md)。[MIT](./LICENSE)。

<div align="center"><sub>让 AI 像拥有品味一样做设计。🎨</sub></div>
