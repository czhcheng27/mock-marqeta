import FeaturesBg from "./FeaturesBg";
import FeaturesSequencesWrapper from "./FeaturesSequencesWrapper";
import styles from "./index.module.scss";

type Props = {};

const OverflowWrapper = (props: Props) => {
  return (
    <div id="overflow-wrapper" className={styles.overflowWrapper}>
      <section className={styles.features}>
        <FeaturesBg />
        <FeaturesSequencesWrapper />
      </section>
      <div className={styles.purpleCard}></div>
      <div className={styles.tailored}></div>
    </div>
  );
};

export default OverflowWrapper;
