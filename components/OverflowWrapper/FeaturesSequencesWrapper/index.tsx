"use client";

import { useEffect, useState } from "react";
import { MobileBreakPoint } from "@/constant";
import AspectDesktop from "./AspectDesktop";
import AspectMobile from "./AspectMobile";
import styles from "./index.module.scss";

const FeaturesSequencesWrapper = () => {
  const [isDesktop, setDesktop] = useState(false);

  useEffect(() => {
    const updateMedia = () => {
      setDesktop(window.innerWidth > MobileBreakPoint);
    };

    updateMedia();
    window.addEventListener("resize", updateMedia);

    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  return (
    <div className="relative mx-auto my-0 select-none 2xl:max-w-[1260px] 2xl:-mt-[72px]">
      <div className="ml-[4.20634921%] mr-[1.11111111%]">
        {isDesktop ? <AspectDesktop /> : <AspectMobile />}
      </div>
    </div>
  );
};

export default FeaturesSequencesWrapper;
