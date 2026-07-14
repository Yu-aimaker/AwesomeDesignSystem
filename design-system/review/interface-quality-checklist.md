---
title: "Interface Quality Checklist (Review Rubric)"
updated: 2026-07-13
status: canonical
sources: [ref.vercel.web-interface-guidelines, ref.w3c.apg, ref.w3c.wcag-22, ref.apple.hig]
---

# Interface Quality Checklist

Operational review rubric synthesized from Vercel Web Interface Guidelines, WAI-ARIA APG, WCAG 2.2, and Apple HIG foundations. Each item has severity and verification mode.

## Interactions

| ID | Rule | Severity | Verify |
|---|---|---|---|
| IQ-INT-01 | All flows keyboard-operable (APG patterns) | critical | keyboard |
| IQ-INT-02 | Visible `:focus-visible` rings | critical | visual |
| IQ-INT-03 | Focus trap/return for dialogs/menus | critical | keyboard |
| IQ-INT-04 | Hit target ≥24px (desktop), ≥44px (mobile) | high | measure |
| IQ-INT-05 | Inputs ≥16px on mobile (no iOS zoom) | high | mobile |
| IQ-INT-06 | Never disable zoom | high | meta |
| IQ-INT-07 | Hydration-safe inputs (no focus/value loss) | high | browser |
| IQ-INT-08 | Never block paste | high | manual |
| IQ-INT-09 | Loading buttons keep label + spinner | medium | visual |
| IQ-INT-10 | URL as state for shareable UI | high | Back/Forward |
| IQ-INT-11 | Optimistic update + rollback/undo | medium | manual |
| IQ-INT-12 | Confirm destructive or provide undo window | high | manual |
| IQ-INT-13 | Links are real links (`a`/`Link`) | high | code |
| IQ-INT-14 | Announce async updates (aria-live polite) | high | a11y |
| IQ-INT-15 | No dead zones on interactive chrome | medium | pointer |

## Motion

| ID | Rule | Severity | Verify |
|---|---|---|---|
| IQ-MOT-01 | Honor prefers-reduced-motion | critical | media |
| IQ-MOT-02 | Prefer CSS/WAAPI over main-thread JS | medium | code |
| IQ-MOT-03 | Animate transform/opacity primarily | high | perf |
| IQ-MOT-04 | Interruptible input-driven motion | high | manual |
| IQ-MOT-05 | Never `transition: all` | medium | code |

## Layout & content

| ID | Rule | Severity | Verify |
|---|---|---|---|
| IQ-LAY-01 | Optical alignment when geometry lies | low | visual |
| IQ-LAY-02 | Safe-area insets respected | high | device |
| IQ-LAY-03 | Skeletons match final geometry | high | visual |
| IQ-LAY-04 | Empty/sparse/dense/error designed | critical | states |
| IQ-LAY-05 | No dead ends — always a next step | high | UX |
| IQ-LAY-06 | Locale-aware dates/numbers | high | i18n |
| IQ-LAY-07 | Icons have accessible names | critical | a11y |
| IQ-LAY-08 | Status not color-only | high | a11y |

## Agent review command

When reviewing UI, agents must:

1. Cite violated `IQ-*` or `rule.*` IDs
2. State severity
3. Propose minimal fix
4. Note verification method

## Linked rules
- `rule.interaction.interface-quality`
- `rule.a11y.wcag-aa`
- `rule.motion.purpose-first`
