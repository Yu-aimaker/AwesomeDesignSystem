<div align="center">

# AwesomeDesignSystem

**AI 에이전트를 위한 미적 감각 레이어(taste layer).**
어떤 AI 에이전트든 모던하고(2026) 사람의 손길이 느껴지는 프런트엔드 디자인을 만들어 내고,
틀에 박힌 "AI slop"을 그만 내놓게 해 주는, 자기 완결적이고 출처가 명시된 디자인 시스템 지식 베이스 + 스킬 모음입니다.

<sub>

[English](./README.md) · [日本語](./README.ja.md) · [简体中文](./README.zh-Hans.md) · [한국어](./README.ko.md) · [Español](./README.es.md)

</sub>

</div>

---

## 왜 이것이 필요한가

LLM에게 "랜딩 페이지를 만들어 줘"라고 하면 *디자인*이 나오지 않습니다. 지금까지 스크랩된 모든 Tailwind 튜토리얼의
**통계적 중앙값(median)** 이 나올 뿐입니다. Inter 글꼴, 흰 배경 위의 보라색에서 파란색으로 흐르는 그라데이션, 가운데 정렬된 히어로,
이모지 세 개짜리 기능 카드. 모델에 지식이 부족해서가 아니라, **방향을 틀어 주지 않는 한 늘 한가운데로 회귀하기** 때문입니다.

AwesomeDesignSystem은 바로 그 방향을 제시합니다. 엄선되고 분명한 관점을 가진 디자인 지식 본문에 **코드를 함께 담았고**,
거기에 작업에 필요한 만큼만 불러오는 스킬을 더했습니다. **AI 에이전트가 직접 읽도록** 설계했기에, 에이전트는 작업 중간에
라이브러리 문서를 따로 가져오지 않아도 곧바로 생산적으로 일할 수 있으면서도, 시스템 전체를 컨텍스트에 욱여넣을 필요도 없습니다.

여기 담긴 모든 내용은 **1차 자료**(Apple HIG 및 Liquid Glass, Google Material 3 Expressive, Nothing, Goodpatch,
Linear/Stripe/Vercel/Raycast, 그리고 각 라이브러리 공식 문서)에서 추려 냈으며 **적대적으로 사실 검증(adversarially fact-checked)** 을 거쳤습니다.
270개가 넘는 인용 출처가 [`research/`](./research) 아래에 살아 있습니다.

## 무엇이 들어 있나

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

## 다섯 가지 스킬

| Skill | 이런 용도로… |
|---|---|
| **/AwesomeDS** | 시스템의 미적 감각 레이어를 입혀 어떤 UI든 만들거나 다듬습니다. 필요한 모듈로만 라우팅합니다. |
| **/MakeAwesomeDS** | 브랜드/제품 *고유*의 디자인 시스템을 생성합니다(OKLCH 토큰 + `DESIGN.md` + 미리보기). |
| **/AwesomeHTML** | Markdown / 리서치 / 메모를 잘 다듬어진 자기 완결형 단일 파일 HTML 문서로 변환합니다. |
| **/AwesomeReview** | 기존 UI나 코드를 감사합니다. AI slop과 a11y 결함을 찾아내고 우선순위가 매겨진 수정안을 보고합니다. |
| **/AwesomeMotion** | 목적이 분명하고 품위 있는 모션을 설계합니다(Motion for React + CSS 전용 레시피). |

## 빠른 시작

### AI 에이전트용 (설치 불필요)
에이전트에게 이 저장소를 가리키고 **먼저 [`design-system/INDEX.md`](./design-system/INDEX.md)를 읽으라**고 지시한 뒤,
작업에 필요한 모듈만 열도록 하세요. INDEX가 지도이며, 각 모듈은 자기 완결적입니다.

### Claude Code 스킬로 사용
```bash
git clone https://github.com/Yu-aimaker/AwesomeDesignSystem.git
cd AwesomeDesignSystem
./install.sh        # symlinks the 5 skills into ~/.claude/skills and backs up any prior skill
```
그런 다음 Claude Code에서: `/AwesomeDS`, `/MakeAwesomeDS`, `/AwesomeHTML`, `/AwesomeReview`, `/AwesomeMotion`.
> `install.sh`는 심볼릭 링크를 사용하므로 저장소를 그대로 두세요. 업데이트를 pull하면 스킬도 함께 갱신됩니다. 샌드박스 환경에서는 `--copy`를 사용하세요.

## 이 표준을, 한 호흡에

> 중앙값을 피하라. 하나의 관점에 분명하게 헌신하라. 미적지근하게 고른 팔레트가 아니라, 지배적인 색 하나 + 날카로운 강조색.
> 진부하게 Inter 하나로 끝내지 말고, 의도가 담긴 개성 있는 서체를 선택하라. 대비로 진짜 위계를 만들고, 화면마다 초점은 하나.
> 절제 = 자신감. 모션은 장식이 아니라 상태를 전달한다. 흩어진 마이크로 인터랙션보다 정교하게 연출된 페이지 로드 하나가 낫다.
> 프리미티브에는 테마를 입히고, 가공되지 않은 기본값을 그대로 내보내지 마라. error/empty/loading 상태를 반드시 설계하고 WCAG 2.2 AA를 충족하라.
> 부품들의 모음이 아니라, 일관된 **하나의 전체**.

## 디자인 토큰 (공유 어휘)

모든 모듈은 하나의 토큰 언어로 말합니다(전체 세트는 [`foundations/tokens.md`](./design-system/foundations/tokens.md)에 있습니다).
시맨틱 OKLCH 색상(`--color-bg/-surface/-fg/-border/-accent/-ring`), 8pt 간격 스케일
(`--space-*`), `--radius-*`, 유동형 타입 스케일(`--text-*` + `--leading-*`/`--tracking-*`),
`--font-display/-body/-mono`, 헤어라인 테두리 + `--shadow-*`, 그리고 모션 토큰(`--ease-*`, `--dur-*`)으로 이루어지며,
이 모두가 Tailwind v4 `@theme {}` 블록에 그대로 반영됩니다.

## 기여하기

[CONTRIBUTING.md](./CONTRIBUTING.md)를 참고하세요. 기준은 이렇습니다. 모든 주장에는 **출처가 있을 것**, 코드는 **함께 담겨 있을 것**,
스킬은 **토큰을 아낄 것**, 그리고 안티-AI-slop Pre-Flight를 통과하지 못할 결과물은 그 무엇도 내보내지 않을 것.

## 라이선스

[MIT](./LICENSE) — 자유롭게 사용하고, 변형하고, 그 위에 만들어 보세요.

<div align="center"><sub>Built to make AI design like it has taste.</sub></div>
