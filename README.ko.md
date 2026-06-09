<div align="center">

<img src="./assets/banner.svg" alt="AwesomeDesignSystem — AI 에이전트를 위한 취향 레이어" width="100%">

&nbsp;

[![License: MIT](https://img.shields.io/badge/License-MIT-1FB8B8?style=flat-square)](./LICENSE)
[![Cited sources: 270+](https://img.shields.io/badge/cited_sources-270%2B-E5484D?style=flat-square)](./research)
[![Skills: 5](https://img.shields.io/badge/skills-5-7C5CFC?style=flat-square)](./skills)
[![Color: OKLCH](https://img.shields.io/badge/color-OKLCH-D6409F?style=flat-square)](./design-system/foundations/color.md)
[![Built for: AI agents](https://img.shields.io/badge/built_for-AI_agents-18181D?style=flat-square)](./design-system/INDEX.md)
[![PRs: welcome](https://img.shields.io/badge/PRs-welcome-46C26B?style=flat-square)](./CONTRIBUTING.md)

[English](./README.md) · [日本語](./README.ja.md) · [简体中文](./README.zh-Hans.md) · **한국어** · [Español](./README.es.md)

</div>

---

> **중앙값을 피하라. 관점을 분명히 하라.** 출처가 명시된 자기 완결적 디자인 시스템 지식 베이스 **＋** 스킬 모음. 어떤 AI 에이전트든 모던한(2026) 인간미 있는 프런트엔드를 만들고, 흔한 "AI slop" 양산을 멈추게 한다.

## 🧭 왜 존재하는가

LLM에게 "랜딩 페이지를 만들어 줘"라고 하면 돌아오는 건 *디자인*이 아니다 — 스크랩된 수많은 Tailwind 튜토리얼의 **통계적 중앙값**이다. Inter, 흰 배경의 보라→파랑 그라데이션, 가운데 정렬 히어로, 이모지 기능 카드 3장. 모델이 지식이 없어서가 아니라, **조향하지 않으면 중앙으로 떨어지기** 때문이다.

AwesomeDesignSystem은 바로 그 조향을 제공한다. **코드를 내장한**, 큐레이션되고 관점이 분명한 디자인 지식체 **＋** 작업에 필요한 만큼만 불러오는 스킬 모음.

| | |
|---|---|
| 🤖 **AI 에이전트가 직접 읽도록 설계** | 작업 도중 라이브러리 문서를 가지러 가지 않아도 바로 활용 가능… |
| 🪶 **…그러나 컨텍스트를 부풀리지 않음** | …그렇다고 시스템 전체를 컨텍스트에 통째로 삼키지도 않는다. |
| 📐 **1차 출처의 엄밀함** | Apple HIG & Liquid Glass, Material 3 Expressive, Nothing, Goodpatch, Linear/Stripe/Vercel/Raycast ＋ 공식 라이브러리 문서에서 정제. |
| 🔬 **적대적으로 팩트체크 완료** | 270개 이상의 인용 출처가 [`research/`](./research)에. |

## 📂 무엇이 들어 있나

세 개의 레이어: **지식**(읽기) · **증거**(검증) · **동사**(실행).

<details open>
<summary><b>리포지토리 지도</b></summary>

```
design-system/            ← 정전(canonical) 지식 베이스 (코드 내장 · 단일 진실 공급원)
  INDEX.md                  라우터: 질문 → 어떤 모듈을 읽을지
  best-practice-design-for-ai.md   대표 종합 문서 (출처 링크 포함)
  00-philosophy/            취향 레이어 ·「모던 2026」· 핵심 원칙
  foundations/              color (OKLCH) · typography (日本語 포함) · spacing/layout · tokens
  motion/                   원칙 · 복붙 가능한 Motion + CSS 레시피
  components/               button/card/input/dialog/… 상태 + a11y 포함
  patterns/                 hero/bento/sections/nav/backgrounds (안티 slop)
  accessibility/            WCAG 2.2 · focus · keyboard · contrast
  tech-stack-2026/          권장 AI 네이티브 스택
research/                 ← 가공 전 1차 출처 리서치 (증거)
skills/                   ← 다섯 개의 이식 가능한 스킬 (동사)
```

</details>

## 🛠️ 다섯 개의 스킬

| | 스킬 | 이렇게 쓴다… |
|:--:|---|---|
| 🎨 | **/AwesomeDS** | 시스템의 취향 레이어로 모든 UI를 구축·다듬기. 필요한 모듈로만 라우팅. |
| 🏗️ | **/MakeAwesomeDS** | 브랜드/제품 *고유의* 디자인 시스템 생성 (OKLCH 토큰 + `DESIGN.md` + 미리보기). |
| 📄 | **/AwesomeHTML** | Markdown / 리서치 / 메모를 세련된 자기 완결형 단일 HTML 문서로 변환. |
| 🔍 | **/AwesomeReview** | 기존 UI·코드 감사 — AI slop과 a11y 결함을 찾아 우선순위별 수정안을 보고. |
| ✨ | **/AwesomeMotion** | 목적이 분명한 품격 있는 모션 설계 (Motion for React + CSS 전용 레시피). |

## 🚀 빠른 시작

#### AI 에이전트용 — 설치 불필요

> [!TIP]
> 에이전트를 이 리포지토리로 향하게 하고 **먼저 [`design-system/INDEX.md`](./design-system/INDEX.md)를 읽으라**고 지시하라. 이후엔 작업에 필요한 모듈만 연다. INDEX가 지도이고, 각 모듈은 자기 완결적이다.

#### Claude Code 스킬로

```bash
git clone https://github.com/Yu-aimaker/AwesomeDesignSystem.git
cd AwesomeDesignSystem
./install.sh        # 5개 스킬을 ~/.claude/skills에 심볼릭 링크 (기존 스킬은 백업)
```

그다음 Claude Code에서: `/AwesomeDS` · `/MakeAwesomeDS` · `/AwesomeHTML` · `/AwesomeReview` · `/AwesomeMotion`

> [!NOTE]
> `install.sh`는 심볼릭 링크를 사용하므로 리포지토리를 제자리에 두라 — pull로 업데이트하면 스킬도 갱신된다. 샌드박스 환경에서는 `--copy`를 사용하라.

## 📐 한 호흡으로 말하는 표준

> 중앙값을 피하라, 관점을 분명히 하라. 지배적인 한 가지 색 **＋** 날카로운 강조색, 소심하고 균등한 팔레트는 금물. 의도적이고 개성 있는 서체 — Inter를 유일한 선택지로 삼지 말 것. 대비로 진짜 위계를 만들고, 화면당 초점은 하나. 절제 **＝** 자신감. 모션은 장식이 아니라 상태를 전달한다 — 흩어진 마이크로 인터랙션보다 잘 조율된 한 번의 페이지 로드가 낫다. 프리미티브에 테마를 입히고, 날것의 기본값을 출고하지 말 것. error / empty / loading 상태를 항상 설계하고 WCAG 2.2 AA를 충족하라. 부품의 모음이 아니라 일관된 **전체**를.

## 🎨 디자인 토큰 — 공유 어휘

모든 모듈이 **하나의 토큰 언어**를 말하며, Tailwind v4의 `@theme {}` 블록에 반영된다.

<details>
<summary><b>토큰 계약 전체</b></summary>

| 그룹 | 토큰 |
|---|---|
| **Color** (시맨틱 · OKLCH) | `--color-bg` · `--color-surface` · `--color-fg` · `--color-border` · `--color-accent` · `--color-ring` |
| **Space** (8pt 스케일) | `--space-1` … `--space-32` |
| **Radius** | `--radius-sm` · `--radius-md` · `--radius-lg` · `--radius-full` |
| **Type** (플루이드) | `--text-xs` … `--text-7xl` · `--leading-*` · `--tracking-*` |
| **Font** | `--font-display` · `--font-body` · `--font-mono` |
| **Elevation** | 헤어라인 보더 **+** `--shadow-sm/md/lg` |
| **Motion** | `--ease-out` · `--ease-spring` · `--dur-fast/base/slow` |

값이 포함된 전체 세트 → [`foundations/tokens.md`](./design-system/foundations/tokens.md)

</details>

## 🤝 기여하기

[CONTRIBUTING.md](./CONTRIBUTING.md)를 참고하라. 기준: 모든 주장에 **출처**가 있고, 코드는 **내장**되며, 스킬은 **토큰 절약적**이고, 안티 AI slop 프리플라이트(Pre-Flight)를 통과하지 못하는 것은 출고하지 않는다.

## ⚖️ 라이선스

[MIT](./LICENSE) — 자유롭게 사용·개작하고 그 위에 빌드할 수 있다.

<div align="center"><sub>AI가 마치 취향을 가진 듯 디자인하도록. 🎨</sub></div>
