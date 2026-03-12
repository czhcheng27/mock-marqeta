"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FeaturesBg from "./FeaturesBg";
import FeaturesSequencesWrapper from "./FeaturesSequencesWrapper";
import styles from "./index.module.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const OverflowWrapper = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const purpleCardRef = useRef<HTMLDivElement | null>(null);
  const purpleCardSecondaryRef = useRef<HTMLDivElement | null>(null);
  const purpleCardTriggerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const card = purpleCardRef.current;
      const secondaryCardLayer = purpleCardSecondaryRef.current;
      const trigger = purpleCardTriggerRef.current;

      if (!card || !secondaryCardLayer || !trigger) {
        return;
      }

      const media = gsap.matchMedia();

      media.add("(min-width: 768px)", () => {
        const cardTween = gsap.fromTo(
          card,
          {
            transform:
              "translate3d(0vw, 0px, 0px) rotate(59deg) scale(1) skew(0deg, -26deg)",
          },
          {
            transform:
              "translate3d(-69.8761vw, 395.2px, 0px) rotate(94.8999deg) scale(9.97497) skew(0deg, -26deg)",
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top 90%",
              end: "+=320%",
              scrub: 0.1,
              invalidateOnRefresh: true,
            },
          },
        );

        const opacityTween = gsap.fromTo(
          secondaryCardLayer,
          {
            opacity: 0,
          },
          {
            opacity: 0.987105,
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top 90%",
              end: "+=320%",
              scrub: 0.1,
              invalidateOnRefresh: true,
            },
          },
        );

        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
          cardTween.scrollTrigger?.kill();
          cardTween.kill();
          opacityTween.scrollTrigger?.kill();
          opacityTween.kill();
        };
      });

      return () => {
        media.revert();
      };
    },
    { scope: wrapperRef },
  );

  return (
    <div
      ref={wrapperRef}
      id="overflow-wrapper"
      className={styles.overflowWrapper}
    >
      <section className={styles.features}>
        <FeaturesBg />
        <FeaturesSequencesWrapper />
      </section>
      <div className={styles.purpleCard} aria-hidden="true">
        <div ref={purpleCardRef} className={styles.purpleCardCard}>
          <div
            className={`${styles.purpleCardCardItem} ${styles.purpleCardCardItemPrimary}`}
          />
          <div
            ref={purpleCardSecondaryRef}
            className={`${styles.purpleCardCardItem} ${styles.purpleCardCardItemSecondary}`}
          />
        </div>
        <div ref={purpleCardTriggerRef} className={styles.purpleCardTrigger} />
      </div>
      <div className={styles.tailored}></div>
    </div>
  );
};

export default OverflowWrapper;
