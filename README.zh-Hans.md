<div align="center">

# AwesomeDesignSystem

**为 AI 智能体打造的品味层。**
一个自洽、附带来源引用的设计系统知识库 + 技能套件，让任何 AI 智能体都能
产出现代（2026 年）、有人情味的前端设计——彻底告别千篇一律的"AI 流水线货"。

<sub>

[English](./README.md) · [日本語](./README.ja.md) · [简体中文](./README.zh-Hans.md) · [한국어](./README.ko.md) · [Español](./README.es.md)

</sub>

</div>

---

## 为什么会有这个项目

让一个 LLM "做一个落地页"，你得到的并不是*设计*——而是它从抓取过的每一篇 Tailwind
教程里算出来的**统计中位数**：Inter 字体、白底上一道紫到蓝的渐变、居中的主视觉区、
三张配着 emoji 的功能卡片。这不是因为模型缺乏知识，而是因为**除非你主动把它从中心点
拽开，否则它默认就停在那里。**

AwesomeDesignSystem 提供的正是这股拽力：一套经过精心策划、立场鲜明的设计知识——而且
**代码就嵌在其中**——再加上一组只按任务所需加载内容的技能。它是**专为 AI 智能体直接阅读**
而构建的，因此智能体既不必在任务进行到一半时去抓取某个库的文档才能干活，也不必把整个
系统一股脑吞进上下文里。

这里的一切都提炼自**一手来源**（Apple HIG 与 Liquid Glass、Google Material 3
Expressive、Nothing、Goodpatch、Linear/Stripe/Vercel/Raycast，以及各官方库文档），并经过
**对抗式事实核查**——270 多条带引用的来源就放在 [`research/`](./research) 之下。

## 内容一览

```
design-system/            ← the canonical knowledge base (code embedded; single source of truth)
  INDEX.md                  router: question → which module to read
  best-practice-design-for-ai.md   the flagship synthesis, source-linked
  00-philosophy/            taste layer · "modern 2026" · core principles
  foundations/              color (OKLCH) · typography (incl. 日本語) · spacing/layout · tokens
  motion/                   principles · copy-paste Motion + CSS recipes
  components/               button/card/input/dialog/… with states + a11y
  patterns/                 hero/bento/sections/nav/backgrounds (anti-slop)
  accessibility/            WCAG 2.2 · focus · keyboard · contrast
  tech-stack-2026/          the recommended AI-native stack
research/                 ← raw, primary-source research (the evidence)
skills/                   ← five portable skills (the verbs)
```

## 五大技能

| 技能 | 用它来…… |
|---|---|
| **/AwesomeDS** | 借助本系统的品味层构建或优化任何 UI；只为你路由到所需的模块。 |
| **/MakeAwesomeDS** | 为某个品牌/产品生成*专属*的设计系统（OKLCH tokens + `DESIGN.md` + 预览）。 |
| **/AwesomeHTML** | 把 Markdown / 研究资料 / 笔记转化为精致、自洽的单文件 HTML 文档。 |
| **/AwesomeReview** | 审查既有的 UI 或代码——检测 AI 流水线货与无障碍缺陷，并按优先级给出修复建议。 |
| **/AwesomeMotion** | 设计有品味、有目的的动效（Motion for React + 纯 CSS 配方）。 |

## 快速上手

### 面向 AI 智能体（无需安装）
把智能体指向本仓库，并告诉它**先读 [`design-system/INDEX.md`](./design-system/INDEX.md)**，
然后只打开任务所需的模块。INDEX 是地图；每个模块都自成一体。

### 作为 Claude Code 技能
```bash
git clone https://github.com/Yu-aimaker/AwesomeDesignSystem.git
cd AwesomeDesignSystem
./install.sh        # symlinks the 5 skills into ~/.claude/skills and backs up any prior skill
```
随后在 Claude Code 中：`/AwesomeDS`、`/MakeAwesomeDS`、`/AwesomeHTML`、`/AwesomeReview`、`/AwesomeMotion`。
> `install.sh` 使用符号链接，因此请把仓库保留在原处；拉取更新即可同步更新技能。沙箱环境请改用 `--copy`。

## 一口气讲清的标准

> 避开中位数。坚定地拿出一种观点。一种主导色 + 锐利的强调色，绝不要怯生生的均质配色。
> 一款经过深思熟虑、辨识度高的字体——别再把 Inter 当成唯一选项。靠对比建立真正的层级；
> 每屏只设一个焦点。克制 = 自信。动效是用来传达状态，而非装饰——一次精心编排的页面载入
> 胜过零散的微交互。给你的基础元素套上主题，永远别直接交付原生默认值。务必把
> 错误/空状态/加载状态都设计到位，并满足 WCAG 2.2 AA。一个连贯的**整体**，而不是零件的拼凑。

## 设计 tokens（共通的词汇表）

每个模块都说同一种 token 语言（完整集合见 [`foundations/tokens.md`](./design-system/foundations/tokens.md)）：
语义化的 OKLCH 颜色（`--color-bg/-surface/-fg/-border/-accent/-ring`）、一套 8pt 间距刻度
（`--space-*`）、`--radius-*`、一套流式字号刻度（`--text-*` + `--leading-*`/`--tracking-*`）、
`--font-display/-body/-mono`、发丝级边框 + `--shadow-*`，以及动效 tokens（`--ease-*`、`--dur-*`），
并同步映射进一个 Tailwind v4 的 `@theme {}` 块。

## 参与贡献

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。底线是：每条主张都**有来源**，代码**嵌入其中**，
技能保持**节省 token**，凡是过不了反 AI 流水线货 Pre-Flight 检查的内容一律不予交付。

## 许可证

[MIT](./LICENSE)——可自由使用、改编与在其之上构建。

<div align="center"><sub>Built to make AI design like it has taste.</sub></div>
