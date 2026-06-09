<div align="center">

<img src="./assets/banner.svg" alt="AwesomeDesignSystem — 面向 AI 智能体的品味层" width="100%">

&nbsp;

[![License: MIT](https://img.shields.io/badge/License-MIT-1FB8B8?style=flat-square)](./LICENSE)
[![Cited sources: 270+](https://img.shields.io/badge/cited_sources-270%2B-E5484D?style=flat-square)](./research)
[![Skills: 5](https://img.shields.io/badge/skills-5-7C5CFC?style=flat-square)](./skills)
[![Color: OKLCH](https://img.shields.io/badge/color-OKLCH-D6409F?style=flat-square)](./design-system/foundations/color.md)
[![Built for: AI agents](https://img.shields.io/badge/built_for-AI_agents-18181D?style=flat-square)](./design-system/INDEX.md)
[![PRs: welcome](https://img.shields.io/badge/PRs-welcome-46C26B?style=flat-square)](./CONTRIBUTING.md)

[English](./README.md) · [日本語](./README.ja.md) · **简体中文** · [한국어](./README.ko.md) · [Español](./README.es.md)

</div>

---

> **避开中位数，亮明你的观点。** 一个自包含、附带出处的设计系统知识库 **＋** 技能套件，让任何 AI 智能体都能产出现代（2026）、有人情味的前端设计——并停止批量生产千篇一律的「AI slop」。

## 🧭 为什么需要它

让 LLM「做一个落地页」，你得到的不是*设计*——而是被抓取的无数 Tailwind 教程的**统计中位数**：Inter 字体、白底紫到蓝的渐变、居中的 hero、三张带表情符号的功能卡片。不是因为模型缺乏知识，而是因为**只要不主动操舵，它就会落回中心**。

AwesomeDesignSystem 提供的正是这种操舵：一套**内嵌代码**、经过精选且立场鲜明的设计知识体 **＋** 只按任务所需加载内容的技能套件。

| | |
|---|---|
| 🤖 **为 AI 智能体直接阅读而设计** | 无需在任务中途去抓取某个库的文档即可上手…… |
| 🪶 **……却又不让上下文膨胀** | ……也绝不把整个系统一股脑塞进上下文。 |
| 📐 **一手来源的严谨** | 提炼自 Apple HIG & Liquid Glass、Material 3 Expressive、Nothing、Goodpatch、Linear/Stripe/Vercel/Raycast ＋ 官方库文档。 |
| 🔬 **经过对抗式事实核查** | 270+ 条引用来源收录于 [`research/`](./research)。 |

## 📂 内容一览

三层结构：**知识**（读）·**证据**（验证）·**动词**（执行）。

<details open>
<summary><b>仓库地图</b></summary>

```
design-system/            ← 规范知识库（内嵌代码 · 唯一真实来源）
  INDEX.md                  路由：问题 → 该读哪个模块
  best-practice-design-for-ai.md   旗舰综述（附来源链接）
  00-philosophy/            品味层 ·「现代 2026」· 核心原则
  foundations/              color (OKLCH) · typography（含日本語）· spacing/layout · tokens
  motion/                   原则 · 可复制粘贴的 Motion + CSS 配方
  components/               button/card/input/dialog/… 含状态 + a11y
  patterns/                 hero/bento/sections/nav/backgrounds（反 slop）
  accessibility/            WCAG 2.2 · focus · keyboard · contrast
  tech-stack-2026/          推荐的 AI 原生技术栈
research/                 ← 原始一手研究（证据）
skills/                   ← 五个可移植技能（动词）
```

</details>

## 🛠️ 五个技能

| | 技能 | 用来…… |
|:--:|---|---|
| 🎨 | **/AwesomeDS** | 以系统的品味层构建或打磨任意 UI；只路由到你需要的模块。 |
| 🏗️ | **/MakeAwesomeDS** | 为品牌/产品生成*专属*设计系统（OKLCH 令牌 + `DESIGN.md` + 预览）。 |
| 📄 | **/AwesomeHTML** | 把 Markdown / 研究 / 笔记转成精致、自包含的单文件 HTML 文档。 |
| 🔍 | **/AwesomeReview** | 审计现有 UI 或代码——检出 AI slop 与 a11y 问题，给出按优先级排序的修复。 |
| ✨ | **/AwesomeMotion** | 设计有品味、有目的的动效（Motion for React + 纯 CSS 配方）。 |

## 🚀 快速开始

#### 面向 AI 智能体——无需安装

> [!TIP]
> 把智能体指向本仓库，并要求它**先读 [`design-system/INDEX.md`](./design-system/INDEX.md)**，之后只打开任务所需的模块。INDEX 是地图，每个模块都自包含。

#### 作为 Claude Code 技能

```bash
git clone https://github.com/Yu-aimaker/AwesomeDesignSystem.git
cd AwesomeDesignSystem
./install.sh        # 将 5 个技能软链接到 ~/.claude/skills（并备份任何已有技能）
```

然后在 Claude Code 中：`/AwesomeDS` · `/MakeAwesomeDS` · `/AwesomeHTML` · `/AwesomeReview` · `/AwesomeMotion`

> [!NOTE]
> `install.sh` 使用软链接，因此请保持仓库原地不动——拉取更新即可更新技能。沙箱环境请使用 `--copy`。

## 📐 一口气说完的标准

> 避开中位数，亮明观点。一个主色 **＋** 锐利点缀，绝不用怯懦而均匀的调色板。一款刻意而独特的字体——绝不把 Inter 当唯一选择。靠对比建立真实层级；每屏只有一个焦点。克制 **＝** 自信。动效传达状态而非装饰——一次精心编排的页面加载，胜过零散的微交互。为基础元件设定主题，绝不直接交付原始默认值。务必设计 error / empty / loading 状态，并满足 WCAG 2.2 AA。要的是连贯的**整体**，而非零件的拼凑。

## 🎨 设计令牌——共享词汇

每个模块都讲**同一种令牌语言**，并映射进 Tailwind v4 的 `@theme {}` 块。

<details>
<summary><b>完整令牌契约</b></summary>

| 分组 | 令牌 |
|---|---|
| **Color**（语义 · OKLCH） | `--color-bg` · `--color-surface` · `--color-fg` · `--color-border` · `--color-accent` · `--color-ring` |
| **Space**（8pt 刻度） | `--space-1` … `--space-32` |
| **Radius** | `--radius-sm` · `--radius-md` · `--radius-lg` · `--radius-full` |
| **Type**（流体） | `--text-xs` … `--text-7xl` · `--leading-*` · `--tracking-*` |
| **Font** | `--font-display` · `--font-body` · `--font-mono` |
| **Elevation** | 发丝边框 **+** `--shadow-sm/md/lg` |
| **Motion** | `--ease-out` · `--ease-spring` · `--dur-fast/base/slow` |

带数值的完整集合 → [`foundations/tokens.md`](./design-system/foundations/tokens.md)

</details>

## 🤝 参与贡献

请见 [CONTRIBUTING.md](./CONTRIBUTING.md)。底线：每条主张都有**出处**、代码必须**内嵌**、技能保持**令牌节俭**，凡是过不了反 AI slop 预检（Pre-Flight）的都不发布。

## ⚖️ 许可证

[MIT](./LICENSE)——可自由使用、改编与在其之上构建。

<div align="center"><sub>让 AI 设计得像是真有品味。🎨</sub></div>
