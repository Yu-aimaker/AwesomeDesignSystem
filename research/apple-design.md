# Apple Design Language (2026)

> Snapshot of Apple's current design language as of **June 2026**. Covers the Human Interface Guidelines (HIG), the **Liquid Glass** material (introduced at WWDC25, June 9 2025), SF Pro / SF Symbols 7, the type system, spatial/visionOS design, materials & vibrancy, motion, layout, and what makes Apple feel premium. Built for AI agents to consume without re-fetching. Concrete values and copy-paste code are embedded throughout.

---

## 1. Core HIG Themes

Apple's HIG is anchored by three foundational themes (a fourth, **Consistency**, is frequently grouped with them):

| Theme | Meaning | In practice |
|---|---|---|
| **Clarity** | Text legible at any size; icons precise; adornments minimal; negative space, color, and visual hierarchy direct attention. | Remove ambiguity from every interactive element. "Send Payment" beats "Submit". |
| **Deference** | Fluid motion and a crisp, unobtrusive interface help people understand content without competing with it. | UI recedes; the user's photos, messages, work stay front and center. |
| **Depth** | Distinct visual layers and realistic motion convey hierarchy and vitality, and help people understand relationships. | Layering + subtle motion communicate what matters — no extra decoration. |

The HIG is now a **single unified document** (no longer split per OS) covering iOS, iPadOS, macOS, watchOS, tvOS, and visionOS, organized into **Foundations** (color, typography, layout, materials, motion), **Patterns** (navigation, search, onboarding), **Components** (buttons, tab bars, sliders, alerts), and **Technologies** (widgets, Live Activities, SharePlay).

The 2025/2026 Liquid Glass design adds three operative design verbs that sit on top of the classic themes:

- **Hierarchy** — controls/navigation elevate and distinguish the content beneath them.
- **Harmony** — interface elements align with the *concentric* design of hardware + software across devices.
- **Consistency** — use standard iconography and predictable action placement across platforms.

---

## 2. Liquid Glass (WWDC25 → 2026)

**Liquid Glass** is Apple's unified material/design language announced **June 9, 2025** at WWDC25 and shipped across **iOS 26, iPadOS 26, macOS Tahoe 26, watchOS 26, tvOS 26, and visionOS 26**. Per Apple, it "combines the optical qualities of glass with a fluidity only Apple can achieve, as it transforms depending on your content or context" (Alan Dye, VP of Human Interface Design). It moves away from the flat language of iOS 7 (2013) back toward expressive, light-bending depth — inspired by visionOS — enabled by real-time rendering on modern Apple silicon.

### Material properties
- **Translucent** — reflects and **refracts** surrounding content ("lensing").
- **Adaptive color** — its color is informed by surrounding content; intelligently adapts between light and dark environments.
- **Specular highlights** — real-time rendering produces moving highlights that **react to device motion** (gyroscope), so highlights only render correctly on real hardware, not the Simulator.
- **Dynamic morphing** — shape/size transform based on content and context (e.g., a text-selection tooltip expands into a vertical list).

### Two variants
| Variant | Use |
|---|---|
| **Regular** (`.regular`) | Default. Versatile, more opaque/legible; for most controls and navigation. |
| **Clear** (`.clear`) | More transparent, for media-rich contexts where content should shine through; needs a dimming/contrast layer behind text. |

### Where to use vs avoid
- **Use it for the navigation layer** — controls, toolbars, tab bars, sidebars, sheets — a distinct *functional layer floating above content*.
- **Avoid** putting Liquid Glass on **main content** or stacking glass on glass. Applying it to list rows / large content areas "overuses" it and looks wrong.
- Glass effects are **tools to signal depth, feedback, and context change — not decoration.** Use purposefully.
- Be **judicious with color** in controls so they stay legible and let content infuse/shine through.

### System behaviors
- **Tab bars shrink on scroll** to focus content, then fluidly expand on scroll-up (iOS 26).
- **Toolbars detach from the bezel** into floating "bubbles" that appear/disappear by context; bottom tab bar is an inset Liquid Glass **capsule**.
- **Sidebars** refract content behind them and reflect the wallpaper for contextual awareness.
- **Lock Screen** time uses Liquid Glass; SF dynamically scales numeral weight/width/height to fit the subject.
- **Home Screen / Dock / widgets / app icons** are built from multiple Liquid Glass layers; macOS Tahoe gains light/dark/tinted/**clear** appearances and a transparent menu bar.

### App icons
Redesigned to a **layered system** (like visionOS/tvOS): translucency + glass shimmer that reacts to motion, heavier gradient use, and **light / dark / tinted / clear** renderings. Author them with the new **Icon Composer** tool with simple, bold layers offering dimensionality.

---

## 3. SwiftUI Liquid Glass API

Native SwiftUI/UIKit/AppKit controls adopt Liquid Glass **automatically** when you recompile against the iOS 26 SDK. For custom UI:

```swift
// Basic: regular glass in a capsule (default shape)
Text("Hello, Glass!")
    .padding()
    .glassEffect()

// Custom shape + corner radius
Text("Hello, World!")
    .font(.title)
    .padding()
    .glassEffect(in: .rect(cornerRadius: 16.0))

// Tinted + interactive (adds scale, bounce, shimmer on touch)
.glassEffect(.regular.tint(.blue).interactive())
```

`glassEffect` signature: `func glassEffect<S: Shape>(_ glass: Glass = .regular, in shape: S = DefaultGlassEffectShape, isEnabled: Bool = true) -> some View`. Variants: `.regular`, `.clear`, `.identity`. Chain `.tint()` and `.interactive()`.

**`GlassEffectContainer`** groups multiple glass shapes so they blend and morph as one (and improves rendering performance). The `spacing` controls how close elements must be before they merge:

```swift
GlassEffectContainer(spacing: 40.0) {
    HStack(spacing: 40.0) {
        Image(systemName: "scribble.variable")
            .frame(width: 80, height: 80).font(.system(size: 36))
            .glassEffect()
        Image(systemName: "eraser.fill")
            .frame(width: 80, height: 80).font(.system(size: 36))
            .glassEffect()
    }
}
```

**Morphing** between states uses a `@Namespace` + `.glassEffectID(_:in:)`; the glass physically morphs (not just fades). Prominent button style: `.buttonStyle(.glassProminent)`.

**Best practices:** apply `.glassEffect()` *after* other appearance modifiers; always wrap multiple glass views in a `GlassEffectContainer`; test on real hardware; keep shapes/styles consistent.

---

## 4. Type System: SF Pro, SF families, Dynamic Type

Apple's system typeface is **San Francisco (SF)**. Families:
- **SF Pro** — default UI font (Latin/Greek/Cyrillic). Optical variants **SF Pro Display** (≥20pt) and **SF Pro Text** (<20pt) interpolate automatically.
- **SF Compact** — watchOS (narrower for small round displays).
- **SF Mono** — monospaced (code, Terminal).
- **New York (NY)** — serif companion for reading/editorial contexts.
- SF ships in **9 weights**: Ultralight, Thin, Light, Regular, Medium, Semibold, Bold, Heavy, Black.

### iOS Dynamic Type scale (default "Large" content size)

| Text style | Weight | Size (pt) |
|---|---|---|
| Large Title | Regular | 34 |
| Title 1 | Regular | 28 |
| Title 2 | Regular | 22 |
| Title 3 | Regular | 20 |
| Headline | **Semibold** | 17 |
| Body | Regular | 17 |
| Callout | Regular | 16 |
| Subheadline | Regular | 15 |
| Footnote | Regular | 13 |
| Caption 1 | Regular | 12 |
| Caption 2 | Regular | 11 |

**Dynamic Type** lets users pick their preferred size. The system scales each *text style* by a different factor (larger styles scale less; `caption2` floors at 11pt so it stays legible). Accessibility sizes add even larger steps (all styles scale since iOS 11). Design to accommodate **50% smaller to 300% larger** than default.

```swift
// UIKit — always use semantic styles, not fixed sizes
label.font = UIFont.preferredFont(forTextStyle: .body)
label.adjustsFontForContentSizeCategory = true   // auto-update on size change
```

```swift
// SwiftUI — semantic styles scale automatically
Text("Title").font(.largeTitle)
Text("Body").font(.body)
```

Guidance: **choose styles by meaning, not size** (don't use `largeTitle` just to make body bigger). SF is tuned for default tracking — only adjust tracking for large display text. Liquid Glass refined system typography to be **bolder and left-aligned** in alerts/onboarding for clarity. The **emphasized** trait yields a bolder face per style (medium → heavy, mapping to SF weights).

---

## 5. SF Symbols 7 (2025/2026)

**SF Symbols 7** (beta June 11 2025) is the icon system shipped with iOS 26 and siblings: **7,000+ symbols** designed to integrate with SF, in **9 weights × 3 scales** (small/medium/large), auto-aligned to text baselines. *(As of WWDC26, June 2026, an **SF Symbols 8 beta** is available; its feature set is not yet fully documented. The v7 features below remain current in the shipping OSes.)*

### Rendering modes (all now support optional **gradient** rendering)
- **Monochrome** — single color.
- **Hierarchical** — single tint, multiple opacity levels for depth/emphasis.
- **Palette** — multiple contrasting custom colors.
- **Multicolor** — intrinsic colors across hundreds of symbols.

Gradient rendering generates a smooth linear gradient from a single source color, adding a sense of lighting/dimension (toggle below the rendering mode in the SF Symbols app).

### New in v7
- **Draw** animations mimic handwriting strokes. Presets **Draw On** / **Draw Off**; playback modes **Whole Symbol**, **By Layer**, **Individually**. Guide points (placed/edited in Ultralight/Regular/Black) control path drawing across all weights/scales.
- **Variable Draw** — builds on Variable Color to animate progress/strength (like a progress bar/temperature). At render time choose either variable color *or* variable draw.
- **Magic Replace** upgraded — seamless transitions when symbols share an enclosure shape; now integrates Draw (Draw Off out → Draw On in).
- Hundreds of new/refined symbols; expanded localized variants (Latin, Greek, Cyrillic, Hebrew, Arabic, CJK, Thai, Devanagari, Indic).

```swift
// SwiftUI symbol effects
Image(systemName: "bell.fill")
    .symbolEffect(.drawOn)            // new in SF Symbols 7
    .symbolRenderingMode(.hierarchical)

Image(systemName: "wifi")
    .symbolEffect(.variableColor)     // or variable draw via SymbolVariableValueMode
```

---

## 6. Materials, Vibrancy & Depth

A **material** in the HIG is a visual effect that creates depth/layering/hierarchy by altering colors and **blurring** the content beneath it. SwiftUI exposes a thickness scale; thicker = more opaque:

| Material | Typical use |
|---|---|
| `.ultraThinMaterial` | Lightest blur; overlays where background should read strongly. |
| `.thinMaterial` | Light overlays. |
| `.regularMaterial` | General-purpose panels. |
| `.thickMaterial` | Heavier separation. |
| `.ultraThickMaterial` | Most opaque; strong separation. |
| `.bar` | Toolbars/tab bars chrome. |

```swift
VStack { /* content */ }
    .padding()
    .background(.thinMaterial, in: .rect(cornerRadius: 16))
```

**Vibrancy** tints foreground content (text, symbols) to the material so it stays legible against varied backgrounds — use the semantic foreground styles (`.primary`, `.secondary`, `.tertiary`, `.quaternary`) so they pick up the correct vibrancy level. Materials and Liquid Glass automatically adapt to light/dark and underlying content for legibility.

---

## 7. Motion Principles

Apple frames motion as a way to **enliven and clarify**. Core HIG guidance:

1. **Use motion to communicate** — show how things change, what an action will do, what's next (e.g., a minimized macOS window flies to the Dock so you know where it went).
2. **Add motion purposefully** — keep people oriented; **avoid adding motion to frequent interactions** (the system already animates standard elements).
3. **Strive for realism & credibility** — motion must respect physical intuition; if a view slides down from the top, it shouldn't dismiss sideways.
4. **Prefer quick, precise animations** — brevity + precision feel lightweight and convey info effectively.

### Springs are the default (since iOS 17)
Since iOS 17, `withAnimation` uses a **spring** by default. Springs preserve **continuity and velocity** (an animation can pick up the velocity from the end of a gesture — easing curves cannot). SwiftUI tracks gesture velocity automatically.

**Two intuitive parameters** (adopted universally across Apple frameworks): `duration` and `bounce`.

```swift
withAnimation(.spring(duration: 0.6, bounce: 0.2)) { isExpanded.toggle() }

// Named presets along the damping spectrum:
.smooth   // critically damped, no overshoot
.snappy   // slight bounce
.bouncy   // more overshoot

// Legacy model still available:
.spring(response: 0.55, dampingFraction: 0.825, blendDuration: 0)
```

The `duration` is a **perceptual** duration (predictable), distinct from the unpredictable settling time — use SwiftUI's completion handler (which fires on perceptual duration) to sequence follow-up UI changes, never the settling time.

**When to use which:** springs for **user-driven** motion (taps, drags, swipes, toggles, sliders, pull-to-refresh); **`.linear`/`.easeInOut`** for automatic/continuous motion (loading spinners, progress bars). Apple's own non-bouncy springs appear in app launches, sheet presentations, push/pop navigation.

### Reduce Motion (accessibility, required)
- **Make motion optional** — never the *only* way to convey important info.
- Problematic motion: spinning, scaling, parallax, depth-of-field, animated blur — **disable or swap** these when Reduce Motion is on.
- **Don't strip all animation.** If motion conveys meaning (status change, hierarchy transition), replace it with a non-moving alternative: **dissolve / cross-fade, highlight fade, or color shift**. The OS itself swaps zoom/slide transitions for **dissolve**.

```swift
@Environment(\.accessibilityReduceMotion) private var reduceMotion
// pick a dissolve instead of slide when reduceMotion == true
```

---

## 8. Layout, Spacing & Corner Radii

- **Minimum tap target: 44×44 pt** on iOS/iPadOS (exceeds WCAG AAA; inline text links are the common exception).
- **Safe areas** keep content clear of the navigation bar, tab bar, toolbar, Dynamic Island, Home indicator, and device corner radii. Backgrounds should extend edge-to-edge; scrollable content runs to the very bottom.
- **Placement:** put principal items in the **upper-leading** area (where eyes/VoiceOver start). On iPad landscape, place controls on the **sides** for two-handed reach. **Avoid** the bottom edge (system gestures) and far corners (hard to reach).
- **Full-width buttons:** respect system side margins; round corners; align to the bottom of the safe area (clears the Home indicator).
- **Concentricity (Liquid Glass core):** nested elements should be **concentric** with the parent/hardware corner. Rule of thumb: a nested element's corner radius ≈ parent radius − padding, so curves stay parallel. Floating controls use **continuous (squircle) curvature** that matches the rounded hardware corners.
- iOS layouts conventionally use **16pt** horizontal content margins; spacing tends to follow multiples of 4/8pt.

---

## 9. Spatial / visionOS Design

**visionOS 26** has three scene types — combine them freely:

| Scene | What it is |
|---|---|
| **Window** | SwiftUI views/controls (optionally with 3D). System places a new window in front of the user's current gaze. Freely repositioned/resized; stretches to any size (tall browser, wide presentation). |
| **Volume** | A SwiftUI scene showing 360°-viewable 3D (RealityKit/Unity); **no frame** around 3D objects; viewable from any angle in the Shared Space. |
| **Space** | Default **Shared Space** (apps side by side). A **Full Space** gives one app exclusive immersion — unbounded 3D, portals, full environments. **Launch into the Shared Space** and let users opt into immersion. |

- **Glass material** for windows is **system-defined and non-customizable** — it adapts to lighting/background, modulates colors for contrast/legibility, and uses **specular highlights + shadows** to anchor content in physical space. There is **no Dark Mode**; glass adapts to ambient light.
- **Use depth intentionally** to signal hierarchy: recede a deprioritized window along the **z-axis**. The system auto-adds depth to 2D windows via color/temperature/reflections/shadows.
- **Ornaments** — UI that floats slightly in front of a window (toolbars sit along the bottom edge, just in front along z). Use system ornament containers (SwiftUI `glassBackgroundEffect`); keep them ≤ window width; prioritize frequent controls.
- **Input:** eyes (gaze) + hands (pinch) + voice. **Raw eye-tracking data is never exposed to apps** (core privacy principle). Interactive targets need **≥ 60 pt** of space for gaze precision; provide **hover/focus** brightening as feedback.
- **Ergonomics:** keep content in the field of view aligned to the head; favor left/right placement over high/low (neck comfort); support **indirect** gestures (hands at rest); reserve **direct** gestures for manipulation/inspection within easy reach; avoid jarring fast motion without a stable frame of reference.

---

## 10. What Makes Apple Feel Premium & Human

- **Content-first deference** — chrome recedes; Liquid Glass floats above and refracts content rather than boxing it in.
- **Physicality** — springs with velocity continuity, gyro-reactive specular highlights, and morphing glass make interactions feel like manipulating real material.
- **Concentric harmony** — software curves echo hardware corners; nothing fights the device shape.
- **Restraint** — quick, purposeful motion; minimal adornment; no motion on frequent actions.
- **Coherent system** — one type family (SF), one icon system (SF Symbols), one material (Liquid Glass) across six OSes.
- **Accessibility as default** — Dynamic Type, Reduce Transparency, Reduce Motion, Increase Contrast, and ≥44pt targets are first-class, with meaningful fallbacks (dissolve over zoom; opaque over translucent).

---

## Sources

- Liquid Glass | Apple Developer Documentation (Technology Overviews) — https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass
- Human Interface Guidelines | Apple Developer — https://developer.apple.com/design/human-interface-guidelines/
- Materials | Apple HIG — https://developer.apple.com/design/human-interface-guidelines/materials
- Typography | Apple HIG — https://developer.apple.com/design/human-interface-guidelines/typography
- Layout | Apple HIG — https://developer.apple.com/design/human-interface-guidelines/layout
- Motion | Apple HIG — https://developer.apple.com/design/human-interface-guidelines/motion
- Apple introduces a delightful and elegant new software design (Newsroom, June 9 2025) — https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/
- Meet Liquid Glass — WWDC25 session 219 — https://developer.apple.com/videos/play/wwdc2025/219/
- Get to know the new design system — WWDC25 session 356 — https://developer.apple.com/videos/play/wwdc2025/356/
- What's new in SF Symbols 7 — WWDC25 session 337 — https://developer.apple.com/videos/play/wwdc2025/337/
- SF Symbols — Apple Developer — https://developer.apple.com/sf-symbols/
- Animate with springs — WWDC23 session 10158 — https://developer.apple.com/videos/play/wwdc2023/10158/
- spring(duration:bounce:blendDuration:) | Apple Developer — https://developer.apple.com/documentation/SwiftUI/Animation/spring(duration:bounce:blendDuration:)
- GlassEffectContainer | Apple Developer — https://developer.apple.com/documentation/swiftui/glasseffectcontainer
- Reduced Motion evaluation criteria — App Store Connect Help — https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/
- visionOS Overview — Apple Developer — https://developer.apple.com/visionos/
- Liquid Glass — Wikipedia — https://en.wikipedia.org/wiki/Liquid_Glass
- Apple releases SF Symbols 7 beta with new animations, gradients — 9to5Mac — https://9to5mac.com/2025/06/11/apple-releases-sf-symbols-7-beta/
