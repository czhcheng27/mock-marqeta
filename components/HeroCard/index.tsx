"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./index.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function HeroCard() {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    // 初始状态：隐藏
    gsap.set(card, {
      autoAlpha: 0,
    });

    // 1s 后淡入
    gsap.to(card, {
      autoAlpha: 1,
      duration: 3,
      delay: 3,
      ease: "power2.out",
    });

    // 滚动动画
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: "#main",
        start: "top top",
        end: "+=2500",
        scrub: 0.1,
      },
    });

    // 第一阶段
    tl.fromTo(
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
        x: 321,
        y: 91.5,
        rotateX: 0,
        rotateY: 0,
        rotateZ: -160,
        skewX: 0,
        scale: 0.5,
        duration: 0.55,
      },
      0,
    );

    // 第二阶段
    tl.to(card, {
      x: 10,
      y: 674,
      rotateX: -0.535,
      rotateY: -27.158,
      rotateZ: -139.344,
      skewX: -20.2843,
      scale: 0.9,
      duration: 0.45,
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      tl.kill();
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
