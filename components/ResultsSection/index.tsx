"use client";

import { useRef, type CSSProperties } from "react";
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

// 0 进度快照作为桌面端静态初始场景，给 overlay 和 trigger 锚点复用。
const baseScene = buildAnimatedResultsCardScene(0);
const desktopOverlayCards = baseScene.cards.filter((card) => card.kind !== "blank");
const jpmTriggerCard = desktopOverlayCards.find((card) => card.brand === "jpm");

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

const applyCardStyle = (
  element: HTMLDivElement,
  card: ResultsAnimatedCardLayout,
  scene: ResultsCardScene,
) => {
  element.style.left = toPercent(card.left, scene.sceneWidth);
  element.style.top = toPercent(card.top, RESULTS_CLIPPED_SCENE_HEIGHT);
  element.style.width = toPercent(card.frameWidth, scene.sceneWidth);
  element.style.height = toPercent(card.height, RESULTS_CLIPPED_SCENE_HEIGHT);
  element.style.zIndex = String(card.zIndex);
  element.style.setProperty(
    "--card-content-left",
    toPercent(card.contentLeft, card.frameWidth),
  );
  element.style.setProperty(
    "--card-content-width",
    toPercent(card.contentWidth, card.frameWidth),
  );
};

const clampOpenProgress = (progress: number) =>
  Math.min(Math.max(0, Math.min(1, progress)), LOCKED_OPEN_PROGRESS);

const drawWhiteCards = (
  canvas: HTMLCanvasElement,
  stage: HTMLDivElement,
  scene: ResultsCardScene,
) => {
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  const stageWidth = stage.clientWidth;
  const stageHeight = stage.clientHeight;

  if (stageWidth <= 0 || stageHeight <= 0) {
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const canvasWidth = Math.max(1, Math.round(stageWidth * dpr));
  const canvasHeight = Math.max(1, Math.round(stageHeight * dpr));

  if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }

  const scaleX = stageWidth / scene.sceneWidth;
  const scaleY = stageHeight / RESULTS_CLIPPED_SCENE_HEIGHT;
  const whiteCards = scene.cards.filter((card) => card.kind !== "purple");

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, stageWidth, stageHeight);
  context.imageSmoothingEnabled = true;

  whiteCards.forEach((card) => {
    const path = new Path2D(card.pathD);

    context.save();
    context.translate(card.left * scaleX, card.top * scaleY);
    context.scale(scaleX, scaleY);
    context.shadowColor = "rgba(19, 15, 51, 0.18)";
    context.shadowBlur = 38;
    context.shadowOffsetY = 14;
    context.fillStyle = "#ffffff";
    context.fill(path);
    context.shadowColor = "transparent";
    context.shadowBlur = 0;
    context.shadowOffsetY = 0;
    context.lineWidth = 1.4;
    context.strokeStyle = "rgba(255, 255, 255, 0.72)";
    context.stroke(path);
    context.restore();
  });
};

const ResultsSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const jpmTriggerRef = useRef<HTMLDivElement | null>(null);
  const overlayRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const purpleSvgRef = useRef<SVGSVGElement | null>(null);
  const purplePathRef = useRef<SVGPathElement | null>(null);
  const purpleGlossPathRef = useRef<SVGPathElement | null>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      let frameId: number | null = null;
      let pendingProgress = 0;

      const renderScene = (progress: number) => {
        const stage = stageRef.current;
        const canvas = canvasRef.current;

        if (!stage || !canvas) {
          return;
        }

        const scene = buildAnimatedResultsCardScene(progress);

        drawWhiteCards(canvas, stage, scene);

        scene.cards.forEach((card) => {
          if (card.kind === "blank") {
            return;
          }

          const overlay = overlayRefs.current[card.id];

          if (overlay) {
            applyCardStyle(overlay, card, scene);
          }

          if (card.kind === "purple") {
            purpleSvgRef.current?.setAttribute(
              "viewBox",
              `0 0 ${card.frameWidth} ${card.height}`,
            );
            purplePathRef.current?.setAttribute("d", card.pathD);
            purpleGlossPathRef.current?.setAttribute("d", card.pathD);
          }
        });
      };

      const scheduleScene = (nextProgress: number) => {
        pendingProgress = clampOpenProgress(nextProgress);

        if (frameId !== null) {
          return;
        }

        frameId = window.requestAnimationFrame(() => {
          frameId = null;
          renderScene(pendingProgress);
        });
      };

      media.add("(min-width: 1024px)", () => {
        const section = sectionRef.current;
        const jpmCard = jpmTriggerRef.current;

        if (!section || !jpmCard) {
          return undefined;
        }

        renderScene(0);

        const scrollTrigger = ScrollTrigger.create({
          trigger: jpmCard,
          start: "top top",
          endTrigger: section,
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => scheduleScene(self.progress),
          onRefresh: (self) => scheduleScene(self.progress),
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
          scrollTrigger.kill();

          if (frameId !== null) {
            window.cancelAnimationFrame(frameId);
            frameId = null;
          }

          renderScene(0);
        };
      });

      media.add("(max-width: 1023px)", () => {
        renderScene(0);
      });

      return () => {
        media.revert();

        if (frameId !== null) {
          window.cancelAnimationFrame(frameId);
          frameId = null;
        }

        renderScene(0);
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
          ref={stageRef}
          className={styles.canvasStage}
          style={{
            // 用裁切后的场景高度来限定宽高比，这样组件只会占到
            // 动画锁定点的高度；超出部分由 overflow: hidden 隐藏。
            aspectRatio: `${RESULTS_SCENE_WIDTH} / ${RESULTS_CLIPPED_SCENE_HEIGHT}`,
          }}
        >
          <canvas ref={canvasRef} className={styles.desktopCanvas} />

          {jpmTriggerCard ? (
            <div
              ref={jpmTriggerRef}
              className={styles.sceneAnchor}
              style={{
                left: toPercent(jpmTriggerCard.left, baseScene.sceneWidth),
                top: toPercent(
                  jpmTriggerCard.top,
                  RESULTS_CLIPPED_SCENE_HEIGHT,
                ),
              }}
            />
          ) : null}

          {desktopOverlayCards.map((card) => {
            const brandMeta = card.brand
              ? ResultsCardBrandMeta[card.brand]
              : null;
            const purpleGradientId = `results-purple-${card.id}`;
            const purpleGlossId = `results-purple-gloss-${card.id}`;

            return (
              <div
                key={card.id}
                ref={(node) => {
                  overlayRefs.current[card.id] = node;
                }}
                className={styles.stackCard}
                data-kind={card.kind}
                data-brand={card.brand}
                data-column={card.columnIndex + 1}
                style={buildCardStyle(card, baseScene)}
              >
                {card.kind === "purple" ? (
                  <svg
                    ref={purpleSvgRef}
                    className={styles.cardShape}
                    viewBox={`0 0 ${card.frameWidth} ${card.height}`}
                    preserveAspectRatio="none"
                  >
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
                    <path
                      ref={purplePathRef}
                      className={styles.cardShapePath}
                      d={card.pathD}
                      fill={`url(#${purpleGradientId})`}
                    />
                    <path
                      ref={purpleGlossPathRef}
                      className={styles.cardShapeGloss}
                      d={card.pathD}
                      fill={`url(#${purpleGlossId})`}
                    />
                  </svg>
                ) : null}

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
