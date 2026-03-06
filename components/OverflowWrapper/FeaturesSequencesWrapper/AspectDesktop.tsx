import Image from "next/image";
import { useRef, useState } from "react";
import { IndexFeaturesSequence } from "./data";
import styles from "./index.module.scss";
import BaseSVG from "./BaseSVG";

type FeatureVideoType = "show" | "hover" | "unhover";
type FeatureVideoRefs = Partial<
  Record<FeatureVideoType, HTMLVideoElement | null>
>;

const getVideoOpacity = (type: string, isHovered: boolean) => {
  if (type === "hover") return isHovered ? 1 : 0;
  if (type === "unhover") return isHovered ? 0 : 1;
  return 0;
};

const getVideoDuration = (video: HTMLVideoElement | null | undefined) => {
  if (!video) return 0;
  if (Number.isFinite(video.duration) && video.duration > 0) {
    return video.duration;
  }

  const fallbackDuration = Number(video.dataset.timeout);
  if (Number.isFinite(fallbackDuration) && fallbackDuration > 0) {
    return fallbackDuration / 1000;
  }

  return 0;
};

const clampTime = (time: number, duration: number) => {
  if (duration <= 0) {
    return Math.max(time, 0);
  }

  return Math.min(Math.max(time, 0), Math.max(duration - 0.001, 0));
};

const setVideoTime = (
  video: HTMLVideoElement | null | undefined,
  nextTime: number
) => {
  if (!video) return;
  const duration = getVideoDuration(video);
  const safeTime = clampTime(nextTime, duration);

  try {
    video.currentTime = safeTime;
  } catch {
    // Ignore eager seek failures before metadata is fully available.
  }
};

const playVideo = (
  video: HTMLVideoElement | null | undefined,
  startTime?: number
) => {
  if (!video) return;
  if (typeof startTime === "number") {
    setVideoTime(video, startTime);
  }
  const promise = video.play();
  if (promise && typeof promise.catch === "function") {
    promise.catch(() => {});
  }
};

const pauseVideo = (video: HTMLVideoElement | null | undefined) => {
  if (!video) return;
  video.pause();
};

const getHoverProgress = (refs: FeatureVideoRefs) => {
  const hoverVideo = refs.hover;
  const hoverDuration = getVideoDuration(hoverVideo);

  if (!hoverVideo || hoverDuration <= 0) {
    return 0;
  }

  return Math.min(Math.max(hoverVideo.currentTime / hoverDuration, 0), 1);
};

const getUnhoverProgress = (refs: FeatureVideoRefs) => {
  const unhoverVideo = refs.unhover;
  const unhoverDuration = getVideoDuration(unhoverVideo);

  if (!unhoverVideo || unhoverDuration <= 0) {
    return 1;
  }

  const progress = 1 - unhoverVideo.currentTime / unhoverDuration;
  return Math.min(Math.max(progress, 0), 1);
};

const AspectDesktop = () => {
  const [hoveredTp, setHoveredTp] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, FeatureVideoRefs>>({});
  const initialRestFrameSet = useRef<Record<string, boolean>>({});

  const setVideoRef = (
    dataTp: string,
    type: string,
    node: HTMLVideoElement | null
  ) => {
    if (!videoRefs.current[dataTp]) {
      videoRefs.current[dataTp] = {};
    }
    videoRefs.current[dataTp][type as FeatureVideoType] = node;
  };

  const handleVideoLoadedMetadata = (
    dataTp: string,
    type: FeatureVideoType,
    video: HTMLVideoElement
  ) => {
    if (type !== "unhover") {
      return;
    }

    if (initialRestFrameSet.current[dataTp]) {
      return;
    }

    setVideoTime(video, getVideoDuration(video));
    pauseVideo(video);
    initialRestFrameSet.current[dataTp] = true;
  };

  const handleSectionEnter = (dataTp: string) => {
    setHoveredTp(dataTp);
    const refs = videoRefs.current[dataTp];
    const shouldStartFromBeginning =
      !initialRestFrameSet.current[dataTp] &&
      (refs?.unhover?.currentTime ?? 0) === 0;
    const progress = shouldStartFromBeginning ? 0 : getUnhoverProgress(refs);
    const hoverDuration = getVideoDuration(refs?.hover);

    playVideo(refs?.hover, progress * hoverDuration);
    pauseVideo(refs?.unhover);
    pauseVideo(refs?.show);
  };

  const handleSectionLeave = (dataTp: string) => {
    setHoveredTp((prev) => (prev === dataTp ? null : prev));
    const refs = videoRefs.current[dataTp];
    const progress = getHoverProgress(refs);
    const unhoverDuration = getVideoDuration(refs?.unhover);

    playVideo(refs?.unhover, (1 - progress) * unhoverDuration);
    pauseVideo(refs?.hover);
    pauseVideo(refs?.show);
  };

  return (
    <div className={styles.IndexFeaturesSequencesAspect}>
      {IndexFeaturesSequence.map((feature, index) => {
        const { dataTp, dataView, videoShow, imgSrc, title, link } = feature;
        const dataPath = `/videos/features/${dataTp}/`;
        const isHovered = hoveredTp === dataTp;

        return (
          <div
            key={index}
            className={styles.IndexFeaturesSequence}
            data-tp={dataTp}
          >
            <section
              data-view={dataView}
              className={`${styles[dataView]} ${styles["IndexFeatures-Base"]} ${styles.shown} ${isHovered ? "hovered" : ""}`}
              onMouseEnter={() => handleSectionEnter(dataTp)}
              onMouseLeave={() => handleSectionLeave(dataTp)}
            >
              <div
                className={`${styles[`${dataView}-content`]} ${styles["IndexFeatures-Base-content"]}`}
                data-path={dataPath}
              >
                {videoShow.map((videoItem) => {
                  const { type, videoSrc, dataTimeOut } = videoItem;
                  return (
                    <video
                      key={type}
                      ref={(node) => setVideoRef(dataTp, type, node)}
                      onLoadedMetadata={(event) =>
                        handleVideoLoadedMetadata(
                          dataTp,
                          type as FeatureVideoType,
                          event.currentTarget
                        )
                      }
                      muted
                      playsInline
                      crossOrigin=""
                      preload="auto"
                      className={`IndexFeatures-Base-content-video-${type}`}
                      src={videoSrc}
                      data-timeout={dataTimeOut}
                      style={{ opacity: getVideoOpacity(type, isHovered) }}
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
