<div align="center">

<img src="./assets/banner.svg" alt="AwesomeDS — estética que puedes probar; el instrumento de diseño evidence-first para personas y agentes de IA" width="100%">

&nbsp;

[![License: MIT](https://img.shields.io/badge/License-MIT-18181B?style=flat-square)](./LICENSE)
[![Reference Atlas: 128](https://img.shields.io/badge/Reference_Atlas-128-C0472A?style=flat-square)](./content/references)
[![Canon rules: 47](https://img.shields.io/badge/canon_rules-47-18181B?style=flat-square)](./content/canon)
[![Components: 32](https://img.shields.io/badge/components-32-18181B?style=flat-square)](./packages/react)
[![Skills: 5](https://img.shields.io/badge/skills-5-18181B?style=flat-square)](#las-cinco-skills)
[![Built for: AI agents](https://img.shields.io/badge/built_for-AI_agents-18181D?style=flat-square)](#inicio-rápido)
[![PRs: welcome](https://img.shields.io/badge/PRs-welcome-18181B?style=flat-square)](./CONTRIBUTING.md)

[English](./README.md) · [日本語](./README.ja.md) · [简体中文](./README.zh-Hans.md) · [한국어](./README.ko.md) · **Español**

</div>

---

> **Estética que puedes probar. Evita la mediana.**
>
> AwesomeDesignSystem ya no es solo “Markdown + skills”. Es un **instrumento de diseño evidence-first** para personas y agentes de IA: doctrina curada, un grafo de evidencia versionado, tokens/componentes/motion ejecutables y un sitio de docs bilingüe (EN/JA) — para que cada decisión se remonte a una fuente primaria, no a la mediana genérica del “AI slop”.
>
> Cuatro verbos de navegación lo organizan todo: **Start** (el Canon y sus principios) · **Explore** (Reference Atlas, guía de IA, marca) · **Build** (fundamentos, componentes, motion, patrones, interacción) · **Verify** (review, estado, playground). El bucle de producción es **Start → Build → Verify**; **Explore** es la capa de referencia que abres en cualquier paso.

## El sistema, dibujado

<img src="./assets/diagram-evidence-loop.svg" alt="Bucle de evidencia de AwesomeDS: una regla canónica enlaza con una referencia mantenida, se convierte en un artefacto y vuelve a verificarse con pruebas, accesibilidad y frescura" width="100%">

<img src="./assets/diagram-canon-to-verify.svg" alt="Ruta de construcción de AwesomeDS: las reglas canónicas se ramifican en tokens semánticos, componentes y contratos de movimiento antes de converger en la verificación" width="100%">

## Por qué existe

Pide a un LLM “haz un landing” y casi nunca obtienes _diseño_: obtienes la **mediana estadística** de cada tutorial de Tailwind. Inter, degradado púrpura-azul, hero centrado, tres tarjetas con emoji. El modelo cae al centro salvo que lo dirijas.

AwesomeDesignSystem dirige con **cuatro capas enlazadas**:

| Capa           | Qué es                                         | Dónde                    |
| -------------- | ---------------------------------------------- | ------------------------ |
| **Doctrine**   | Conocimiento de diseño con código embebido     | `design-system/`         |
| **Evidence**   | Fuentes primarias estructuradas + reglas canon | `content/`               |
| **Executable** | Tokens, React base, motion, contratos de marca | `packages/`              |
| **Verbs**      | Skills de agente con divulgación progresiva    | `skills/` + `install.sh` |

## Qué obtienes

| Resultado                   | Cómo                                                              |
| --------------------------- | ----------------------------------------------------------------- |
| **Dejar de enviar AI slop** | Principios de gusto, patrones anti-mediana, skill de review       |
| **Trazar cada afirmación**  | Reference Atlas → reglas canon → artifacts → tests                |
| **UI accesible más rápido** | 32 componentes React con contratos + React Aria                   |
| **Motion con intención**    | Recetas que respetan `prefers-reduced-motion`                     |
| **Marca como código**       | Product Lexicon, voz y lint de copy                               |
| **Mantenerse actualizado**  | Freshness, links y CI                                             |
| **Prove release readiness** | Public Reports surface con security, a11y, performance y QA gates |
| **Explorar en local**       | Docs Next.js en **EN/JA** (`/en/*`, `/ja/*`)                      |

Grafo actual (validado): **128 Reference Atlas · 47 reglas canon · 54 artifacts · 6 signals en cuarentena**.

## Qué hay dentro

```
design-system/     canon legible por humanos
content/           grafo máquina: references / canon / artifacts / signals
packages/          tokens · core · react · motion · brand · content
apps/docs/         docs Next.js 16 + Reference Atlas + previews
skills/            cinco skills portátiles
research/ · docs/ · reports/ · scripts/
```

## Las cinco skills

|      | Skill              | Para…                                       |
| :--: | ------------------ | ------------------------------------------- |
| `01` | **/AwesomeDS**     | Construir o refinar UI con la capa de gusto |
| `02` | **/MakeAwesomeDS** | Generar el DS propio del producto           |
| `03` | **/AwesomeHTML**   | Markdown → HTML de un solo archivo          |
| `04` | **/AwesomeReview** | Auditar slop y fallos de a11y               |
| `05` | **/AwesomeMotion** | Motion con propósito                        |

## Inicio rápido

### 1) Agente de IA — sin instalar

Lee primero [`DESIGN.md`](./DESIGN.md) y [`design-system/INDEX.md`](./design-system/INDEX.md); abre solo lo necesario; cita `rule.*` y traza a `ref.*`.

### 2) Skills de Claude Code

```bash
git clone https://github.com/Yu-aimaker/AwesomeDesignSystem.git
cd AwesomeDesignSystem
./install.sh
```

### 3) Monorepo local + sitio de docs

Requiere **Node ≥ 22.13.0** y **pnpm 10.5.2**.

```bash
pnpm install
pnpm --filter @awesome-ds/docs dev   # http://127.0.0.1:3000
pnpm validate && pnpm test && pnpm qa:core
```

Ver [`docs/architecture.md`](./docs/architecture.md) y [`docs/completion-audit.md`](./docs/completion-audit.md).

Public release evidence: [`/reports`](https://awesome-design-system.yumaker.studio/en/reports) · live graph/freshness: [`/status`](https://awesome-design-system.yumaker.studio/en/status)

## El estándar en un aliento

> Evita la mediana. Un color dominante + acentos nítidos. Tipografía deliberada. Jerarquía real; un foco por pantalla. La contención es confianza. El motion comunica estado. Tematiza primitivos. Diseña error / vacío / carga. WCAG 2.2 AA. Un **todo** coherente.

## Design tokens — shared vocabulary

Tokens semánticos OKLCH, multitema, generados para uso amigable con CSS / Tailwind a través de `@awesome-ds/tokens`.

| Grupo      | Ejemplos                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| **Color**  | `--color-bg` · `--color-surface` · `--color-fg` · `--color-border` · `--color-accent` · `--color-ring` |
| **Space**  | `--space-1` … `--space-32`                                                                             |
| **Radius** | `--radius-sm` · `--radius-md` · `--radius-lg` · `--radius-full`                                        |
| **Type**   | `--text-xs` … `--text-7xl` · `--font-display` · `--font-body` · `--font-mono`                          |
| **Motion** | `--ease-out` · `--ease-spring` · `--dur-fast/base/slow`                                                |

Contrato legible por humanos → [`design-system/foundations/tokens.md`](./design-system/foundations/tokens.md)

## Evidencia y frescura

- Reference Atlas, reglas canon, signals en cuarentena
- `pnpm check:links` · `pnpm check:freshness` · `pnpm evidence:check`
- **No es un listado de enlaces** — las fuentes se absorben en doctrina y contratos ejecutables, validados por el grafo.

## Release reports & repository trust

AwesomeDS publica una instantánea de readiness fechada y legible por máquina en lugar de depender solo de insignias verdes:

- [`reports/release-readiness.json`](./reports/release-readiness.json) — veredicto SHIP/HOLD limitado, puertas de calidad medidas y comandos reproducibles
- [`docs/qa-report.md`](./docs/qa-report.md) — evidencia de navegador, accesibilidad, seguridad, rendimiento y paquetes
- [`docs/completion-audit.md`](./docs/completion-audit.md) — mapeo de requisitos a artifacts y límites honestos
- [`SECURITY.md`](./SECURITY.md) — reporte privado de vulnerabilidades y política de versiones soportadas

CI fija el escaneo de dependencias, bloquea evasiones de pruebas visuales, verifica la integridad de la evidencia/enlaces y mantiene el estado local del agente (`.claude/`, `.codex/`, `.tokensave/`) fuera del repositorio público.

## Localización

UI de docs en inglés y japonés. El Markdown canon es inglés primero; el fallback se marca de forma explícita.

## Contribuir

[CONTRIBUTING.md](./CONTRIBUTING.md)

## Licencia

[MIT](./LICENSE)

<div align="center"><sub>Hecho para que la IA diseñe con una estética que puede probar.</sub></div>
