<div align="center">

<img src="./assets/banner.svg" alt="AwesomeDesignSystem — la capa de buen gusto para agentes de IA" width="100%">

&nbsp;

[![License: MIT](https://img.shields.io/badge/License-MIT-1FB8B8?style=flat-square)](./LICENSE)
[![Cited sources: 270+](https://img.shields.io/badge/cited_sources-270%2B-E5484D?style=flat-square)](./research)
[![Skills: 5](https://img.shields.io/badge/skills-5-7C5CFC?style=flat-square)](./skills)
[![Color: OKLCH](https://img.shields.io/badge/color-OKLCH-D6409F?style=flat-square)](./design-system/foundations/color.md)
[![Built for: AI agents](https://img.shields.io/badge/built_for-AI_agents-18181D?style=flat-square)](./design-system/INDEX.md)
[![PRs: welcome](https://img.shields.io/badge/PRs-welcome-46C26B?style=flat-square)](./CONTRIBUTING.md)

[English](./README.md) · [日本語](./README.ja.md) · [简体中文](./README.zh-Hans.md) · [한국어](./README.ko.md) · **Español**

</div>

---

> **Evita la mediana. Comprométete con un punto de vista.** Una base de conocimiento de sistema de diseño autocontenida y con fuentes citadas **＋** un conjunto de skills que permiten a cualquier agente de IA producir un diseño frontend moderno (2026) y con sensación humana — y dejar de publicar el típico "AI slop".

## 🧭 Por qué existe

Pídele a un LLM que "construya una landing page" y no obtienes *diseño* — obtienes la **mediana estadística** de cada tutorial de Tailwind jamás rastreado: Inter, un degradado de morado a azul sobre blanco, un hero centrado, tres tarjetas de features con emojis. No porque al modelo le falte conocimiento, sino porque **cae al centro a menos que lo desvíes de él.**

AwesomeDesignSystem aporta esa dirección: un cuerpo de conocimiento de diseño curado y con criterio — **con el código incrustado** — más skills que cargan solo lo que la tarea necesita.

| | |
|---|---|
| 🤖 **Diseñado para que los agentes de IA lo lean directamente** | Sin tener que buscar la documentación de una librería a mitad de tarea para ser productivo… |
| 🪶 **…sin inflar el contexto** | …y sin tragarse todo el sistema dentro del contexto tampoco. |
| 📐 **Rigor de fuentes primarias** | Destilado de Apple HIG & Liquid Glass, Material 3 Expressive, Nothing, Goodpatch, Linear/Stripe/Vercel/Raycast ＋ la documentación oficial de las librerías. |
| 🔬 **Verificado de forma adversarial** | Más de 270 fuentes citadas viven en [`research/`](./research). |

## 📂 Qué hay dentro

Tres capas: **conocimiento** (leer) · **evidencia** (verificar) · **verbos** (actuar).

<details open>
<summary><b>El mapa del repositorio</b></summary>

```
design-system/            ← la base de conocimiento canónica (código incrustado · única fuente de verdad)
  INDEX.md                  router: pregunta → qué módulo leer
  best-practice-design-for-ai.md   la síntesis insignia, con enlaces a fuentes
  00-philosophy/            capa de gusto ·「moderno 2026」· principios fundamentales
  foundations/              color (OKLCH) · typography (incl. 日本語) · spacing/layout · tokens
  motion/                   principios · recetas copy-paste de Motion + CSS
  components/               button/card/input/dialog/… con estados + a11y
  patterns/                 hero/bento/sections/nav/backgrounds (anti-slop)
  accessibility/            WCAG 2.2 · focus · keyboard · contrast
  tech-stack-2026/          el stack AI-native recomendado
research/                 ← investigación cruda de fuentes primarias (la evidencia)
skills/                   ← cinco skills portables (los verbos)
```

</details>

## 🛠️ Las cinco skills

| | Skill | Úsala para… |
|:--:|---|---|
| 🎨 | **/AwesomeDS** | Construir o refinar cualquier UI con la capa de gusto del sistema; enruta solo a los módulos que necesitas. |
| 🏗️ | **/MakeAwesomeDS** | Generar el sistema de diseño *propio* de una marca/producto (tokens OKLCH + `DESIGN.md` + previews). |
| 📄 | **/AwesomeHTML** | Convertir Markdown / investigación / notas en un documento HTML de un solo archivo, pulido y autocontenido. |
| 🔍 | **/AwesomeReview** | Auditar UI o código existente — detecta AI slop y fallos de a11y, reporta arreglos priorizados. |
| ✨ | **/AwesomeMotion** | Diseñar movimiento con criterio y propósito (Motion para React + recetas solo CSS). |

## 🚀 Inicio rápido

#### Para un agente de IA — sin instalación

> [!TIP]
> Apunta al agente a este repositorio y dile que **lea primero [`design-system/INDEX.md`](./design-system/INDEX.md)**, y luego abra solo los módulos que su tarea necesite. El INDEX es el mapa; cada módulo es autocontenido.

#### Como skills de Claude Code

```bash
git clone https://github.com/Yu-aimaker/AwesomeDesignSystem.git
cd AwesomeDesignSystem
./install.sh        # enlaza las 5 skills en ~/.claude/skills (y respalda cualquier skill previa)
```

Luego en Claude Code: `/AwesomeDS` · `/MakeAwesomeDS` · `/AwesomeHTML` · `/AwesomeReview` · `/AwesomeMotion`

> [!NOTE]
> `install.sh` usa enlaces simbólicos, así que mantén el repo en su sitio — al hacer pull se actualizan las skills. Usa `--copy` para entornos aislados (sandbox).

## 📐 El estándar, en un solo aliento

> Evita la mediana. Comprométete con un punto de vista. Un color dominante **＋** acentos nítidos, nunca una paleta tímida y uniforme. Una tipografía deliberada y distintiva — nunca Inter como única opción. Jerarquía real mediante contraste; un foco por pantalla. Contención **＝** confianza. El movimiento comunica estado, no decoración — una carga de página orquestada vale más que microinteracciones dispersas. Tematiza tus primitivos, nunca entregues los defaults en crudo. Diseña siempre los estados de error / vacío / carga y cumple WCAG 2.2 AA. Un **todo** coherente, no una colección de partes.

## 🎨 Tokens de diseño — el vocabulario compartido

Cada módulo habla **un único lenguaje de tokens**, reflejado en un bloque `@theme {}` de Tailwind v4.

<details>
<summary><b>El contrato de tokens completo</b></summary>

| Grupo | Tokens |
|---|---|
| **Color** (semántico, OKLCH) | `--color-bg` · `--color-surface` · `--color-fg` · `--color-border` · `--color-accent` · `--color-ring` |
| **Space** (escala 8pt) | `--space-1` … `--space-32` |
| **Radius** | `--radius-sm` · `--radius-md` · `--radius-lg` · `--radius-full` |
| **Type** (fluida) | `--text-xs` … `--text-7xl` · `--leading-*` · `--tracking-*` |
| **Font** | `--font-display` · `--font-body` · `--font-mono` |
| **Elevation** | bordes hairline **+** `--shadow-sm/md/lg` |
| **Motion** | `--ease-out` · `--ease-spring` · `--dur-fast/base/slow` |

El conjunto completo con valores → [`foundations/tokens.md`](./design-system/foundations/tokens.md)

</details>

## 🤝 Contribuir

Mira [CONTRIBUTING.md](./CONTRIBUTING.md). El listón: toda afirmación tiene **fuente**, el código va **incrustado**, las skills se mantienen **frugales en tokens**, y no se publica nada que no pase el Pre-Flight anti-AI-slop.

## ⚖️ Licencia

[MIT](./LICENSE) — libre para usar, adaptar y construir encima.

<div align="center"><sub>Hecho para que la IA diseñe como si tuviera buen gusto. 🎨</sub></div>
