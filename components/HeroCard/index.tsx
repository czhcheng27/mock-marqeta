"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./index.module.css";

gsap.registerPlugin(ScrollTrigger);

// 第二段结束时，卡片缩到 90%，只在底部露出 28px。
const FINAL_CARD_SCALE = 0.9;
const FINAL_CARD_VISIBLE_PEEK = 28;
const STAGE_ONE_END = {
  x: 421,
  y: 91.5,
  rotateX: 0,
  rotateY: 0,
  rotateZ: -160,
  skewX: 0,
  scale: 0.5,
};
const STAGE_TWO_END = {
  x: 10,
  rotateX: -0.535,
  rotateY: -27.158,
  rotateZ: -139.344,
  skewX: -20.2843,
  scale: FINAL_CARD_SCALE,
};

// 计算第二段结束时的 y：
// 让卡片缩放后停在视口底部之外，只保留 visiblePeek 露在屏幕里。
const getOffscreenPeekY = (
  card: HTMLDivElement,
  scale: number,
  visiblePeek: number,
) => {
  return (
    window.innerHeight - visiblePeek - (card.offsetHeight * (1 - scale)) / 2
  );
};

export default function HeroCard() {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    // 这些变量用于延迟 refresh，并在组件卸载时阻止后续刷新继续执行。
    let isDisposed = false;
    let refreshRafOne = 0;
    let refreshRafTwo = 0;

    // 连续等两帧再 refresh，给首屏布局切换、图片尺寸和字体渲染留出时间。
    const queueRefresh = () => {
      if (isDisposed) return;

      refreshRafOne = window.requestAnimationFrame(() => {
        refreshRafTwo = window.requestAnimationFrame(() => {
          if (!isDisposed) {
            ScrollTrigger.refresh();
          }
        });
      });
    };

    // 初始状态：隐藏
    gsap.set(card, {
      autoAlpha: 0,
    });

    // 1s 后淡入
    const fadeTween = gsap.to(card, {
      autoAlpha: 1,
      duration: 3,
      delay: 3,
      ease: "power2.out",
    });

    const stageOneTween = gsap.fromTo(
      card,
      {
        x: 235,
        y: 215,
        rotateX: -10,
        rotateY: -2,
        rotateZ: 0,
        skewX: -4,
        scale: 1,
      },
      {
        ...STAGE_ONE_END,
        ease: "none",
        scrollTrigger: {
          // 第一段：从页面顶部开始，到 features 标题区域进入视口 10% 为止。
          trigger: "#main",
          start: "top top",
          endTrigger: "#index-features-list-wrapper",
          end: "top 10%",
          scrub: 0.1,
          invalidateOnRefresh: true,
        },
      },
    );

    const stageTwoTween = gsap.fromTo(
      card,
      {
        ...STAGE_ONE_END,
      },
      {
        ...STAGE_TWO_END,
        // 第二段 y 不能写死，要跟随当前视口高度和卡片实际高度重新计算。
        y: () =>
          getOffscreenPeekY(card, FINAL_CARD_SCALE, FINAL_CARD_VISIBLE_PEEK),
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          // 第二段：从 features 标题区域开始，到 overflow 区域底部贴住视口底部结束。
          trigger: "#index-features-list-wrapper",
          start: "top 10%",
          endTrigger: "#overflow-wrapper",
          end: "bottom bottom",
          scrub: 0.1,
          invalidateOnRefresh: true,
        },
      },
    );

    // 首次挂载后主动 refresh 一次，修正 ScrollTrigger 的起止位置。
    queueRefresh();

    // load 和 fonts.ready 都可能改变页面最终高度；再次 refresh 可以避免卡片轨迹跳变。
    window.addEventListener("load", queueRefresh);
    if (document.fonts) {
      void document.fonts.ready.then(() => {
        queueRefresh();
      });
    }

    return () => {
      isDisposed = true;

      // 清理所有延迟 refresh 和 GSAP 实例，避免卸载后继续操作旧 DOM。
      window.cancelAnimationFrame(refreshRafOne);
      window.cancelAnimationFrame(refreshRafTwo);
      window.removeEventListener("load", queueRefresh);
      fadeTween.kill();
      stageOneTween.scrollTrigger?.kill();
      stageOneTween.kill();
      stageTwoTween.scrollTrigger?.kill();
      stageTwoTween.kill();
    };
  }, []);

  return (
    <div className={styles.stage} aria-hidden="true">
      <div className={styles.wrapper}>
        <div className={styles.fakeTitle} />
        <div className={styles.canvasWrapper}>
          <div ref={cardRef} id="hero-card" className={styles.card} />
        </div>
      </div>
    </div>
  );
}
