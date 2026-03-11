import Image from "next/image";
import {
  buildResultsCardScene,
  RESULTS_SCENE_WIDTH,
} from "./geometry";
import {
  IndexResultsCard,
  IndexResultsCardsCount,
  IndexResultsFact,
  IndexResultsTitleWord,
  ResultsCardBrandMeta,
} from "./data";
import styles from "./index.module.scss";

// 静态列阵场景在模块加载时一次性生成；这一版不做滚动驱动动画。
const staticScene = buildResultsCardScene();

// geometry.ts 输出的是像素坐标，这里统一转成相对场景的百分比，方便响应式缩放。
const toPercent = (value: number, total: number) => `${(value / total) * 100}%`;

const ResultsSection = () => {
  return (
    <section className={styles.section} data-view="IndexResults">
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
            // 固定场景宽高比，让绝对定位卡片随容器等比缩放。
            aspectRatio: `${RESULTS_SCENE_WIDTH} / ${staticScene.sceneHeight}`,
          }}
        >
          {staticScene.cards.map((card) => {
            // 只有品牌卡才需要取 logo 资源；purple / blank 卡没有 logo。
            const brandMeta = card.brand ? ResultsCardBrandMeta[card.brand] : null;

            return (
              <div
                key={card.id}
                className={styles.stackCard}
                data-kind={card.kind}
                data-brand={card.brand}
                style={{
                  left: toPercent(card.left, staticScene.sceneWidth),
                  top: toPercent(card.top, staticScene.sceneHeight),
                  width: toPercent(card.width, staticScene.sceneWidth),
                  height: toPercent(card.height, staticScene.sceneHeight),
                  zIndex: card.zIndex,
                }}
              >
                {/* 第二列第一张紫卡保留一个简化的内部占位结构。 */}
                {card.kind === "purple" ? (
                  <div className={styles.purpleCardInner}>
                    <span className={styles.purpleBadge}>marqeta</span>
                    <span className={styles.purpleChip} />
                    <span className={styles.purpleLineShort} />
                    <span className={styles.purpleLineLong} />
                  </div>
                ) : null}

                {/* 品牌卡只渲染顶部 logo，空白卡不放任何内容。 */}
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
            );
          })}

          {/* 移动端不复用桌面的完整列阵，只保留一个简化后的顶部卡序占位。 */}
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
