<div align="center">

# AwesomeDesignSystem

**La capa de buen gusto para los agentes de IA.**
Una base de conocimiento de sistemas de diseño autocontenida y con fuentes citadas, junto con un conjunto de skills que permite a cualquier agente de IA
producir diseño frontend moderno (2026) y con sensibilidad humana — y dejar de entregar "AI slop" genérico.

<sub>

[English](./README.md) · [日本語](./README.ja.md) · [简体中文](./README.zh-Hans.md) · [한국어](./README.ko.md) · [Español](./README.es.md)

</sub>

</div>

---

## Por qué existe

Pídele a un LLM que "construya una landing page" y no obtienes *diseño*: obtienes la **mediana estadística**
de cada tutorial de Tailwind jamás rastreado: Inter, un degradado de morado a azul sobre blanco, un hero centrado,
tres tarjetas de funciones con emojis. No porque al modelo le falte conocimiento, sino porque **tiende al
centro a menos que lo desvíes de ahí.**

AwesomeDesignSystem aporta esa dirección: un cuerpo de conocimiento de diseño curado y con opinión propia — **con
el código incrustado** — más skills que cargan solo lo que cada tarea necesita. Está construido **para que los agentes de IA
lo lean directamente**, de modo que un agente nunca tenga que ir a buscar la documentación de una librería a mitad de una tarea para ser productivo, pero tampoco
tenga que tragarse el sistema entero dentro de su contexto.

Todo lo que hay aquí está destilado a partir de **fuentes primarias** (Apple HIG y Liquid Glass, Google Material 3
Expressive, Nothing, Goodpatch, Linear/Stripe/Vercel/Raycast y la documentación oficial de las librerías) y
**verificado de forma adversarial** — más de 270 fuentes citadas viven bajo [`research/`](./research).

## Qué contiene

```
design-system/            ← la base de conocimiento canónica (código incrustado; única fuente de verdad)
  INDEX.md                  enrutador: pregunta → qué módulo leer
  best-practice-design-for-ai.md   la síntesis insignia, con fuentes enlazadas
  00-philosophy/            capa de buen gusto · "modern 2026" · principios fundamentales
  foundations/              color (OKLCH) · tipografía (incl. 日本語) · espaciado/layout · tokens
  motion/                   principios · recetas listas para copiar y pegar de Motion + CSS
  components/               button/card/input/dialog/… con estados + a11y
  patterns/                 hero/bento/sections/nav/backgrounds (anti-slop)
  accessibility/            WCAG 2.2 · focus · teclado · contraste
  tech-stack-2026/          el stack AI-native recomendado
research/                 ← investigación cruda de fuentes primarias (la evidencia)
skills/                   ← cinco skills portables (los verbos)
```

## Las cinco skills

| Skill | Úsala para… |
|---|---|
| **/AwesomeDS** | Construir o refinar cualquier UI con la capa de buen gusto del sistema; enruta solo a los módulos que necesitas. |
| **/MakeAwesomeDS** | Generar el sistema de diseño *propio* de una marca o producto (tokens OKLCH + `DESIGN.md` + previews). |
| **/AwesomeHTML** | Convertir Markdown / investigación / notas en un documento HTML pulido, autocontenido y de un solo archivo. |
| **/AwesomeReview** | Auditar UI o código existente — detectar AI slop y fallos de a11y, e informar de las correcciones priorizadas. |
| **/AwesomeMotion** | Diseñar motion con buen gusto y un propósito claro (Motion para React + recetas solo con CSS). |

## Inicio rápido

### Para un agente de IA (sin instalación)
Apunta el agente a este repositorio y dile que **lea primero [`design-system/INDEX.md`](./design-system/INDEX.md)**,
y que luego abra solo los módulos que su tarea necesita. El INDEX es el mapa; cada módulo es autocontenido.

### Como skills de Claude Code
```bash
git clone https://github.com/Yu-aimaker/AwesomeDesignSystem.git
cd AwesomeDesignSystem
./install.sh        # crea symlinks de las 5 skills en ~/.claude/skills y respalda cualquier skill previa
```
Luego, en Claude Code: `/AwesomeDS`, `/MakeAwesomeDS`, `/AwesomeHTML`, `/AwesomeReview`, `/AwesomeMotion`.
> `install.sh` usa symlinks, así que mantén el repositorio en su sitio; al hacer pull de las actualizaciones se actualizan las skills. Usa `--copy` para entornos en sandbox.

## El estándar, en una sola frase

> Evita la mediana. Comprométete con un punto de vista. Un color dominante + acentos nítidos, nunca una paleta
> tímida y uniforme. Una tipografía deliberada y distintiva — nunca Inter como única opción. Jerarquía real
> a través del contraste; un solo punto focal por pantalla. La contención = confianza. El motion comunica estado,
> no decoración — una carga de página orquestada vale más que micro-interacciones dispersas. Tematiza tus
> primitivas, nunca entregues defaults en crudo. Diseña siempre los estados de error/vacío/carga y cumple con WCAG 2.2 AA.
> Un **todo** coherente, no una colección de partes.

## Design tokens (el vocabulario compartido)

Cada módulo habla un único lenguaje de tokens (el conjunto completo está en [`foundations/tokens.md`](./design-system/foundations/tokens.md)):
colores semánticos OKLCH (`--color-bg/-surface/-fg/-border/-accent/-ring`), una escala de espaciado de 8pt
(`--space-*`), `--radius-*`, una escala tipográfica fluida (`--text-*` + `--leading-*`/`--tracking-*`),
`--font-display/-body/-mono`, bordes hairline + `--shadow-*` y tokens de motion (`--ease-*`, `--dur-*`),
reflejados en un bloque `@theme {}` de Tailwind v4.

## Contribuir

Consulta [CONTRIBUTING.md](./CONTRIBUTING.md). El listón: cada afirmación tiene **fuente**, el código va **incrustado**,
las skills se mantienen **frugales en tokens** y no se entrega nada que no superaría el Pre-Flight anti-AI-slop.

## Licencia

[MIT](./LICENSE) — libre para usar, adaptar y construir sobre ella.

<div align="center"><sub>Construido para que la IA diseñe como si tuviera buen gusto.</sub></div>
