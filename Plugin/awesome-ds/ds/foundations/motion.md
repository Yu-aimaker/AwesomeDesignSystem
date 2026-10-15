# Motion

Motion in AwesomeDS is feedback. It confirms an action, shows where something came from,
or keeps a user oriented during a state change. It is short, eased out, travels a few
pixels, and can always be turned off. This file gives the durations, curves, spring
values, distance limits, the library decision tree and the performance rules.

## Decisions

| Token | Value | Use |
|---|---|---|
| duration-instant | 100 ms | Color and opacity on hover, focus ring |
| duration-fast | 150 ms | Small movement: checkbox tick, switch thumb, tab indicator |
| duration-base | 200 ms | Default enter: popover, dropdown, tooltip, toast |
| duration-slow | 300 ms | Dialog, sheet, page section reveal |
| duration-slower | 500 ms | Page-level transitions, rare |
| ease-out | `cubic-bezier(0.16, 1, 0.3, 1)` | Every enter and every user-triggered change |
| ease-in | `cubic-bezier(0.7, 0, 0.84, 0)` | Exits only, and shorter than the matching enter |
| ease-in-out | `cubic-bezier(0.65, 0, 0.35, 1)` | Elements that move from one on-screen place to another |
| spring-gentle | stiffness 170, damping 26 | Layout changes, reorder |
| spring-snappy | stiffness 400, damping 30 | Drags, gestures, sheet dismissal |

Distance: enters travel 4 to 8 px, never 24 or more. Scale enters start at 0.98, never 0.8.
Exit is faster than enter (roughly two thirds of the duration).

## Why these durations

- NN/g's response-time work: under 0.1 s feels instant; under 1 s keeps the flow of thought.
  NN/g's animation-duration guidance puts most UI animation between 100 and 500 ms and
  simple feedback near 100 ms.
- Emil Kowalski: a modal after a click should appear in 200 ms or less; keep UI animation
  under 300 ms; exits faster than enters because the user is already waiting to do the next thing.
- Material 3 splits durations into short, medium, long and extra long and scales them with
  distance travelled. AwesomeDS keeps five named values for the same reason, with 300 ms as
  the upper bound for anything inside a view.

## Why ease-out, and why not `ease` or `linear`

- `ease-out` starts fast and settles. The user sees the response immediately and the end is
  calm. Kowalski recommends defaulting to ease-out for enters and exits and notes the
  built-in CSS curves are too weak; strong custom curves such as `cubic-bezier(0.16, 1, 0.3, 1)`
  read as responsive.
- `ease` (the CSS default) is close to symmetric. It delays the visible start, so a 200 ms
  transition feels like 250. Its use is a sign that no one chose a curve.
- `linear` has no acceleration. Nothing in the physical world moves that way, so it looks
  mechanical. It is correct only for progress bars and marquee-type continuous motion where
  a constant rate is the message.
- Material's "emphasized decelerate" and "standard decelerate" are the same idea: enters
  decelerate, exits accelerate.

## Enter and exit asymmetry

| | Enter | Exit |
|---|---|---|
| Duration | 200 ms (base) | ~130 ms |
| Curve | ease-out | ease-in, or ease-out at shorter duration |
| Transform | translateY(4 to 8px) to 0, or scale 0.98 to 1 | reverse, fewer pixels |
| Opacity | 0 to 1 | 1 to 0 |

Exits are shorter because attention has already moved on. Exits never overshoot.

## Springs

Springs replace duration for anything the user is dragging, because a drag has a velocity
and the release should continue it. Motion's `type: "spring"` takes `stiffness`, `damping`
and `mass`; higher stiffness moves faster, higher damping stops overshoot.

- `spring-snappy` (400 / 30): sheets, sliders, reorder drops. Settles in about 300 ms with
  no visible bounce.
- `spring-gentle` (170 / 26): layout shifts (`layout` prop), list reflow.
- No bouncy springs (damping under 20) in product UI. Bounce belongs in `ds-creator` for
  playful brands.

## Distance limits

- 4 to 8 px of travel is enough to show direction. 24 px or more reads as an object flying in,
  draws the eye away from the content, and needs a longer duration to look right.
- Scale from 0.98 keeps the element recognisable throughout. Scale from 0.8 is the "pop"
  effect that reads as template UI.
- Stagger between list items: 20 to 40 ms, capped so the last item starts within 200 ms.

## Reduced motion

`@media (prefers-reduced-motion: reduce)` is honoured globally in `tokens.css` by setting
animation and transition durations to near zero. Components keep opacity changes (they do
not trigger vestibular symptoms) and drop transforms, parallax, auto-play and infinite loops.
Apple HIG: when Reduce Motion is on, minimise or eliminate animation. WCAG 2.3.3
(Animation from Interactions, AAA) asks for the same and AwesomeDS treats it as a floor.

Motion for React: `useReducedMotion()` returns the preference; pass `transition={{ duration: 0 }}`
or switch `animate` to opacity only.

## Library decision tree

```
Is it a hover, focus, color, opacity or small transform on one element?
  yes -> CSS transition. Done.
Is it an enter/exit, layout change, shared element, or gesture in React?
  yes -> Motion (`motion/react`). Use `AnimatePresence`, `layout`, springs.
Is it a pinned or scrubbed scroll sequence (scrollytelling)?
  yes -> CSS scroll-driven animations if supported and simple;
         otherwise GSAP ScrollTrigger (pin, scrub) in an isolated client component.
Is it an illustration or icon animation authored by a designer?
  yes -> Lottie (.lottie via @lottiefiles/dotlottie-web). Static PNG fallback under reduced motion.
Is the product itself 3D (configurator, spatial data)?
  yes -> three.js via react-three-fiber. Never as a background for a text page.
```

Never mix GSAP or three.js and Motion on the same element tree; they fight for frames.

AwesomeDS authors the durations, curves, and this tree (hybrid C, Linear STA-19,
2026-09-06). It does not author a replacement for Motion, GSAP, Lottie, or three.js.
A preview page plays the recommended library. It does not ship a second runtime.

## Performance rules

1. Animate only `transform` and `opacity`. These are compositor properties; `width`,
   `height`, `top`, `box-shadow`, `filter` cause layout or paint.
2. No scroll listeners writing to React state. Use Motion `useScroll` and `useTransform`
   (motion values bypass render), CSS scroll-driven animations, or GSAP's own ticker.
3. `will-change` only on the element about to move, removed after.
4. One animation library per page. Load Motion lazily on marketing pages if the above-fold
   content has none.
5. Nothing loops forever except a progress indicator and a skeleton shimmer, and the shimmer
   stops under reduced motion.
6. Interruptible: prefer CSS transitions and Motion springs, both of which can retarget
   mid-flight. Keyframe animations restart and feel broken when the user changes state.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Framer Motion package name | Renamed to Motion; `motion/react` is the current import. |
| GSAP as the default library | Excellent, but imperative; Motion's declarative API fits React state. GSAP is reserved for scroll sequences. |
| `ease-in-out` for everything | Slow start makes UI feel laggy. Reserved for on-screen moves. |
| Longer durations "for elegance" (400 to 600 ms) | NN/g and Kowalski agree users wait on exits; long animations are a leading annoyance. |
| Bouncy springs by default | Overshoot reads as playful; the base is neutral. |
| Auto-forwarding carousels | NN/g: annoy users and reduce visibility of content. |

## Sources

- https://www.nngroup.com/articles/animation-duration/ : 100 to 500 ms guidance; simple feedback near 100 ms.
- https://www.nngroup.com/articles/response-times-3-important-limits/ : 0.1 / 1 / 10 s.
- https://www.nngroup.com/articles/animation-purpose-ux/ : animation as feedback, restraint.
- https://www.nngroup.com/articles/animation-usability/ : attention and distraction.
- https://www.nngroup.com/articles/designing-effective-carousels/ : auto-forwarding harms.
- https://emilkowal.ski/ui/great-animations : ease-out default, 200 ms modals, interruptibility.
- https://emilkowal.ski/ui/good-vs-great-animations : what separates adequate from good motion.
- https://animations.dev/ : Kowalski's course; easing as the most important property.
- https://github.com/emilkowalski/skills/blob/main/skills/review-animations/STANDARDS.md : "built-in CSS easings are too weak", exits faster than enters.
- https://m3.material.io/styles/motion/easing-and-duration : emphasized and standard easing sets; duration tokens.
- https://developer.apple.com/design/human-interface-guidelines/motion : purposeful motion; Reduce Motion.
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion : media feature.
- https://www.w3.org/WAI/WCAG21/Techniques/css/C39 : using the query to prevent motion.
- https://motion.dev/docs/react-transitions : spring stiffness, damping, mass; transition prop.
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/ : pin and scrub.
- https://developer.chrome.com/docs/css-ui/scroll-driven-animations : off-main-thread scroll timelines.
- https://docs.lottiefiles.com/en : dotLottie players.
- https://github.com/LottieFiles/dotlottie-web : web player package.
- https://r3f.docs.pmnd.rs/getting-started/introduction : react-three-fiber.
- https://github.com/pmndrs/react-three-fiber : repository.
- https://github.com/Leonxlnx/taste-skill : never `useState` for continuous values; never mix GSAP/three with Motion; isolate motion in client leaves.
- https://linear.app/stark--industries/issue/STA-19 : hybrid C. AwesomeDS authors the motion tokens. It does not replace Motion, GSAP, Lottie, or three.js.
