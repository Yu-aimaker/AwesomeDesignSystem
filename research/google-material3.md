# Google Material 3 (M3) & Material 3 Expressive

> AI-agent reference. Snapshot: **June 2026**. Primary sources: m3.material.io, Google Design blog, material-components GitHub, Android Developers.
> Material 3 Expressive launched at **Google I/O 2025 (May 13, 2025)**; first shipped on Pixel (Android 16 QPR1) in **Sept 2025**.

---

## 1. What M3 Expressive Is

Material 3 Expressive is **not "Material 4"** — it is an expansion of Material Design 3. It adds emotional, motion-rich design on top of the existing M3 foundations (dynamic color, type scale, tokens). Key facts:

- **Most-researched design refresh Google has ever done**: 46 studies, hundreds of design variations, 18,000+ participants worldwide.
- Findings: people **prefer** expressive designs across all age groups (up to **87%** among 18–24-year-olds); participants spotted key UI elements **up to 4× faster** (eye-tracking, 10 apps); brand perception rose **+34% "modernity"**, **+32% "subculture"**, and **+30% "rebelliousness"**.
- New building blocks: **motion physics (spring) system**, expanded **shape scale + shape morphing** (35 new shapes), 5 new components + 15 refreshed components, emphasized typography.
- On Jetpack Compose, **21 Material components use the motion physics system by default**.

---

## 2. Motion: The Physics (Spring) System

M3 Expressive **replaces the duration+easing model with a physics/spring model** as the primary motion language. Springs can be **re-targeted mid-flight** (critical for gesture-driven UIs) — a duration animation feels jarring if interrupted; a spring recomputes a natural trajectory to the new target.

### Spring attributes
- **Stiffness** — hardness of the spring; higher resolves faster / more energetic.
- **Damping (ratio)** — how fast bounce decays; **`1.0` = no bounce (critically damped)**, lower = more overshoot.
- **Initial velocity** — starting speed; combines with stiffness + damping to determine total duration.

### Two spring categories
- **Spatial** — animates position, size, rotation, corner radius. **Overshoots & bounces** into place.
- **Effects** — animates color & opacity. **No overshoot** (damping = 1.0).

### Motion schemes (called at product level, not baked into token name)
| Scheme | Feel | Damping | Use |
|---|---|---|---|
| **Expressive** (default) | Bouncy, playful | Lower (overshoot) | Hero moments, key interactions, most situations |
| **Standard** | Functional, minimal bounce | Higher | Utilitarian / calm products |

You can also define **custom schemes**, and swap expressive↔standard↔custom without changing token assignments.

### Spring tokens (MDC-Android `materialcomponents` 1.13.0+ values)
Token naming: `md.sys.motion.spring.<speed>.<type>` → e.g. `md.sys.motion.spring.fast.spatial`. Three speeds × two types:

| Token | Damping | Stiffness | Use case |
|---|---|---|---|
| `motionSpringFastSpatial` | 0.9 | 1400 | Small components (switches, chips) |
| `motionSpringFastEffects` | 1.0 | 3800 | Small-component color/opacity |
| `motionSpringDefaultSpatial` | 0.9 | 700 | Partial-screen positioning |
| `motionSpringDefaultEffects` | 1.0 | 1600 | Partial-screen color/opacity |
| `motionSpringSlowSpatial` | 0.9 | 300 | Full-screen positioning |
| `motionSpringSlowEffects` | 1.0 | 800 | Full-screen color/opacity |

> Speed selection rule: **small / short distance → fast**, **full-screen → slow**, **everything in between → default**. Exact numbers are device-scaled (wearable vs phone vs tablet) but ordering (fast > default > slow) is invariant.

### Jetpack Compose example
```kotlin
@OptIn(ExperimentalMaterial3ExpressiveApi::class)
val scheme = MaterialTheme.motionScheme            // expressive by default in M3E
val spatial = scheme.fastSpatialSpec<Float>()       // spring spec
val effects = scheme.defaultEffectsSpec<Color>()

// Raw spring (expressive bounce):
val bouncy = spring(
    dampingRatio = Spring.DampingRatioMediumBouncy,  // ~0.5 visible bounce
    stiffness    = Spring.StiffnessMedium            // ~1500f
)
```

---

## 3. Legacy Easing & Duration Tokens (still valid; MDC-Android 1.6.0+)

Curve system pairs an **easing** (interpolator) with a **duration**.

### Easing tokens
| Token | cubic-bezier |
|---|---|
| `motionEasingStandard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `motionEasingStandardDecelerate` | `cubic-bezier(0, 0, 0, 1)` |
| `motionEasingStandardAccelerate` | `cubic-bezier(0.3, 0, 1, 1)` |
| `motionEasingEmphasized` | path-based (≈ `cubic-bezier(0.2,0,0,1)` two-segment) |
| `motionEasingEmphasizedDecelerate` | `cubic-bezier(0.05, 0.7, 0.1, 1)` |
| `motionEasingEmphasizedAccelerate` | `cubic-bezier(0.3, 0, 0.8, 0.15)` |
| `motionEasingLinear` | `cubic-bezier(0, 0, 1, 1)` |

### Duration tokens (ms)
| Token | ms | | Token | ms |
|---|---|---|---|---|
| `short1` | 50 | | `long1` | 450 |
| `short2` | 100 | | `long2` | 500 |
| `short3` | 150 | | `long3` | 550 |
| `short4` | 200 | | `long4` | 600 |
| `medium1` | 250 | | `extraLong1` | 700 |
| `medium2` | 300 | | `extraLong2` | 800 |
| `medium3` | 350 | | `extraLong3` | 900 |
| `medium4` | 400 | | `extraLong4` | 1000 |

**Guidance:** small UI changes → short; entering elements → emphasized-decelerate; exiting → emphasized-accelerate; persistent on-screen transitions → emphasized.

---

## 4. Dynamic Color & Material You (HCT)

### HCT color space
Material uses **HCT (Hue, Chroma, Tone)** — built on CIELAB lightness, not sRGB/HSL.
- **Hue** 0–360 (circular; 0 == 360).
- **Chroma** 0 (gray) → ~120 (max varies per hue/tone).
- **Tone** 0 (black) → 100 (white) == perceptual luminance; **drives contrast/accessibility**.
- Key property: you can change hue/chroma **without changing tone** → contrast is preserved.

### Pipeline: source → key colors → tonal palettes → roles
1. **Source color** — picked by designer, or extracted from wallpaper/image via **quantization** (filters image to most-representative colors).
2. **5 key colors** derived: **primary, secondary, tertiary, neutral, neutral-variant** (+ static **error**).
   - Primary key = chroma 48, tone 40. Secondary key = chroma 16, tone 40 (less saturated). Tertiary = contrasting accent.
3. **Tonal palettes** — each key color → palette of **13 tones** (0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100).
4. **Color roles** — specific tones assigned to semantic roles, paired for **guaranteed ≥3:1 contrast**.

### Role → tone mapping (light / dark)
| Role | Light tone | Dark tone |
|---|---|---|
| `primary` | 40 | 80 |
| `onPrimary` | 100 | 20 |
| `primaryContainer` | 90 | 30 |
| `onPrimaryContainer` | 10 | 90 |
| `surface` | 99 (now ~98) | 6–10 |
| `onSurface` | 10 | 90 |
| `surfaceVariant` | 90 | 30 |
| `outline` | 50 | 60 |

(secondary/tertiary follow the same container/on-container pattern.) **Error is a static role** — does not respond to dynamic color but does swap for light/dark.

### Tonal surfaces & elevation tint
M3 surfaces are **tonal**: surface containers use a ramp — `surfaceContainerLowest`, `surfaceContainerLow`, `surfaceContainer`, `surfaceContainerHigh`, `surfaceContainerHighest` — replacing M2's "elevation overlay opacity." Higher emphasis = higher tonal step.

### User contrast levels
Dynamic color generates **Standard / Medium / High** contrast variants; users pick in system settings, and palettes regenerate to keep accessible pairings.

### Tooling
- **Material Color Utilities (MCU)** — `material-foundation/material-color-utilities` (TS/Dart/Java/C++/Swift). Functions: HCT conversion, quantization (Celebi/Wu), `themeFromSourceColor`, `Scheme`/`DynamicScheme`.
- **Material Theme Builder** — Figma plugin + web tool to generate themes from a seed color.

```ts
// material-color-utilities (web)
import { argbFromHex, themeFromSourceColor, hexFromArgb } from "@material/material-color-utilities";
const theme = themeFromSourceColor(argbFromHex("#6750A4"));
const primary = hexFromArgb(theme.schemes.light.primary);
```

---

## 5. Type Scale

5 roles × 3 sizes = **15 baseline styles**; M3E adds **15 emphasized** variants (higher weight). Default typeface **Roboto** (`--md-ref-typeface-brand` for display/headline, `--md-ref-typeface-plain` for title/body/label). Token convention: `--md-sys-typescale-<role>-<size>-<property>`.

**Exact values (from Material Web source tokens, v0_192; rem→px @16px base):**

| Role / Size | Size | Line-height | Weight | Tracking |
|---|---|---|---|---|
| Display Large | 3.5625rem / 57px | 4rem / 64px | 400 | -0.015625rem |
| Display Medium | 2.8125rem / 45px | 3.25rem / 52px | 400 | 0 |
| Display Small | 2.25rem / 36px | 2.75rem / 44px | 400 | 0 |
| Headline Large | 2rem / 32px | 2.5rem / 40px | 400 | 0 |
| Headline Medium | 1.75rem / 28px | 2.25rem / 36px | 400 | 0 |
| Headline Small | 1.5rem / 24px | 2rem / 32px | 400 | 0 |
| Title Large | 1.375rem / 22px | 1.75rem / 28px | 400 | 0 |
| Title Medium | 1rem / 16px | 1.5rem / 24px | 500 | 0.009375rem |
| Title Small | 0.875rem / 14px | 1.25rem / 20px | 500 | 0.00625rem |
| Body Large | 1rem / 16px | 1.5rem / 24px | 400 | 0.03125rem |
| Body Medium | 0.875rem / 14px | 1.25rem / 20px | 400 | 0.015625rem |
| Body Small | 0.75rem / 12px | 1rem / 16px | 400 | 0.025rem |
| Label Large | 0.875rem / 14px | 1.25rem / 20px | 500 | 0.00625rem |
| Label Medium | 0.75rem / 12px | 1rem / 16px | 500 | 0.03125rem |
| Label Small | 0.6875rem / 11px | 1rem / 16px | 500 | 0.03125rem |

> Emphasized labels use `weight-bold` (`label-large-weight-prominent`). Line-height guidance ratio: ~1.2× for display/headline/title, ~1.5× for body/label.

```css
/* Material Web CSS custom property usage */
.title-medium {
  font-family: var(--md-sys-typescale-title-medium-font);
  font-size: var(--md-sys-typescale-title-medium-size);          /* 1rem */
  line-height: var(--md-sys-typescale-title-medium-line-height); /* 1.5rem */
  font-weight: var(--md-sys-typescale-title-medium-weight);      /* 500 */
  letter-spacing: var(--md-sys-typescale-title-medium-tracking); /* 0.009375rem */
}
```

---

## 6. Shape System

M3E expands to a granular corner-radius scale **+ shape morphing** + a library of **35 abstract shapes**.

| Token | dp | Notes |
|---|---|---|
| None | 0 | sharp |
| Extra small | 4 | |
| Small | 8 | |
| Medium | 12 | |
| Large | 16 | |
| **Large increased** | 20 | *new in M3E* |
| Extra large | 28 | |
| **Extra large increased** | 32 | *new in M3E* |
| **Extra extra large** | 48 | *new in M3E* |
| Full | pill | now `full` token (was "50% of size") |

```kotlin
// Jetpack Compose
MaterialTheme(
  shapes = Shapes(
    extraSmall = RoundedCornerShape(4.dp),
    small      = RoundedCornerShape(8.dp),
    medium     = RoundedCornerShape(12.dp),
    large      = RoundedCornerShape(16.dp),
    extraLarge = RoundedCornerShape(28.dp),
  )
)
```
**Shape morphing**: components animate between shapes (e.g., FAB `+` morphs to `×`; loading indicator cycles shapes; buttons round on press) using the spring system.

---

## 7. Elevation & State Layers

### Elevation (6 levels, dp + tonal surface)
| Level | dp | Typical use |
|---|---|---|
| 0 | 0 | filled buttons, outlined cards (flat) |
| 1 | 1 | elevated cards, bottom sheets |
| 2 | 3 | nav bar, menus |
| 3 | 6 | FAB, dialogs |
| 4 | 8 | reserved (hover) |
| 5 | 12 | reserved (dragged/hover) |

Resting states use 0–3; 4–5 are interaction states. In M3, depth is expressed primarily via **tonal surface color**, not just shadow.

### State layer opacity (overlay uses the content color role)
| State | Opacity |
|---|---|
| Hover | **0.08** |
| Focus | **0.10** |
| Pressed | **0.10** |
| Dragged | **0.16** |

Only one state layer active at a time. Token: `md.sys.state.<state>.state-layer-opacity`. Pressed also shows a ripple.

---

## 8. Adaptive Layout (Breakpoints)

"Window size classes" are now called **breakpoints**. Five width breakpoints:

| Breakpoint | Width (dp) | Devices | Nav pattern |
|---|---|---|---|
| Compact | 0–599 | phone portrait | Bottom Navigation Bar |
| Medium | 600–839 | phone landscape, small tablet | Navigation Rail |
| Expanded | 840–1199 | large tablet, foldable | Nav Rail / Drawer; 2 panes |
| Large | 1200–1599 | desktop | Navigation Drawer; 2 panes |
| Extra-large | 1600+ | large monitor | 3 panes |

Also Compact/Medium/Expanded **height** breakpoints. Adapt by **reveal / divide / resize / reposition / swap**. At medium width, avoid two panes for high-density content. At expanded+, two-pane layouts can snap to set widths.

```kotlin
val widthClass = currentWindowAdaptiveInfo().windowSizeClass
// material3-adaptive: NavigationSuiteScaffold auto-picks bar/rail/drawer
```

---

## 9. Accessibility

- **Text contrast**: small text ≥ **4.5:1**, large text (≥18pt / 14pt bold) ≥ **3:1** (WCAG AA). Icons/critical elements should also meet these.
- **Role pairings** guarantee ≥ **3:1** automatically (e.g. `surface`/`primary`, container/on-container). Misusing roles breaks this.
- **Touch targets** ≥ **48×48dp** (~9mm), even if visual is smaller (e.g. 24dp icon + padding). Pointer targets ≥ 44×44dp. Spacing ≥ 8dp.
- **User contrast levels**: Standard / Medium / High regenerate accessible palettes.
- Compose `Button`/`IconButton`/`ListItem` enforce 48dp automatically; custom elements must set it.

---

## 10. Versions & Platforms (June 2026)

- **Compose Material3 stable: 1.4.0** (stable per the official androidx release notes dated **June 3, 2026**; `1.4.0-rc01` was Sept 10, 2025 and it shipped via the Compose BOM `2025.12.00` in Dec 2025 — secondary sources list a Sept 24, 2025 artifact date). Expressive APIs ship in the **1.5.0-alpha** line; require `@OptIn(ExperimentalMaterial3ExpressiveApi::class)`. (1.4.0 also stopped auto-pulling `material-icons-core`.)
- New M3E components: **button groups, FAB menu, loading indicator, split button, toolbars (floating + docked)**. Bottom app bar **deprecated** → use docked toolbar. New loading indicator replaces most indeterminate circular spinners.
- MDC-Android: easing/duration system from **1.6.0**; physics spring system from **1.13.0**.
- Material Web: CSS-custom-property tokens (`--md-sys-*`, `--md-ref-*`).

```kotlin
dependencies {
  implementation("androidx.compose.material3:material3:1.4.0")
  implementation("androidx.compose.material3:material3-window-size-class:1.4.0")
  implementation("androidx.compose.material3:material3-adaptive-navigation-suite:1.5.0-alpha19")
}
```

---

## Sources
- Motion overview / physics system — https://m3.material.io/styles/motion/overview/how-it-works
- Easing & duration tokens/specs — https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
- M3 Expressive: New Motion System (blog) — https://m3.material.io/blog/m3-expressive-motion-theming
- Start building with M3 Expressive (blog) — https://m3.material.io/blog/building-with-m3-expressive
- Color system / how it works — https://m3.material.io/styles/color/system/how-the-system-works
- Color roles — https://m3.material.io/styles/color/roles
- Typography / applying type — https://m3.material.io/styles/typography/applying-type
- Material Web typography tokens (source) — https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-typescale.scss
- Shape — https://m3.material.io/styles/shape
- Elevation — https://m3.material.io/styles/elevation/applying-elevation
- States — https://m3.material.io/foundations/interaction/states/applying-states
- Layout / breakpoints — https://m3.material.io/foundations/layout/applying-layout
- Accessibility (structure) — https://m3.material.io/foundations/designing/structure
- MDC-Android Motion docs — https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md
- Material Color Utilities — https://github.com/material-foundation/material-color-utilities
- Material Theme Builder — https://github.com/material-foundation/material-theme-builder
- Compose Material3 releases — https://developer.android.com/jetpack/androidx/releases/compose-material3
- Android 16 M3 Expressive redesign — https://9to5google.com/2025/05/13/android-16-material-3-expressive-redesign/
- M3 Expressive deep dive (features/rollout) — https://www.androidauthority.com/google-material-3-expressive-features-changes-availability-supported-devices-3556392/
