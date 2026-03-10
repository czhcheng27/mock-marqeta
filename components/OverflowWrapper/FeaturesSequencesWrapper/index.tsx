"use client";

import AspectDesktop from "./AspectDesktop";
import AspectMobile from "./AspectMobile";
import styles from "./index.module.scss";

const FeaturesSequencesWrapper = () => {
  return (
    <div className="relative mx-auto my-0 select-none 2xl:max-w-[1260px] 2xl:-mt-[72px]">
      <div className="ml-[4.20634921%] mr-[1.11111111%]">
        <div className={styles.desktopOnly}>
          <AspectDesktop />
        </div>
        <div className={styles.mobileOnly}>
          <AspectMobile />
        </div>
      </div>
    </div>
  );
};

export default FeaturesSequencesWrapper;
