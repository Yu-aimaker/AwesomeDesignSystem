import { PageHeader, Section } from "../layout/Page";
import { Preview } from "../layout/Preview";
import { InViewStaggerDemo, PresenceDemo, ReorderDemo, SpringDragDemo } from "../demos/MotionDemos";
import { GsapStack } from "../demos/GsapStack";
import { ThreeScene } from "../demos/ThreeScene";
import { LottieDemo } from "../demos/LottieDemo";
import { ScrollDrivenDemo } from "../demos/ScrollDrivenDemo";

import MotionSrc from "../demos/MotionDemos.tsx?raw";
import GsapSrc from "../demos/GsapStack.tsx?raw";
import ThreeSrc from "../demos/ThreeScene.tsx?raw";
import LottieSrc from "../demos/LottieDemo.tsx?raw";
import ScrollSrc from "../demos/ScrollDrivenDemo.tsx?raw";

export function Animation() {
  return (
    <div>
      <PageHeader title="アニメーション" lead="CSS transition、Motion、GSAP ScrollTrigger、Lottie、three.js。使う順番もこの順です。" />
      <Section id="motion" title="Motion (motion/react)">
        <div className="flex flex-col gap-8">
          <Preview title="layout で並べ替え" rule="ドラッグで順番を変える。他の項目はスプリングで移動。" code={MotionSrc}>
            <ReorderDemo />
          </Preview>
          <Preview title="AnimatePresence" rule="入りは 200ms ease-out、出は 150ms ease-in で opacity のみ。" code={MotionSrc}>
            <PresenceDemo />
          </Preview>
          <Preview title="whileInView + stagger" rule="画面に入ったら 60ms 間隔で 8px 浮かせる。1 回だけ。" code={MotionSrc}>
            <InViewStaggerDemo />
          </Preview>
          <Preview title="スプリングでドラッグ" rule="stiffness 400、damping 30。" code={MotionSrc}>
            <SpringDragDemo />
          </Preview>
        </div>
      </Section>
      <Section id="gsap" title="GSAP ScrollTrigger">
        <Preview title="ピン留めした 3 枚のカード" rule={'start: "top top"、scrub。ピン留めやスクラブが必要なときだけ GSAP を使う。'} code={GsapSrc} className="p-0 sm:p-0">
          <GsapStack />
        </Preview>
      </Section>
      <Section id="three" title="three.js (react-three-fiber)">
        <Preview title="低ポリゴンの多面体" rule="画面外と reduced-motion では描画ループを止める。" code={ThreeSrc}>
          <ThreeScene />
        </Preview>
      </Section>
      <Section id="lottie" title="Lottie (dotLottie)">
        <Preview title="手書きの Lottie JSON" rule="色はトークンから変換。renderer の wasm は同梱。" code={LottieSrc}>
          <LottieDemo />
        </Preview>
      </Section>
      <Section id="scroll" title="CSS scroll-driven animation">
        <Preview title="スクロール進捗バー" rule="animation-timeline: scroll()。非対応環境は JS にフォールバック。" code={ScrollSrc}>
          <ScrollDrivenDemo />
        </Preview>
      </Section>
    </div>
  );
}
