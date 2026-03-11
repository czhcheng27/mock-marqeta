"use client";

import { startTransition, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  buildAnimatedResultsCardScene,
  LOCKED_OPEN_PROGRESS,
  RESULTS_CLIPPED_SCENE_HEIGHT,
  RESULTS_SCENE_WIDTH,
  type ResultsAnimatedCardLayout,
  type ResultsCardScene,
} from "./geometry";
import {
  IndexResultsCard,
  IndexResultsCardsCount,
  IndexResultsFact,
  IndexResultsTitleWord,
  ResultsCardBrandMeta,
} from "./data";
import styles from "./index.module.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// geometry.ts 输出的是场景像素坐标，这里统一转成百分比，方便响应式缩放。
const toPercent = (value: number, total: number) => `${(value / total) * 100}%`;

type CardStyle = CSSProperties & {
  "--card-content-left": string;
  "--card-content-width": string;
};

const buildCardStyle = (
  card: ResultsAnimatedCardLayout,
  scene: ResultsCardScene,
): CardStyle => ({
  left: toPercent(card.left, scene.sceneWidth),
  top: toPercent(card.top, RESULTS_CLIPPED_SCENE_HEIGHT),
  width: toPercent(card.frameWidth, scene.sceneWidth),
  height: toPercent(card.height, RESULTS_CLIPPED_SCENE_HEIGHT),
  zIndex: card.zIndex,
  "--card-content-left": toPercent(card.contentLeft, card.frameWidth),
  "--card-content-width": toPercent(card.contentWidth, card.frameWidth),
});

const ResultsSection = () => {
  const [openProgress, setOpenProgress] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const jpmCardRef = useRef<HTMLDivElement | null>(null);
  const scene = buildAnimatedResultsCardScene(openProgress);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      const syncProgress = (nextProgress: number) => {
        // 滚动进度直接用作动画进度；geometry 内部会在
        // LOCKED_OPEN_PROGRESS 处锁住宽度，这里也做一次
        // 夹紧，以便滚动一到达锁点就不再触发多余的渲染。
        const visualProgress = Math.min(
          Math.max(0, Math.min(1, nextProgress)),
          LOCKED_OPEN_PROGRESS,
        );

        startTransition(() => {
          setOpenProgress((currentProgress) =>
            Math.abs(currentProgress - visualProgress) < 0.001
              ? currentProgress
              : visualProgress,
          );
        });
      };

      media.add("(min-width: 1024px)", () => {
        const section = sectionRef.current;
        const jpmCard = jpmCardRef.current;

        if (!section || !jpmCard) {
          return undefined;
        }

        syncProgress(0);

        const scrollTrigger = ScrollTrigger.create({
          trigger: jpmCard,
          start: "top top",
          endTrigger: section,
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => syncProgress(self.progress),
          onRefresh: (self) => syncProgress(self.progress),
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
          scrollTrigger.kill();
          syncProgress(0);
        };
      });

      media.add("(max-width: 1023px)", () => {
        syncProgress(0);
      });

      return () => {
        media.revert();
        syncProgress(0);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-view="IndexResults"
    >
      <div className={styles.flex}>
        <div className={styles.wrapper}>
          <div className={styles.titleBlock}>
            <h2 className={styles.title}>
              {IndexResultsTitleWord.map((item, index) => (
                <span key={`${item}-${index}`} className={styles.titleWord}>
                  {index === 0 ? item : ` ${item}`}
                </span>
              ))}
            </h2>
          </div>

          <div className={styles.cards}>
            <div className={styles.cardsCount}>
              <span className={styles.cardsCountToken}>$</span>
              {IndexResultsCardsCount.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className={styles.cardsCountToken}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className={styles.cardsText}>volume processed in 2022</div>
          </div>

          <div className={styles.facts}>
            {IndexResultsFact.map(({ number, text }) => (
              <div key={number} className={styles.fact}>
                <div className={styles.factTitle}>{number}</div>
                <div className={styles.factDescription}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.canvas} aria-hidden="true">
        <div
          className={styles.canvasStage}
          style={{
            // 用裁切后的场景高度来限定宽高比，这样组件只会占到
            // 动画锁定点的高度；超出部分由 overflow: hidden 隐藏。
            aspectRatio: `${RESULTS_SCENE_WIDTH} / ${RESULTS_CLIPPED_SCENE_HEIGHT}`,
          }}
        >
          {scene.cards.map((card) => {
            const brandMeta = card.brand
              ? ResultsCardBrandMeta[card.brand]
              : null;
            const purpleGradientId = `results-purple-${card.id}`;
            const purpleGlossId = `results-purple-gloss-${card.id}`;

            return (
              <div
                key={card.id}
                ref={(node) => {
                  if (card.brand === "jpm") {
                    jpmCardRef.current = node;
                  }
                }}
                className={styles.stackCard}
                data-kind={card.kind}
                data-brand={card.brand}
                data-column={card.columnIndex + 1}
                style={buildCardStyle(card, scene)}
              >
                <svg
                  className={styles.cardShape}
                  viewBox={`0 0 ${card.frameWidth} ${card.height}`}
                  preserveAspectRatio="none"
                >
                  {card.kind === "purple" ? (
                    <defs>
                      <linearGradient
                        id={purpleGradientId}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#8c82ff" />
                        <stop offset="46%" stopColor="#6258de" />
                        <stop offset="100%" stopColor="#2d236b" />
                      </linearGradient>
                      <linearGradient
                        id={purpleGlossId}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#ffffff"
                          stopOpacity="0.26"
                        />
                        <stop
                          offset="38%"
                          stopColor="#ffffff"
                          stopOpacity="0"
                        />
                        <stop
                          offset="100%"
                          stopColor="#ffffff"
                          stopOpacity="0.08"
                        />
                      </linearGradient>
                    </defs>
                  ) : null}
                  <path
                    className={styles.cardShapePath}
                    d={card.pathD}
                    fill={
                      card.kind === "purple"
                        ? `url(#${purpleGradientId})`
                        : "#ffffff"
                    }
                  />
                  {card.kind === "purple" ? (
                    <path
                      className={styles.cardShapeGloss}
                      d={card.pathD}
                      fill={`url(#${purpleGlossId})`}
                    />
                  ) : null}
                </svg>

                {card.kind !== "blank" ? (
                  <div className={styles.cardContentFrame}>
                    {card.kind === "purple" ? (
                      <div className={styles.purpleCardInner}>
                        <span className={styles.purpleBadge}>marqeta</span>
                        <span className={styles.purpleChip} />
                        <span className={styles.purpleLineShort} />
                        <span className={styles.purpleLineLong} />
                      </div>
                    ) : null}

                    {card.kind === "brand" && brandMeta ? (
                      <span className={styles.cardLogoAsset}>
                        <Image
                          src={brandMeta.logoSrc}
                          alt=""
                          fill
                          unoptimized
                          sizes="12vw"
                        />
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}

          {IndexResultsCard.map((column, index) => (
            <div
              key={`mobile-${index}`}
              className={styles.mobileCardColumn}
              data-column={index + 1}
            >
              {column.cards[0]?.kind === "brand" && column.cards[0].brand ? (
                <span className={styles.mobileCardLogo}>
                  <Image
                    src={ResultsCardBrandMeta[column.cards[0].brand].logoSrc}
                    alt=""
                    fill
                    unoptimized
                    sizes="22vw"
                  />
                </span>
              ) : null}
            </div>
          ))}

          <div className={styles.mobilePurpleCard}>
            <div className={styles.mobilePurpleCardInner} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
