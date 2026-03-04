import FeaturesBg from "./FeaturesBg";
import styles from "./index.module.scss";

type Props = {};

const OverflowWrapper = (props: Props) => {
  return (
    <div className={styles.overflowWrapper}>
      <section className={styles.features}>
        <FeaturesBg />

        <div>IndexFeatures-sequences-wrapper isSectionShown</div>
      </section>
      <div className={styles.purpleCard}></div>
      <div className={styles.tailored}></div>
    </div>
  );
};

export default OverflowWrapper;
