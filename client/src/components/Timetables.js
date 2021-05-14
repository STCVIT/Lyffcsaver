import { useEffect } from "react";
import styles from "../css/Timetables.module.css";
import TimetablePreviews from "./TimetablePreviews";

const Timetables = ({ schedules, renderMore }) => {
  /**
   * Array containing slots of each schedule type
   */
  const schedulesSlots = Object.keys(schedules);
  console.log("in timetables", schedules, schedulesSlots);

  return (
    <div
      className={`${styles.screen} ${
        Object.keys(schedules).length > 0 ? "" : styles.disableScreen
      }`}
      id="screen2"
    >
      <h1 className={styles.title}>Generated Timetables</h1>
      <TimetablePreviews schedulesSlots={schedulesSlots}></TimetablePreviews>
    </div>
  );
};

export default Timetables;
