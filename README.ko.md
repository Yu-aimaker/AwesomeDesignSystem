<div align="center">

<img src="./assets/banner.svg" alt="AwesomeDesignSystem — AI 에이전트를 위한 취향 레이어" width="100%">

&nbsp;

[![License: MIT](https://img.shields.io/badge/License-MIT-1FB8B8?style=flat-square)](./LICENSE)
[![Reference Atlas: 127](https://img.shields.io/badge/Reference_Atlas-127-E5484D?style=flat-square)](./content/references)
[![Canon rules: 47](https://img.shields.io/badge/canon_rules-47-7C5CFC?style=flat-square)](./content/canon)
[![Components: 32](https://img.shields.io/badge/components-32-D6409F?style=flat-square)](./packages/react)
[![Skills: 5](https://img.shields.io/badge/skills-5-46C26B?style=flat-square)](#️-다섯-스킬)
[![Built for: AI agents](https://img.shields.io/badge/built_for-AI_agents-18181D?style=flat-square)](#-빠른-시작)
[![PRs: welcome](https://img.shields.io/badge/PRs-welcome-1FB8B8?style=flat-square)](./CONTRIBUTING.md)

[English](./README.md) · [日本語](./README.ja.md) · [简体中文](./README.zh-Hans.md) · **한국어** · [Español](./README.es.md)

</div>

---

> **중앙값을 피하라. 관점을 가져라.**  
> AwesomeDesignSystem은 더 이상 “Markdown + 스킬”만이 아닙니다. **AI 에이전트 우선 디자인 플랫폼**입니다. 큐레이션된 교의, 버전 관리되는 증거 그래프, 실행 가능한 토큰/컴포넌트/모션, 영·일 로컬 문서 사이트 — 에이전트가 “AI 슬롭”이 아닌 현대적(2026)이고 인간적인 UI를 출하하도록 합니다.

## 🧭 존재 이유

LLM에게 “랜딩 페이지 만들어 줘”라고 하면 _디자인_ 대신 Tailwind 튜토리얼의 **통계적 중앙값**이 자주 나옵니다. Inter, 보라→파랑 그라데이션, 중앙 히어로, 이모지 카드 3장. 조타하지 않으면 중심으로 떨어집니다.

AwesomeDesignSystem은 **서로 연결된 4개 레이어**로 조타합니다.

| 레이어         | 내용                                      | 위치                     |
| -------------- | ----------------------------------------- | ------------------------ |
| **Doctrine**   | 코드가 박힌 의견 있는 디자인 지식         | `design-system/`         |
| **Evidence**   | 구조화·검증된 1차 출처와 canon 규칙       | `content/`               |
| **Executable** | 토큰, React 베이스라인, 모션, 브랜드 계약 | `packages/`              |
| **Verbs**      | 점진적 공개 에이전트 스킬                 | `skills/` + `install.sh` |

## 🎁 얻을 수 있는 것

| 결과               | 방법                                        |
| ------------------ | ------------------------------------------- |
| **AI 슬롭 중단**   | 취향 원칙, 반-중앙값 패턴, 리뷰 스킬        |
| **주장 추적**      | Reference Atlas → canon → artifact → 테스트 |
| **접근성 UI 가속** | 공유 계약 + React Aria 32 컴포넌트          |
| **의도 있는 모션** | `prefers-reduced-motion` 준수 레시피        |
| **브랜드 as code** | Product Lexicon, 보이스 규칙, 카피 lint     |
| **신선도 유지**    | freshness / 링크 거버넌스 + CI              |
| **로컬 탐색**      | Next.js 문서 (**EN/JA**, `/en/*` `/ja/*`)   |

현재 증거 그래프(검증됨): **105 Reference Atlas · 42 canon · 54 artifact · 6 quarantine signal**.

## 📂 구성

```
design-system/     사람이 읽는 정전
content/           기계용 그래프
packages/          tokens · core · react · motion · brand · content
apps/docs/         로컬 Next.js 16 문서 + Reference Atlas + 라이브 프리뷰
skills/            다섯 개의 이식 가능 스킬
research/ · docs/ · scripts/
```

## 🛠️ 다섯 스킬

|     | 스킬               | 용도                                    |
| :-: | ------------------ | --------------------------------------- |
| 🎨  | **/AwesomeDS**     | 취향 레이어로 UI 구축·다듬기            |
| 🏗️  | **/MakeAwesomeDS** | 제품 고유 DS 생성 (OKLCH + `DESIGN.md`) |
| 📄  | **/AwesomeHTML**   | Markdown → 단일 HTML                    |
| 🔍  | **/AwesomeReview** | AI 슬롭·a11y 감사                       |
| ✨  | **/AwesomeMotion** | 목적 지향 모션                          |

## 🚀 빠른 시작

### 1) AI 에이전트 — 설치 불필요

[`DESIGN.md`](./DESIGN.md)와 [`design-system/INDEX.md`](./design-system/INDEX.md)를 먼저 읽고, 작업에 필요한 모듈만 엽니다. `rule.*`를 인용하고 `ref.*`까지 추적합니다.

### 2) Claude Code 스킬

```bash
git clone https://github.com/Yu-aimaker/AwesomeDesignSystem.git
cd AwesomeDesignSystem
./install.sh
```

### 3) 로컬 monorepo + 문서 사이트

**Node ≥ 22.13.0**, **pnpm 10.5.2** 필요.

```bash
pnpm install
pnpm --filter @awesome-ds/docs dev   # http://127.0.0.1:3000
pnpm validate && pnpm test && pnpm qa:core
```

자세한 내용: [`docs/architecture.md`](./docs/architecture.md), [`docs/completion-audit.md`](./docs/completion-audit.md).

## 📐 한 호흡 표준

> 중앙값을 피하라. 관점을 가져라. 주조색 + 날카로운 액센트. 의도적 서체. 진짜 계층; 화면당 초점 하나. 절제 = 자신감. 모션은 상태를 전한다. 원시 기본값을 내지 마라. 에러/빈/로딩 상태를 설계하라. WCAG 2.2 AA. 일관된 전체.

## 🔬 증거와 신선도

- Reference Atlas, canon 규칙, quarantine signals
- `pnpm check:links` · `pnpm check:freshness` · `pnpm evidence:check`
- **링크 모음이 아님** — 1차 출처를 교의와 실행 계약으로 흡수하고 그래프 검증으로 정직함을 유지합니다.

## 🌐 로컬라이제이션

문서 UI는 영어·일본어. Canon Markdown은 영어 우선, 미번역은 명시적 폴백.

## 🤝 기여 · ⚖️ 라이선스

[CONTRIBUTING.md](./CONTRIBUTING.md) · [MIT](./LICENSE)

<div align="center"><sub>AI가 취향 있게 디자인하도록. 🎨</sub></div>
