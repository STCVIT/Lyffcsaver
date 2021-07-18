import { useState } from "react";
import styles from "../css/CampusToggle.module.css";
const CampusToggle = () => {
  const [selectedCampus, setSelectedCampus] = useState("VELLORE");
  return (
    <div
      className={`${styles.toggle} ${
        selectedCampus === "VELLORE" ? styles.selected1 : styles.selected2
      }`}
    >
      <div
        onClick={(e) => {
          const element = e?.target?.parentNode;
          if (element?.classList.contains(styles.toggle)) {
            element.classList.remove(styles.selected2);
            element.classList.add(styles.selected1);
          }
        }}
        className="body2-medium"
      >
        VELLORE
      </div>
      <span></span>
      <div
        onClick={(e) => {
          const element = e?.target?.parentNode;
          if (element?.classList.contains(styles.toggle)) {
            element.classList.remove(styles.selected1);
            element.classList.add(styles.selected2);
          }
        }}
        className="body2-medium"
      >
        CHENNAI
      </div>
    </div>
  );
};

export default CampusToggle;
