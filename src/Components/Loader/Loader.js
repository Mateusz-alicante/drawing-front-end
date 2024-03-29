import { CircleLoader } from "react-spinners";
import styles from "./Loader.module.css";

export default ({ show }) => {
  return (
    <div
      style={{ display: show ? "flex" : "none" }}
      className={styles.container}
    >
      <div className={styles.innerContainer}>
        <h1 className={styles.label}>Loading</h1>
        <div className={styles.loaderContainer}>
          <CircleLoader className={styles.spinner} color="#63bdf5" size={85} />
        </div>
      </div>
    </div>
  );
};
