import type { ReactNode } from "react";
import type { Control, PlaygroundState } from "../layout/Playground";
import { DURATION, EASING_OPTIONS, SPRING, bool, cssDuration, cssEase, motionEaseCode, num, springCode, str, tweenCode } from "./shared";
import { MarqueeStrip, NumberTicker, SplitTextReveal, TextScramble, Typewriter, UnderlineDraw } from "./text";
import { ButtonPress, CheckboxDraw, CopyConfirm, LikeBurst, SkeletonToContent, SwitchSpring, ToastEnter, TooltipEnter } from "./micro";
import { AccordionHeight, CardExpand, ListAddRemove, ReorderList, SharedLayoutTabs, StaggerGrid, ThemeCrossfade } from "./layout";
import { Parallax, RevealOnScroll, ScrollProgressBar } from "./scroll";
import { ScrollDrivenCSS } from "./ScrollDrivenDemo";
import { CSSTransitionCompare, ClipPathReveal, KeyframeSpinner } from "./css";
import { LazyHorizontalPan, LazyIcosahedron, LazyLottieDots, LazyLottieProgress, LazyParticleField, LazyStickyStack, LazyWireframeTorus } from "./lazy";

export interface DemoEntry {
  id: string;
  name: string;
  group: "text" | "micro" | "layout" | "scroll" | "3d" | "lottie" | "css";
  library: "css" | "motion" | "gsap" | "three" | "lottie";
  /** Japanese, at most 12 words: when to use it. */
  caption: string;
  /** Japanese, at most 12 words: when not to. */
  avoid?: string;
  controls?: Control[];
  initial: PlaygroundState;
  render: (state: PlaygroundState) => ReactNode;
  /** Minimal snippet reflecting the state. */
  code?: (state: PlaygroundState) => string;
  /** Official docs. */
  links?: Array<{ label: string; href: string }>;
  /** Tailwind classes for the demo pane, e.g. "min-h-80" for scroll demos. */
  paneClassName?: string;
  /** three / gsap / lottie: rendered through React.lazy so the page can defer them. */
  heavy?: boolean;
}

export const demoGroups: Array<{ id: DemoEntry["group"]; label: string }> = [
  { id: "text", label: "テキスト" },
  { id: "micro", label: "マイクロ" },
  { id: "layout", label: "レイアウト" },
  { id: "scroll", label: "スクロール" },
  { id: "3d", label: "3D" },
  { id: "lottie", label: "Lottie" },
  { id: "css", label: "CSS" },
];

export const libraries: Array<{ id: DemoEntry["library"]; label: string; url: string }> = [
  { id: "css", label: "CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations" },
  { id: "motion", label: "Motion", url: "https://motion.dev/docs/react" },
  { id: "gsap", label: "GSAP", url: "https://gsap.com/docs/v3/Plugins/ScrollTrigger/" },
  { id: "three", label: "three.js", url: "https://r3f.docs.pmnd.rs/getting-started/introduction" },
  { id: "lottie", label: "Lottie", url: "https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-react/" },
];

/* ------------------------------------------------------------------ */
/* Shared controls                                                      */
/* ------------------------------------------------------------------ */

const durationControl = (label = "duration", max = 1000, key = "duration"): Control => ({ type: "range", key, label, min: 0, max, step: 10, unit: "ms" });
const easingControl = (key = "easing", label = "easing"): Control => ({ type: "select", key, label, options: EASING_OPTIONS });
const travelControl = (max = 32, key = "travel", label = "移動"): Control => ({ type: "range", key, label, min: 0, max, step: 1, unit: "px" });
const stiffnessControl: Control = { type: "range", key: "stiffness", label: "stiffness", min: 50, max: 800, step: 10 };
const dampingControl: Control = { type: "range", key: "damping", label: "damping", min: 5, max: 60, step: 1 };
const springOrTween: Control[] = [{ type: "select", key: "mode", label: "transition", options: ["spring", "tween"] }, stiffnessControl, dampingControl, durationControl(), easingControl()];

const LINKS = {
  transition: { label: "motion.dev: transition", href: "https://motion.dev/docs/react-transitions" },
  animation: { label: "motion.dev: animation", href: "https://motion.dev/docs/react-animation" },
  layout: { label: "motion.dev: layout", href: "https://motion.dev/docs/react-layout-animations" },
  presence: { label: "motion.dev: AnimatePresence", href: "https://motion.dev/docs/react-animate-presence" },
  reorder: { label: "motion.dev: Reorder", href: "https://motion.dev/docs/react-reorder" },
  scroll: { label: "motion.dev: useScroll", href: "https://motion.dev/docs/react-use-scroll" },
  gestures: { label: "motion.dev: gestures", href: "https://motion.dev/docs/react-gestures" },
  animateFn: { label: "motion.dev: animate()", href: "https://motion.dev/docs/animate" },
  scrollTrigger: { label: "gsap.com: ScrollTrigger", href: "https://gsap.com/docs/v3/Plugins/ScrollTrigger/" },
  gsapContext: { label: "gsap.com: gsap.context()", href: "https://gsap.com/docs/v3/GSAP/gsap.context()/" },
  r3f: { label: "r3f: useFrame", href: "https://r3f.docs.pmnd.rs/api/hooks#useframe" },
  r3fCanvas: { label: "r3f: Canvas", href: "https://r3f.docs.pmnd.rs/api/canvas" },
  threePoints: { label: "threejs.org: Points", href: "https://threejs.org/docs/#api/en/objects/Points" },
  threeTorus: { label: "threejs.org: TorusKnotGeometry", href: "https://threejs.org/docs/#api/en/geometries/TorusKnotGeometry" },
  lottieReact: { label: "lottiefiles: dotlottie-react", href: "https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-react/" },
  lottieFormat: { label: "lottie: format", href: "https://lottie.github.io/lottie-spec/" },
  mdnTransition: { label: "MDN: transition", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/transition" },
  mdnKeyframes: { label: "MDN: @keyframes", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes" },
  mdnClip: { label: "MDN: clip-path", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path" },
  mdnTimeline: { label: "MDN: animation-timeline", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline" },
  mdnReduced: { label: "MDN: prefers-reduced-motion", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion" },
  mdnTabular: { label: "MDN: font-variant-numeric", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric" },
  mdnMask: { label: "MDN: mask-image", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image" },
};

/* ------------------------------------------------------------------ */
/* Demos                                                                */
/* ------------------------------------------------------------------ */

const text: DemoEntry[] = [
  {
    id: "split-text-reveal",
    name: "SplitTextReveal",
    group: "text",
    library: "motion",
    caption: "見出しの初回表示に。単語単位で 30ms ずつ。",
    avoid: "本文や長文には使わない。",
    controls: [{ type: "select", key: "mode", label: "単位", options: ["words", "chars"] }, { type: "range", key: "stagger", label: "stagger", min: 0, max: 120, step: 5, unit: "ms" }, durationControl(), travelControl(), easingControl()],
    initial: { mode: "words", stagger: 30, duration: DURATION.base, travel: 8, easing: "ease-out" },
    render: (s) => <SplitTextReveal mode={str(s, "mode", "words") as "words" | "chars"} stagger={num(s, "stagger", 30)} duration={num(s, "duration", DURATION.base)} travel={num(s, "travel", 8)} easing={str(s, "easing", "ease-out")} />,
    code: (s) => `<motion.p initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: ${num(s, "stagger", 30) / 1000} } } }}>
  {${str(s, "mode", "words") === "words" ? 'text.split(" ")' : "Array.from(text)"}.map((unit, i) => (
    <motion.span key={i} variants={{
      hidden: { opacity: 0, y: ${num(s, "travel", 8)} },
      show: { opacity: 1, y: 0, transition: { ${tweenCode(num(s, "duration", DURATION.base), str(s, "easing", "ease-out"))} } },
    }}>{unit}</motion.span>
  ))}
</motion.p>`,
    links: [LINKS.animation, LINKS.transition],
  },
  {
    id: "typewriter",
    name: "Typewriter",
    group: "text",
    library: "css",
    caption: "AI の応答など、生成中を示すときに。",
    avoid: "読ませたい文章には使わない。待たせる。",
    controls: [{ type: "range", key: "speed", label: "1 文字", min: 10, max: 200, step: 10, unit: "ms" }, { type: "toggle", key: "cursor", label: "カーソル" }],
    initial: { speed: 40, cursor: true },
    render: (s) => <Typewriter speed={num(s, "speed", 40)} cursor={bool(s, "cursor", true)} />,
    code: (s) => `const [count, setCount] = useState(0);
useEffect(() => {
  if (reduced) return setCount(text.length);
  const id = setInterval(() => setCount((c) => Math.min(text.length, c + 1)), ${num(s, "speed", 40)});
  return () => clearInterval(id);
}, [text, reduced]);
<p aria-label={text}><span aria-hidden>{text.slice(0, count)}</span>${bool(s, "cursor", true) ? "{count < text.length && <span className=\"cursor\" />}" : ""}</p>`,
    links: [LINKS.mdnReduced],
  },
  {
    id: "number-ticker",
    name: "NumberTicker",
    group: "text",
    library: "motion",
    caption: "KPI やカウントの初回表示に。tabular-nums で幅を固定。",
    avoid: "頻繁に更新される値には使わない。",
    controls: [{ type: "range", key: "target", label: "値", min: 10, max: 99999, step: 10 }, durationControl("duration", 3000), easingControl(), { type: "range", key: "decimals", label: "小数", min: 0, max: 2, step: 1 }],
    initial: { target: 12480, duration: 800, easing: "ease-out", decimals: 0 },
    render: (s) => <NumberTicker target={num(s, "target", 12480)} duration={num(s, "duration", 800)} easing={str(s, "easing", "ease-out")} decimals={num(s, "decimals", 0)} />,
    code: (s) => `const ref = useRef<HTMLSpanElement>(null);
useEffect(() => {
  const controls = animate(0, ${num(s, "target", 12480)}, {
    ${tweenCode(num(s, "duration", 800), str(s, "easing", "ease-out"))},
    onUpdate: (v) => { ref.current!.textContent = format(v); },
  });
  return () => controls.stop();
}, []);
<span ref={ref} className="tabular" />`,
    links: [LINKS.animateFn, LINKS.mdnTabular],
  },
  {
    id: "text-scramble",
    name: "TextScramble",
    group: "text",
    library: "css",
    caption: "ブランド名の演出、1 か所だけ。",
    avoid: "ナビや UI ラベルには使わない。",
    controls: [durationControl("duration", 2000), { type: "select", key: "charset", label: "文字", options: ["symbols", "katakana", "digits"] }],
    initial: { duration: 600, charset: "symbols" },
    render: (s) => <TextScramble duration={num(s, "duration", 600)} charset={str(s, "charset", "symbols") as "symbols" | "katakana" | "digits"} />,
    code: (s) => `// rAF loop; each character resolves left to right over ${num(s, "duration", 600)}ms
const t = Math.min(1, (now - start) / ${num(s, "duration", 600)});
out += t >= (i + 1) / text.length ? text[i] : random(CHARS.${str(s, "charset", "symbols")});
el.textContent = out;`,
    links: [LINKS.mdnReduced],
  },
  {
    id: "marquee-strip",
    name: "MarqueeStrip",
    group: "text",
    library: "css",
    caption: "ロゴ帯に。1 ページに 1 つ、必ず止められる。",
    avoid: "テキスト情報を流さない。読めない。",
    controls: [{ type: "range", key: "seconds", label: "1 周", min: 6, max: 60, step: 2, unit: "s" }, { type: "select", key: "direction", label: "方向", options: ["left", "right"] }, { type: "toggle", key: "pauseOnHover", label: "ホバーで停止" }, { type: "range", key: "gap", label: "gap", min: 16, max: 96, step: 8, unit: "px" }],
    initial: { seconds: 24, direction: "left", pauseOnHover: true, gap: 48 },
    render: (s) => <MarqueeStrip seconds={num(s, "seconds", 24)} direction={str(s, "direction", "left") as "left" | "right"} pauseOnHover={bool(s, "pauseOnHover", true)} gap={num(s, "gap", 48)} />,
    code: (s) => `.track { display: flex; gap: ${num(s, "gap", 48)}px; width: max-content;
  animation: marquee ${num(s, "seconds", 24)}s linear infinite${str(s, "direction", "left") === "right" ? " reverse" : ""}; }
${bool(s, "pauseOnHover", true) ? ".strip:hover .track { animation-play-state: paused; }\n" : ""}@keyframes marquee { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .track { animation: none; } }`,
    links: [LINKS.mdnKeyframes, LINKS.mdnMask],
    paneClassName: "px-0 sm:px-0",
  },
  {
    id: "underline-draw",
    name: "GradientlessHighlight",
    group: "text",
    library: "css",
    caption: "リンクや強調に。線が 1 本伸びるだけ。",
    avoid: "グラデーションや色替えの強調は使わない。",
    controls: [{ type: "select", key: "trigger", label: "きっかけ", options: ["hover", "mount"] }, durationControl(), easingControl(), { type: "range", key: "thickness", label: "太さ", min: 1, max: 4, step: 1, unit: "px" }, { type: "select", key: "origin", label: "起点", options: ["left", "center"] }],
    initial: { trigger: "hover", duration: DURATION.base, easing: "ease-out", thickness: 2, origin: "left" },
    render: (s) => <UnderlineDraw trigger={str(s, "trigger", "hover") as "hover" | "mount"} duration={num(s, "duration", DURATION.base)} easing={str(s, "easing", "ease-out")} thickness={num(s, "thickness", 2)} origin={str(s, "origin", "left") as "left" | "center"} />,
    code: (s) => `.word { position: relative; }
.word::after { content: ""; position: absolute; inset: auto 0 0; height: ${num(s, "thickness", 2)}px; background: var(--ds-ink);
  transform: scaleX(0); transform-origin: ${str(s, "origin", "left") === "left" ? "0 50%" : "50% 50%"};
  transition: transform ${cssDuration(num(s, "duration", DURATION.base))} ${cssEase(str(s, "easing", "ease-out"))}; }
.word:hover::after { transform: scaleX(1); }`,
    links: [LINKS.mdnTransition],
  },
];

const micro: DemoEntry[] = [
  {
    id: "button-press",
    name: "ButtonPress",
    group: "micro",
    library: "motion",
    caption: "押した手応え。0.98 まで、100ms。",
    avoid: "0.9 以下はおもちゃに見える。",
    controls: [{ type: "range", key: "scale", label: "scale", min: 0.8, max: 1, step: 0.01 }, durationControl("duration", 400), { type: "toggle", key: "compare", label: "比較を表示" }],
    initial: { scale: 0.98, duration: DURATION.instant, compare: true },
    render: (s) => <ButtonPress scale={num(s, "scale", 0.98)} duration={num(s, "duration", DURATION.instant)} compare={bool(s, "compare", true)} />,
    code: (s) => `<motion.button whileTap={{ scale: ${num(s, "scale", 0.98)} }} transition={{ ${tweenCode(num(s, "duration", DURATION.instant), "ease-out")} }}>保存</motion.button>`,
    links: [LINKS.gestures],
  },
  {
    id: "checkbox-draw",
    name: "CheckboxDraw",
    group: "micro",
    library: "motion",
    caption: "チェックは線を描く。150ms。",
    avoid: "バウンスや拡大は入れない。",
    controls: [durationControl("duration", 600), easingControl(), { type: "range", key: "size", label: "size", min: 16, max: 40, step: 2, unit: "px" }],
    initial: { duration: DURATION.fast, easing: "ease-out", size: 24 },
    render: (s) => <CheckboxDraw duration={num(s, "duration", DURATION.fast)} easing={str(s, "easing", "ease-out")} size={num(s, "size", 24)} />,
    code: (s) => `<motion.path d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"
  animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
  transition={{ pathLength: { ${tweenCode(num(s, "duration", DURATION.fast), str(s, "easing", "ease-out"))} } }} />`,
    links: [LINKS.animation],
  },
  {
    id: "switch-spring",
    name: "SwitchSpring",
    group: "micro",
    library: "motion",
    caption: "つまみは spring 400/30 か 150ms ease-out。",
    avoid: "damping 20 未満のバウンスは製品 UI に入れない。",
    controls: [stiffnessControl, dampingControl, durationControl("duration (右)", 600), easingControl("easing", "easing (右)")],
    initial: { stiffness: SPRING.snappy.stiffness, damping: SPRING.snappy.damping, duration: DURATION.fast, easing: "ease-out" },
    render: (s) => <SwitchSpring stiffness={num(s, "stiffness", SPRING.snappy.stiffness)} damping={num(s, "damping", SPRING.snappy.damping)} duration={num(s, "duration", DURATION.fast)} easing={str(s, "easing", "ease-out")} />,
    code: (s) => `// left thumb
<motion.span animate={{ x: on ? 20 : 0 }} transition={{ ${springCode(num(s, "stiffness", SPRING.snappy.stiffness), num(s, "damping", SPRING.snappy.damping))} }} />
// right thumb
<motion.span animate={{ x: on ? 20 : 0 }} transition={{ ${tweenCode(num(s, "duration", DURATION.fast), str(s, "easing", "ease-out"))} }} />`,
    links: [LINKS.transition],
  },
  {
    id: "like-burst",
    name: "LikeBurst",
    group: "micro",
    library: "motion",
    caption: "いいねなど、1 回きりの祝福に。",
    avoid: "毎回の操作や保存ボタンには使わない。",
    controls: [{ type: "range", key: "particles", label: "粒", min: 4, max: 16, step: 1 }, { type: "range", key: "distance", label: "距離", min: 12, max: 64, step: 2, unit: "px" }, durationControl("duration", 1000)],
    initial: { particles: 8, distance: 28, duration: DURATION.slow },
    render: (s) => <LikeBurst particles={num(s, "particles", 8)} distance={num(s, "distance", 28)} duration={num(s, "duration", DURATION.slow)} />,
    code: (s) => `{Array.from({ length: ${num(s, "particles", 8)} }, (_, i) => {
  const a = (i / ${num(s, "particles", 8)}) * Math.PI * 2;
  return <motion.span key={i} initial={{ x: 0, y: 0, opacity: 1 }}
    animate={{ x: Math.cos(a) * ${num(s, "distance", 28)}, y: Math.sin(a) * ${num(s, "distance", 28)}, opacity: 0, scale: 0.4 }}
    transition={{ ${tweenCode(num(s, "duration", DURATION.slow), "ease-out")} }} />;
})}`,
    links: [LINKS.animation],
  },
  {
    id: "copy-confirm",
    name: "CopyConfirm",
    group: "micro",
    library: "motion",
    caption: "コピー完了はアイコンの入れ替えで伝える。",
    avoid: "トーストを出すほどではない。",
    controls: [{ type: "select", key: "style", label: "入れ替え", options: ["scale", "crossfade", "slide"] }, durationControl("duration", 600), { type: "range", key: "hold", label: "保持", min: 500, max: 4000, step: 100, unit: "ms" }],
    initial: { style: "scale", duration: DURATION.fast, hold: 1500 },
    render: (s) => <CopyConfirm style={str(s, "style", "scale") as "scale" | "crossfade" | "slide"} duration={num(s, "duration", DURATION.fast)} hold={num(s, "hold", 1500)} />,
    code: (s) => {
      const st = str(s, "style", "scale");
      const hidden = st === "crossfade" ? "{ opacity: 0 }" : st === "scale" ? "{ opacity: 0, scale: 0.98 }" : "{ opacity: 0, y: 4 }";
      return `<AnimatePresence initial={false} mode="popLayout">
  {copied
    ? <motion.span key="check" initial={${hidden}} animate={{ opacity: 1, scale: 1, y: 0 }} exit={${hidden}} transition={{ ${tweenCode(num(s, "duration", DURATION.fast), "ease-out")} }}><Check /></motion.span>
    : <motion.span key="copy" ...><Copy /></motion.span>}
</AnimatePresence>
// revert after ${num(s, "hold", 1500)}ms`;
    },
    links: [LINKS.presence],
  },
  {
    id: "skeleton-to-content",
    name: "SkeletonToContent",
    group: "micro",
    library: "motion",
    caption: "骸骨と本物を重ねて opacity で切り替える。",
    avoid: "高さが変わる骸骨は作らない。",
    controls: [durationControl("duration", 600), travelControl(16), { type: "range", key: "loadTime", label: "読み込み", min: 300, max: 3000, step: 100, unit: "ms" }],
    initial: { duration: DURATION.base, travel: 4, loadTime: 1200 },
    render: (s) => <SkeletonToContent duration={num(s, "duration", DURATION.base)} travel={num(s, "travel", 4)} loadTime={num(s, "loadTime", 1200)} />,
    code: (s) => `<div className="relative">
  <AnimatePresence>{loading && <motion.div key="skeleton" exit={{ opacity: 0 }} transition={{ duration: ${(num(s, "duration", DURATION.base) * 0.65) / 1000} }} className="absolute inset-0">…</motion.div>}</AnimatePresence>
  <motion.div animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: ${num(s, "travel", 4)} }} transition={{ ${tweenCode(num(s, "duration", DURATION.base), "ease-out")} }}>…</motion.div>
</div>`,
    links: [LINKS.presence],
  },
  {
    id: "toast-enter",
    name: "ToastEnter",
    group: "micro",
    library: "motion",
    caption: "入りは 200ms 8px、出は 130ms opacity だけ。",
    avoid: "出を入りより長くしない。",
    controls: [durationControl("enter", 600, "enter"), durationControl("exit", 600, "exit"), travelControl(32), { type: "range", key: "autoDismiss", label: "自動で消す", min: 1000, max: 6000, step: 500, unit: "ms" }],
    initial: { enter: DURATION.base, exit: 130, travel: 8, autoDismiss: 2500 },
    render: (s) => <ToastEnter enter={num(s, "enter", DURATION.base)} exit={num(s, "exit", 130)} travel={num(s, "travel", 8)} autoDismiss={num(s, "autoDismiss", 2500)} />,
    code: (s) => `<AnimatePresence initial={false}>
  {toasts.map((t) => (
    <motion.div key={t.id} layout role="status"
      initial={{ opacity: 0, y: ${num(s, "travel", 8)} }}
      animate={{ opacity: 1, y: 0, transition: { ${tweenCode(num(s, "enter", DURATION.base), "ease-out")} } }}
      exit={{ opacity: 0, transition: { ${tweenCode(num(s, "exit", 130), "ease-in")} } }} />
  ))}
</AnimatePresence>`,
    links: [LINKS.presence],
    paneClassName: "min-h-72",
  },
  {
    id: "tooltip-enter",
    name: "TooltipEnter",
    group: "micro",
    library: "css",
    caption: "ツールチップは 4px だけ寄ってくる。100ms。",
    avoid: "24px 以上は飛んでくる。",
    controls: [travelControl(24), durationControl("duration", 400), easingControl(), { type: "select", key: "placement", label: "位置", options: ["top", "bottom"] }, { type: "toggle", key: "pinned", label: "固定表示" }],
    initial: { travel: 4, duration: DURATION.instant, easing: "ease-out", placement: "top", pinned: false },
    render: (s) => <TooltipEnter travel={num(s, "travel", 4)} duration={num(s, "duration", DURATION.instant)} easing={str(s, "easing", "ease-out")} placement={str(s, "placement", "top") as "top" | "bottom"} pinned={bool(s, "pinned", false)} />,
    code: (s) => `.tooltip { opacity: 0; transform: translate(-50%, ${num(s, "travel", 4) * (str(s, "placement", "top") === "top" ? 1 : -1)}px);
  transition: opacity ${cssDuration(num(s, "duration", DURATION.instant))} var(--ds-ease-out), transform ${cssDuration(num(s, "duration", DURATION.instant))} ${cssEase(str(s, "easing", "ease-out"))}; }
.anchor:hover .tooltip, .anchor:focus-visible .tooltip { opacity: 1; transform: translate(-50%, 0); }`,
    links: [LINKS.mdnTransition],
    paneClassName: "min-h-40",
  },
];

const layoutDemos: DemoEntry[] = [
  {
    id: "shared-layout-tabs",
    name: "SharedLayoutTabs",
    group: "layout",
    library: "motion",
    caption: "タブの下線は 1 つの要素を layoutId で動かす。",
    avoid: "各タブに別々の下線を置かない。",
    controls: [{ type: "select", key: "indicator", label: "indicator", options: ["underline", "pill"] }, ...springOrTween],
    initial: { indicator: "underline", mode: "spring", stiffness: SPRING.gentle.stiffness, damping: SPRING.gentle.damping, duration: DURATION.fast, easing: "ease-out" },
    render: (s) => <SharedLayoutTabs indicator={str(s, "indicator", "underline") as "underline" | "pill"} mode={str(s, "mode", "spring") as "spring" | "tween"} stiffness={num(s, "stiffness", SPRING.gentle.stiffness)} damping={num(s, "damping", SPRING.gentle.damping)} duration={num(s, "duration", DURATION.fast)} easing={str(s, "easing", "ease-out")} />,
    code: (s) => `{selected && <motion.span layoutId="${str(s, "indicator", "underline") === "underline" ? "tab-underline" : "tab-pill"}" transition={{ ${str(s, "mode", "spring") === "spring" ? springCode(num(s, "stiffness", SPRING.gentle.stiffness), num(s, "damping", SPRING.gentle.damping)) : tweenCode(num(s, "duration", DURATION.fast), str(s, "easing", "ease-out"))} }} />}`,
    links: [LINKS.layout],
  },
  {
    id: "accordion-height",
    name: "AccordionHeight",
    group: "layout",
    library: "motion",
    caption: "開閉は height: auto を Motion に測らせる。",
    avoid: "max-height の固定値で誤魔化さない。",
    controls: [durationControl("duration", 800), easingControl(), { type: "toggle", key: "multiple", label: "複数開く" }, { type: "toggle", key: "fadeContent", label: "中身をフェード" }],
    initial: { duration: DURATION.base, easing: "ease-out", multiple: false, fadeContent: true },
    render: (s) => <AccordionHeight duration={num(s, "duration", DURATION.base)} easing={str(s, "easing", "ease-out")} multiple={bool(s, "multiple", false)} fadeContent={bool(s, "fadeContent", true)} />,
    code: (s) => `<AnimatePresence initial={false}>
  {open && (
    <motion.div initial={{ height: 0${bool(s, "fadeContent", true) ? ", opacity: 0" : ""} }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0${bool(s, "fadeContent", true) ? ", opacity: 0" : ""} }}
      transition={{ ${tweenCode(num(s, "duration", DURATION.base), str(s, "easing", "ease-out"))} }} className="overflow-hidden">…</motion.div>
  )}
</AnimatePresence>`,
    links: [LINKS.presence, LINKS.animation],
  },
  {
    id: "reorder-list",
    name: "ReorderList",
    group: "layout",
    library: "motion",
    caption: "並べ替えは spring 170/26。他の項目が滑る。",
    avoid: "ドラッグ中の拡大は 1.02 まで。",
    controls: [stiffnessControl, dampingControl, { type: "range", key: "dragScale", label: "drag scale", min: 1, max: 1.1, step: 0.01 }, { type: "select", key: "axis", label: "axis", options: ["y", "x"] }],
    initial: { stiffness: SPRING.gentle.stiffness, damping: SPRING.gentle.damping, dragScale: 1.02, axis: "y" },
    render: (s) => <ReorderList stiffness={num(s, "stiffness", SPRING.gentle.stiffness)} damping={num(s, "damping", SPRING.gentle.damping)} dragScale={num(s, "dragScale", 1.02)} axis={str(s, "axis", "y") as "x" | "y"} />,
    code: (s) => `<Reorder.Group axis="${str(s, "axis", "y")}" values={items} onReorder={setItems}>
  {items.map((item) => (
    <Reorder.Item key={item} value={item} transition={{ ${springCode(num(s, "stiffness", SPRING.gentle.stiffness), num(s, "damping", SPRING.gentle.damping))} }} whileDrag={{ scale: ${num(s, "dragScale", 1.02)} }}>{item}</Reorder.Item>
  ))}
</Reorder.Group>`,
    links: [LINKS.reorder],
  },
  {
    id: "card-expand",
    name: "CardExpand",
    group: "layout",
    library: "motion",
    caption: "カードがそのまま詳細になる。layoutId を共有。",
    avoid: "全画面モーダルには使わない。距離が長い。",
    controls: [{ type: "toggle", key: "backdrop", label: "backdrop" }, ...springOrTween],
    initial: { backdrop: true, mode: "spring", stiffness: SPRING.gentle.stiffness, damping: SPRING.gentle.damping, duration: DURATION.slow, easing: "ease-out" },
    render: (s) => <CardExpand backdrop={bool(s, "backdrop", true)} mode={str(s, "mode", "spring") as "spring" | "tween"} stiffness={num(s, "stiffness", SPRING.gentle.stiffness)} damping={num(s, "damping", SPRING.gentle.damping)} duration={num(s, "duration", DURATION.slow)} easing={str(s, "easing", "ease-out")} />,
    code: (s) => {
      const t = str(s, "mode", "spring") === "spring" ? springCode(num(s, "stiffness", SPRING.gentle.stiffness), num(s, "damping", SPRING.gentle.damping)) : tweenCode(num(s, "duration", DURATION.slow), str(s, "easing", "ease-out"));
      return `<motion.button layoutId={\`card-\${id}\`} transition={{ ${t} }} onClick={open} />
<AnimatePresence>
  {selected && <motion.div role="dialog" layoutId={\`card-\${selected}\`} transition={{ ${t} }}>…</motion.div>}
</AnimatePresence>`;
    },
    links: [LINKS.layout],
    paneClassName: "min-h-80",
  },
  {
    id: "list-add-remove",
    name: "ListAddRemove",
    group: "layout",
    library: "motion",
    caption: "追加は 200ms 8px、削除は 150ms opacity のみ。",
    avoid: "削除で要素を飛ばさない。",
    controls: [durationControl("enter", 600, "enter"), durationControl("exit", 600, "exit"), travelControl(32), { type: "toggle", key: "exitTravel", label: "出も移動" }],
    initial: { enter: DURATION.base, exit: DURATION.fast, travel: 8, exitTravel: false },
    render: (s) => <ListAddRemove enter={num(s, "enter", DURATION.base)} exit={num(s, "exit", DURATION.fast)} travel={num(s, "travel", 8)} exitTravel={bool(s, "exitTravel", false)} />,
    code: (s) => `<AnimatePresence initial={false}>
  {items.map((id) => (
    <motion.li key={id} layout
      initial={{ opacity: 0, y: ${num(s, "travel", 8)} }}
      animate={{ opacity: 1, y: 0, transition: { ${tweenCode(num(s, "enter", DURATION.base), "ease-out")} } }}
      exit={{ opacity: 0${bool(s, "exitTravel", false) ? `, y: ${-num(s, "travel", 8) / 2}` : ""}, transition: { ${tweenCode(num(s, "exit", DURATION.fast), "ease-in")} } }} />
  ))}
</AnimatePresence>`,
    links: [LINKS.presence],
  },
  {
    id: "stagger-grid",
    name: "StaggerGrid",
    group: "layout",
    library: "motion",
    caption: "タイルは 30ms 間隔、最後が 200ms 以内に始まる。",
    avoid: "9 枚を超えるなら stagger を切る。",
    controls: [{ type: "range", key: "count", label: "枚数", min: 3, max: 12, step: 1 }, { type: "range", key: "stagger", label: "stagger", min: 0, max: 120, step: 5, unit: "ms" }, durationControl(), travelControl(), easingControl(), { type: "toggle", key: "once", label: "1 回だけ" }],
    initial: { count: 6, stagger: 30, duration: DURATION.base, travel: 8, easing: "ease-out", once: true },
    render: (s) => <StaggerGrid count={num(s, "count", 6)} stagger={num(s, "stagger", 30)} duration={num(s, "duration", DURATION.base)} travel={num(s, "travel", 8)} easing={str(s, "easing", "ease-out")} once={bool(s, "once", true)} />,
    code: (s) => `<motion.ul initial="hidden" whileInView="show" viewport={{ once: ${bool(s, "once", true)}, amount: 0.4 }}
  variants={{ show: { transition: { staggerChildren: ${num(s, "stagger", 30) / 1000} } } }}>
  {tiles.map((t) => (
    <motion.li key={t} variants={{ hidden: { opacity: 0, y: ${num(s, "travel", 8)} }, show: { opacity: 1, y: 0, transition: { ${tweenCode(num(s, "duration", DURATION.base), str(s, "easing", "ease-out"))} } } }} />
  ))}
</motion.ul>`,
    links: [LINKS.scroll, LINKS.animation],
  },
  {
    id: "theme-crossfade",
    name: "ThemeCrossfade",
    group: "layout",
    library: "motion",
    caption: "テーマ切替は 2 枚重ねて opacity だけ動かす。",
    avoid: "全要素の color を transition しない。途中が濁る。",
    controls: [{ type: "select", key: "mode", label: "方式", options: ["crossfade", "colors", "none"] }, durationControl("duration", 1000), easingControl()],
    initial: { mode: "crossfade", duration: DURATION.base, easing: "ease-out" },
    render: (s) => <ThemeCrossfade mode={str(s, "mode", "crossfade") as "crossfade" | "colors" | "none"} duration={num(s, "duration", DURATION.base)} easing={str(s, "easing", "ease-out")} />,
    code: (s) =>
      str(s, "mode", "crossfade") === "crossfade"
        ? `<div data-theme={previous} className="absolute inset-0"><App /></div>
<motion.div key={theme} data-theme={theme} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ${tweenCode(num(s, "duration", DURATION.base), str(s, "easing", "ease-out"))} }} className="absolute inset-0"><App /></motion.div>`
        : str(s, "mode", "crossfade") === "colors"
          ? `/* what most sites do; text goes muddy mid-way */
* { transition: background-color ${cssDuration(num(s, "duration", DURATION.base))} ${cssEase(str(s, "easing", "ease-out"))}, color ${cssDuration(num(s, "duration", DURATION.base))} ${cssEase(str(s, "easing", "ease-out"))}; }`
          : `document.documentElement.dataset.theme = theme; // no transition`,
    links: [LINKS.animation, LINKS.mdnReduced],
    paneClassName: "min-h-80",
  },
];

const scroll: DemoEntry[] = [
  {
    id: "scroll-progress-bar",
    name: "ScrollProgressBar",
    group: "scroll",
    library: "motion",
    caption: "読了バー。scaleX を motion value で直接書く。",
    avoid: "scroll イベントを React state に入れない。",
    controls: [{ type: "toggle", key: "smooth", label: "spring で滑らか" }, stiffnessControl, dampingControl, { type: "range", key: "thickness", label: "太さ", min: 1, max: 6, step: 1, unit: "px" }, { type: "select", key: "position", label: "位置", options: ["top", "bottom"] }],
    initial: { smooth: false, stiffness: SPRING.snappy.stiffness, damping: SPRING.snappy.damping, thickness: 2, position: "top" },
    render: (s) => <ScrollProgressBar smooth={bool(s, "smooth", false)} stiffness={num(s, "stiffness", SPRING.snappy.stiffness)} damping={num(s, "damping", SPRING.snappy.damping)} thickness={num(s, "thickness", 2)} position={str(s, "position", "top") as "top" | "bottom"} />,
    code: (s) => `const { scrollYProgress } = useScroll({ container });
${bool(s, "smooth", false) ? `const scaleX = useSpring(scrollYProgress, { ${springCode(num(s, "stiffness", SPRING.snappy.stiffness), num(s, "damping", SPRING.snappy.damping))} });` : "const scaleX = scrollYProgress;"}
<motion.div style={{ scaleX, height: ${num(s, "thickness", 2)} }} className="origin-left bg-accent" />`,
    links: [LINKS.scroll],
    paneClassName: "min-h-80",
  },
  {
    id: "sticky-stack",
    name: "StickyStack",
    group: "scroll",
    library: "gsap",
    caption: "手順の説明など、ピン留めして 1 枚ずつ見せる。",
    avoid: "情報ページには使わない。読む速度を奪う。",
    controls: [{ type: "range", key: "count", label: "枚数", min: 2, max: 5, step: 1 }, { type: "range", key: "scrub", label: "scrub", min: 0, max: 2, step: 0.1, unit: "s" }, { type: "range", key: "dim", label: "奥の opacity", min: 0.2, max: 1, step: 0.1 }, { type: "range", key: "shrink", label: "奥の scale", min: 0.8, max: 1, step: 0.01 }],
    initial: { count: 3, scrub: 0.4, dim: 0.5, shrink: 0.96 },
    render: (s) => <LazyStickyStack count={num(s, "count", 3)} scrub={num(s, "scrub", 0.4)} dim={num(s, "dim", 0.5)} shrink={num(s, "shrink", 0.96)} />,
    code: (s) => `const ctx = gsap.context(() => {
  const tl = gsap.timeline({ scrollTrigger: { scroller, trigger, start: "top top", end: "+=${num(s, "count", 3) * 240}", pin: true, scrub: ${num(s, "scrub", 0.4)} } });
  cards.forEach((card, i) => {
    if (i === 0) return;
    tl.to(cards[i - 1], { scale: ${num(s, "shrink", 0.96)}, opacity: ${num(s, "dim", 0.5)}, duration: 1 }, i - 1);
    tl.to(card, { yPercent: 0, opacity: 1, duration: 1 }, i - 1);
  });
}, root);
return () => ctx.revert();`,
    links: [LINKS.scrollTrigger, LINKS.gsapContext],
    paneClassName: "min-h-96",
    heavy: true,
  },
  {
    id: "horizontal-pan",
    name: "HorizontalPan",
    group: "scroll",
    library: "gsap",
    caption: "縦スクロールで横に流す。ギャラリーや年表に。",
    avoid: "本文の途中に置かない。",
    controls: [{ type: "range", key: "panels", label: "パネル", min: 3, max: 6, step: 1 }, { type: "range", key: "scrub", label: "scrub", min: 0, max: 2, step: 0.1, unit: "s" }, { type: "toggle", key: "snap", label: "スナップ" }],
    initial: { panels: 4, scrub: 0.4, snap: false },
    render: (s) => <LazyHorizontalPan panels={num(s, "panels", 4)} scrub={num(s, "scrub", 0.4)} snap={bool(s, "snap", false)} />,
    code: (s) => `gsap.to(track, {
  x: () => -(track.scrollWidth - stage.clientWidth), ease: "none",
  scrollTrigger: { scroller, trigger: stage, start: "top top", end: () => "+=" + (track.scrollWidth - stage.clientWidth), pin: true, scrub: ${num(s, "scrub", 0.4)}${bool(s, "snap", false) ? `, snap: 1 / ${num(s, "panels", 4) - 1}` : ""}, invalidateOnRefresh: true },
});`,
    links: [LINKS.scrollTrigger],
    paneClassName: "min-h-96",
    heavy: true,
  },
  {
    id: "parallax",
    name: "Parallax",
    group: "scroll",
    library: "motion",
    caption: "背景の図形を少し遅らせる。useTransform で。",
    avoid: "テキストに視差を付けない。",
    controls: [{ type: "range", key: "depth", label: "depth", min: 0, max: 1, step: 0.1 }, { type: "range", key: "layers", label: "層", min: 1, max: 5, step: 1 }, { type: "toggle", key: "smooth", label: "spring で滑らか" }],
    initial: { depth: 0.6, layers: 3, smooth: false },
    render: (s) => <Parallax depth={num(s, "depth", 0.6)} layers={num(s, "layers", 3)} smooth={bool(s, "smooth", false)} />,
    code: (s) => `const { scrollYProgress } = useScroll({ container });
${bool(s, "smooth", false) ? `const progress = useSpring(scrollYProgress, { ${springCode(SPRING.gentle.stiffness, SPRING.gentle.damping)} });` : "const progress = scrollYProgress;"}
const y = useTransform(progress, [0, 1], [0, -160 * (1 - ${num(s, "depth", 0.6)})]); // back layer
<motion.div style={{ y }} />`,
    links: [LINKS.scroll],
    paneClassName: "min-h-80",
  },
  {
    id: "reveal-on-scroll",
    name: "RevealOnScroll",
    group: "scroll",
    library: "motion",
    caption: "画面に入ったら 8px 浮かせる。1 回だけ。",
    avoid: "スクロールのたびに繰り返さない。",
    controls: [travelControl(32), durationControl("duration", 800), { type: "range", key: "amount", label: "見えた割合", min: 0, max: 1, step: 0.1 }, { type: "toggle", key: "once", label: "1 回だけ" }, easingControl()],
    initial: { travel: 8, duration: DURATION.base, amount: 0.4, once: true, easing: "ease-out" },
    render: (s) => <RevealOnScroll travel={num(s, "travel", 8)} duration={num(s, "duration", DURATION.base)} amount={num(s, "amount", 0.4)} once={bool(s, "once", true)} easing={str(s, "easing", "ease-out")} />,
    code: (s) => `<motion.div initial={{ opacity: 0, y: ${num(s, "travel", 8)} }} whileInView={{ opacity: 1, y: 0 }}
  viewport={{ root: container, once: ${bool(s, "once", true)}, amount: ${num(s, "amount", 0.4)} }}
  transition={{ ${tweenCode(num(s, "duration", DURATION.base), str(s, "easing", "ease-out"))} }} />`,
    links: [LINKS.scroll],
    paneClassName: "min-h-80",
  },
  {
    id: "scroll-driven-css",
    name: "ScrollDrivenCSS",
    group: "scroll",
    library: "css",
    caption: "対応環境なら CSS だけ。JS はフレームごとに動かない。",
    avoid: "Safari の非対応を想定してフォールバックを用意する。",
    controls: [{ type: "select", key: "variant", label: "timeline", options: ["scroll", "view"] }, travelControl(32), { type: "range", key: "rangeEnd", label: "entry の終わり", min: 25, max: 100, step: 25, unit: "%" }],
    initial: { variant: "scroll", travel: 8, rangeEnd: 100 },
    render: (s) => <ScrollDrivenCSS variant={str(s, "variant", "scroll") as "scroll" | "view"} travel={num(s, "travel", 8)} rangeEnd={num(s, "rangeEnd", 100)} />,
    code: (s) =>
      str(s, "variant", "scroll") === "scroll"
        ? `.scroller { scroll-timeline-name: --scroller; }
.bar { transform-origin: 0 50%; animation: grow linear both; animation-timeline: --scroller; }
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }`
        : `.card { animation: enter linear both; animation-timeline: view(); animation-range: entry 0% entry ${num(s, "rangeEnd", 100)}%; }
@keyframes enter { from { opacity: 0; transform: translateY(${num(s, "travel", 8)}px); } }
@media (prefers-reduced-motion: reduce) { .card { animation: none; } }`,
    links: [LINKS.mdnTimeline, { label: "Chrome: scroll-driven animations", href: "https://developer.chrome.com/docs/css-ui/scroll-driven-animations" }],
    paneClassName: "min-h-80",
  },
];

const three: DemoEntry[] = [
  {
    id: "icosahedron-scene",
    name: "IcosahedronScene",
    group: "3d",
    library: "three",
    caption: "製品が 3D のときだけ。色はトークンから。",
    avoid: "文章ページの背景にしない。",
    controls: [{ type: "range", key: "speed", label: "回転", min: 0, max: 2, step: 0.1, unit: " rad/s" }, { type: "range", key: "detail", label: "分割", min: 0, max: 2, step: 1 }, { type: "toggle", key: "wireframe", label: "wireframe" }],
    initial: { speed: 0.4, detail: 0, wireframe: false },
    render: (s) => <LazyIcosahedron speed={num(s, "speed", 0.4)} detail={num(s, "detail", 0)} wireframe={bool(s, "wireframe", false)} />,
    code: (s) => `const accent = getComputedStyle(document.documentElement).getPropertyValue("--ds-accent");
<Canvas frameloop={visible && !reduced ? "always" : "demand"}>
  <mesh ref={ref}> {/* useFrame: rotation.y += delta * ${num(s, "speed", 0.4)} */}
    <icosahedronGeometry args={[1.4, ${num(s, "detail", 0)}]} />
    <meshStandardMaterial color={accent} flatShading${bool(s, "wireframe", false) ? " wireframe" : ""} />
  </mesh>
</Canvas>`,
    links: [LINKS.r3fCanvas, LINKS.r3f],
    heavy: true,
  },
  {
    id: "particle-field",
    name: "ParticleField",
    group: "3d",
    library: "three",
    caption: "ヒーローの奥行きに。ゆっくり漂い、ポインタに寄る。",
    avoid: "テキストの上に置かない。読めない。",
    controls: [{ type: "range", key: "count", label: "粒", min: 200, max: 2000, step: 100 }, { type: "range", key: "drift", label: "漂い", min: 0, max: 1, step: 0.1 }, { type: "range", key: "parallax", label: "視差", min: 0, max: 1, step: 0.1 }, { type: "range", key: "size", label: "size", min: 0.01, max: 0.1, step: 0.005 }],
    initial: { count: 800, drift: 0.5, parallax: 0.5, size: 0.035 },
    render: (s) => <LazyParticleField count={num(s, "count", 800)} drift={num(s, "drift", 0.5)} parallax={num(s, "parallax", 0.5)} size={num(s, "size", 0.035)} />,
    code: (s) => `<points ref={points}>
  <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions /* ${num(s, "count", 800)} × 3 */, 3]} /></bufferGeometry>
  <pointsMaterial color={accent} size={${num(s, "size", 0.035)}} sizeAttenuation transparent />
</points>
// useFrame: points.rotation.y += delta * 0.05 * ${num(s, "drift", 0.5)}; group.rotation lerps toward pointer × ${num(s, "parallax", 0.5)}`,
    links: [LINKS.threePoints, LINKS.r3f],
    heavy: true,
  },
  {
    id: "wireframe-torus",
    name: "WireframeTorus",
    group: "3d",
    library: "three",
    caption: "マウスに傾く線画。ink 1 色で。",
    avoid: "reduced motion では傾けない。",
    controls: [{ type: "range", key: "tilt", label: "傾き", min: 0, max: 1, step: 0.1 }, { type: "range", key: "damping", label: "追従", min: 1, max: 20, step: 1 }, { type: "range", key: "segments", label: "分割", min: 8, max: 48, step: 4 }, { type: "toggle", key: "spin", label: "自転" }],
    initial: { tilt: 0.6, damping: 6, segments: 16, spin: false },
    render: (s) => <LazyWireframeTorus tilt={num(s, "tilt", 0.6)} damping={num(s, "damping", 6)} segments={num(s, "segments", 16)} spin={bool(s, "spin", false)} />,
    code: (s) => `useFrame((state, delta) => {
  const k = Math.min(1, delta * ${num(s, "damping", 6)});
  mesh.rotation.x += (-state.pointer.y * 0.6 * ${num(s, "tilt", 0.6)} - mesh.rotation.x) * k;
  mesh.rotation.y += (state.pointer.x * 0.6 * ${num(s, "tilt", 0.6)} - mesh.rotation.y) * k;${bool(s, "spin", false) ? "\n  mesh.rotation.z += delta * 0.2;" : ""}
});
<torusKnotGeometry args={[1, 0.32, ${num(s, "segments", 16) * 4}, ${num(s, "segments", 16)}]} />
<meshBasicMaterial color={ink} wireframe />`,
    links: [LINKS.threeTorus, LINKS.r3f],
    heavy: true,
  },
];

const lottie: DemoEntry[] = [
  {
    id: "lottie-progress",
    name: "LottieProgress",
    group: "lottie",
    library: "lottie",
    caption: "完了の演出。リングが満ち、チェックが描かれる。",
    avoid: "ループさせない。完了は 1 回。",
    controls: [{ type: "range", key: "frames", label: "長さ", min: 30, max: 180, step: 6, unit: " f" }, { type: "range", key: "stroke", label: "線", min: 2, max: 8, step: 1, unit: "px" }, { type: "toggle", key: "loop", label: "loop" }],
    initial: { frames: 60, stroke: 4, loop: false },
    render: (s) => <LazyLottieProgress frames={num(s, "frames", 60)} stroke={num(s, "stroke", 4)} loop={bool(s, "loop", false)} />,
    code: (s) => `// trim path "e" 0 → 100 draws the stroke; colors from --ds-success / --ds-hairline at runtime
{ ty: "tm", s: { a: 0, k: 0 }, e: { a: 1, k: [{ t: ${Math.round(num(s, "frames", 60) * 0.6)}, s: [0], o: { x: [0.3], y: [0] }, i: { x: [0.16], y: [1] } }, { t: ${num(s, "frames", 60)}, s: [100] }] } }
<DotLottieReact data={json} autoplay={!reduced} loop={${bool(s, "loop", false)}} />`,
    links: [LINKS.lottieReact, LINKS.lottieFormat],
    heavy: true,
  },
  {
    id: "lottie-dots",
    name: "LottieDots",
    group: "lottie",
    library: "lottie",
    caption: "読み込み中の点。ループが許される唯一の用途。",
    avoid: "3 秒を超える待ちには進捗バーを。",
    controls: [{ type: "range", key: "dots", label: "点", min: 3, max: 5, step: 1 }, { type: "range", key: "speed", label: "speed", min: 0.25, max: 3, step: 0.25, unit: "×" }, { type: "toggle", key: "bounce", label: "4px 上下" }],
    initial: { dots: 3, speed: 1, bounce: false },
    render: (s) => <LazyLottieDots dots={num(s, "dots", 3)} speed={num(s, "speed", 1)} bounce={bool(s, "bounce", false)} />,
    code: (s) => `// ${num(s, "dots", 3)} layers, opacity 30 → 100 offset by frames / ${num(s, "dots", 3)}${bool(s, "bounce", false) ? "; position y 22 → 18" : ""}; fill from --ds-ink
<DotLottieReact data={json} loop={!reduced} autoplay={!reduced} speed={${num(s, "speed", 1)}} />`,
    links: [LINKS.lottieReact, LINKS.lottieFormat],
    heavy: true,
  },
];

const css: DemoEntry[] = [
  {
    id: "keyframe-spinner",
    name: "KeyframeSpinner",
    group: "css",
    library: "css",
    caption: "スピナーは linear。等速が意味。",
    avoid: "スピナー以外に linear を使わない。",
    controls: [{ type: "range", key: "seconds", label: "1 周", min: 0.4, max: 3, step: 0.1, unit: "s" }, { type: "range", key: "stroke", label: "線", min: 1, max: 4, step: 1, unit: "px" }, { type: "select", key: "style", label: "形", options: ["ring", "dots"] }, { type: "toggle", key: "paused", label: "停止" }],
    initial: { seconds: 0.8, stroke: 2, style: "ring", paused: false },
    render: (s) => <KeyframeSpinner seconds={num(s, "seconds", 0.8)} stroke={num(s, "stroke", 2)} style={str(s, "style", "ring") as "ring" | "dots"} paused={bool(s, "paused", false)} />,
    code: (s) =>
      str(s, "style", "ring") === "ring"
        ? `.spinner { width: 32px; height: 32px; border-radius: 50%; border: ${num(s, "stroke", 2)}px solid var(--ds-hairline); border-top-color: var(--ds-ink);
  animation: spin ${num(s, "seconds", 0.8)}s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .spinner { animation: none; } }`
        : `.dot { animation: pulse ${num(s, "seconds", 0.8)}s var(--ds-ease-in-out) infinite; }
.dot:nth-child(2) { animation-delay: ${(num(s, "seconds", 0.8) / 3).toFixed(2)}s; }
.dot:nth-child(3) { animation-delay: ${((num(s, "seconds", 0.8) * 2) / 3).toFixed(2)}s; }
@keyframes pulse { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }`,
    links: [LINKS.mdnKeyframes, LINKS.mdnReduced],
  },
  {
    id: "css-transition-compare",
    name: "CSSTransitionCompare",
    group: "css",
    library: "css",
    caption: "同じ 200ms で ease-out、ease、linear を並べる。",
    avoid: "ease は選んでいない印。linear は機械的。",
    controls: [durationControl("duration", 1500), { type: "range", key: "distance", label: "距離", min: 40, max: 240, step: 10, unit: "px" }, { type: "select", key: "property", label: "property", options: ["transform", "opacity"] }],
    initial: { duration: DURATION.base, distance: 160, property: "transform" },
    render: (s) => <CSSTransitionCompare duration={num(s, "duration", DURATION.base)} distance={num(s, "distance", 160)} property={str(s, "property", "transform") as "transform" | "opacity"} />,
    code: (s) => `.a { transition: ${str(s, "property", "transform")} ${cssDuration(num(s, "duration", DURATION.base))} var(--ds-ease-out); }  /* cubic-bezier(0.16, 1, 0.3, 1) */
.b { transition: ${str(s, "property", "transform")} ${cssDuration(num(s, "duration", DURATION.base))} ease; }              /* CSS default, symmetric */
.c { transition: ${str(s, "property", "transform")} ${cssDuration(num(s, "duration", DURATION.base))} linear; }
.end { ${str(s, "property", "transform") === "transform" ? `transform: translateX(${num(s, "distance", 160)}px);` : "opacity: 1;"} }`,
    links: [LINKS.mdnTransition, { label: "Emil Kowalski: great animations", href: "https://emilkowal.ski/ui/great-animations" }],
  },
  {
    id: "clip-path-reveal",
    name: "ClipPathReveal",
    group: "css",
    library: "css",
    caption: "画像やヒーローの 1 回きりの登場に。CSS だけ。",
    avoid: "リスト項目ごとには使わない。",
    controls: [{ type: "select", key: "direction", label: "方向", options: ["left", "top", "circle"] }, durationControl("duration", 1500), easingControl()],
    initial: { direction: "left", duration: DURATION.slow, easing: "ease-out" },
    render: (s) => <ClipPathReveal direction={str(s, "direction", "left") as "left" | "top" | "circle"} duration={num(s, "duration", DURATION.slow)} easing={str(s, "easing", "ease-out")} />,
    code: (s) => {
      const d = str(s, "direction", "left");
      const from = d === "left" ? "inset(0 100% 0 0)" : d === "top" ? "inset(0 0 100% 0)" : "circle(0% at 50% 50%)";
      const to = d === "circle" ? "circle(75% at 50% 50%)" : "inset(0)";
      return `.hero { clip-path: ${from}; transition: clip-path ${cssDuration(num(s, "duration", DURATION.slow))} ${cssEase(str(s, "easing", "ease-out"))}; }
.hero.shown { clip-path: ${to}; }
@media (prefers-reduced-motion: reduce) { .hero { clip-path: none; transition: opacity ${cssDuration(num(s, "duration", DURATION.slow))} var(--ds-ease-out); } }`;
    },
    links: [LINKS.mdnClip, LINKS.mdnTransition],
  },
];

export const demos: DemoEntry[] = [...text, ...micro, ...layoutDemos, ...scroll, ...three, ...lottie, ...css];

// Unused-import guard for helpers referenced only in some snippets.
void motionEaseCode;
