import Image from "next/image";
import { IndexFeaturesSequence } from "./data";
import styles from "./index.module.scss";
import BaseSVG from "./BaseSVG";

type Props = {};

const AspectDesktop = (props: Props) => {
  return (
    <div className={styles.IndexFeaturesSequencesAspect}>
      {IndexFeaturesSequence.map((feature, index) => {
        const { dataTp, dataView, videoShow, imgSrc, title, link } = feature;
        const dataPath = `/videos/features/${dataTp}/`;

        return (
          <div
            key={index}
            className={styles.IndexFeaturesSequence}
            data-tp={dataTp}
          >
            <section
              data-view={dataView}
              className={`${styles[dataView]} ${styles["IndexFeatures-Base"]} ${styles.shown}`}
            >
              <div
                className={`${styles[`${dataView}-content`]} ${styles["IndexFeatures-Base-content"]}`}
                data-path={dataPath}
              >
                {videoShow.map((videoItem) => {
                  const { type, videoSrc, dataTimeOut, opacity } = videoItem;
                  return (
                    <video
                      key={type}
                      muted
                      playsInline
                      crossOrigin=""
                      preload="auto"
                      className={`IndexFeatures-Base-content-video-${type}`}
                      src={videoSrc}
                      data-timeout={dataTimeOut}
                      style={{ opacity: opacity }}
                    />
                  );
                })}
                <Image
                  className={styles["IndexFeatures-Base-content-overlay"]}
                  src={imgSrc}
                  alt={`${title} overlay`}
                  fill
                  sizes="100vw"
                />
              </div>

              <div className={styles["IndexFeatures-Base-hoverArea"]}>
                <div
                  className={`${styles["IndexFeatures-Base-link"]} ${styles[`${dataView}-link`]}`}
                >
                  <a href={`/platform/${link}`}>
                    <div className={styles["IndexFeatures-Base-link-title"]}>
                      {title}
                    </div>
                    <div className={styles["IndexFeatures-Base-link-icon"]}>
                      <div
                        className={styles["IndexFeatures-Base-link-icon-bg"]}
                      />
                      <div
                        className={styles["IndexFeatures-Base-link-icon-title"]}
                      >
                        Learn more
                      </div>
                      <div
                        className={styles["IndexFeatures-Base-link-icon-plus"]}
                      />
                    </div>
                  </a>
                </div>
                <BaseSVG svgType={dataTp} />
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
};

export default AspectDesktop;
