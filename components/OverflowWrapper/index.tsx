import React from "react";
import styles from "./index.module.scss";

type Props = {};

const OverflowWrapper = (props: Props) => {
  return (
    <div className={styles.overflowWrapper}>
      <section className={styles.features}>
        <div className="relative bg-[linear-gradient(180deg,#fff,#f7f7f8)]">
          <div className={styles.aboutWrapper}>
            <div className="2xl:max-w-157.5">
              <p className={styles.isSectionShown}>
                <span className={styles.aboutLine}>
                  From global enterprises to booming{" "}
                </span>
                <span className={styles.aboutLine}>
                  startups, innovators count on Marqeta.
                </span>
              </p>
              <p className={`${styles.isSectionShown} 2xl:mt-24`}>
                Industry leaders across on-demand delivery, expense management,
                retail, digital banking, and more use Marqeta to deliver
                exceptional customer card experiences that elevate their brands
                and build lasting customer loyalty.{" "}
                <a
                  href="https://www.marqeta.com/resources/marqeta-customer-spotlight-square-card"
                  className="underline"
                >
                  See how Square
                </a>{" "}
                uses Marqeta.
              </p>
            </div>
          </div>
          <div className={styles.listWrapper}>
            <h2 className={styles.listTitle}>
              <span className={styles.aboutLine}>
                Flexible and scalable technology
              </span>
              <span className={styles.aboutLine}>
                to meet your unique payment
              </span>
              <span className={styles.aboutLine}>needs</span>
            </h2>
            <div className="text-[#4d4476] 2xl:max-w-[450px] 2xl:mt-[17px] 2xl:text-lg 2xl:leading-[30px]">
              <span className={styles.aboutLine}>
                Legacy payment solutions are slow, rigid, and lack
              </span>
              <span className={styles.aboutLine}>
                control. Bring the financial solutions to your
              </span>
              <span className={styles.aboutLine}>
                customers at the point of need and delight them in a
              </span>
              <span className={styles.aboutLine}>whole new way.</span>
            </div>
          </div>
        </div>

        <div>IndexFeatures-sequences-wrapper isSectionShown</div>
      </section>
      <div className={styles.purpleCard}></div>
      <div className={styles.tailored}></div>
    </div>
  );
};

export default OverflowWrapper;
