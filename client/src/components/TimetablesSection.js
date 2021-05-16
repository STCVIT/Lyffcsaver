import { useEffect, useState } from "react";
import styles from "../css/TimetablesSection.module.css";
import TimetablePreviews from "./TimetablePreviews";
import Timetables from "./Timetables";

const TimetablesSection = ({ schedules, renderMore }) => {
  /**
   * Array containing slots of each schedule type
   */
  const schedulesSlots = Object.keys(schedules);
  const [currentlySelectedSlots, setCurrentlySelectedSlots] = useState([]);
  useEffect(() => {
    setCurrentlySelectedSlots([]);
  }, [schedules]);
  console.log("in timetables section", schedules, currentlySelectedSlots);

  return (
    <div
      className={`${styles.screen} ${
        Object.keys(schedules).length > 0 ? "" : styles.disableScreen
      }`}
      id="screen2"
    >
      <h1 className={styles.title}>Generated Timetables</h1>
      <div className={styles.twoCols}>
        <TimetablePreviews
          schedulesSlots={schedulesSlots}
          select={setCurrentlySelectedSlots}
        ></TimetablePreviews>
        {currentlySelectedSlots.length === 0 ? (
          <></>
        ) : (
          <Timetables
            schedules={schedules}
            slots={currentlySelectedSlots}
          ></Timetables>
        )}
      </div>
    </div>
  );
};

export default TimetablesSection;
