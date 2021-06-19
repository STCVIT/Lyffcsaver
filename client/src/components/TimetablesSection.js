import { useEffect, useState } from "react";
import styles from "../css/TimetablesSection.module.css";
import TimetablePreviews from "./TimetablePreviews";
import Timetables from "./Timetables";

const TimetablesSection = ({ schedules, faculties }) => {
  /**
   * Array containing slots of each schedule type
   */
  const schedulesSlots = Object.keys(schedules);
  const [currentlySelectedSlots, setCurrentlySelectedSlots] = useState([]);
  useEffect(() => {
    setCurrentlySelectedSlots([]);
  }, [schedules]);

  return (
    <div
      className={`${styles.screen} ${
        Object.keys(schedules).length > 0 ? "" : styles.disableScreen
      }`}
      id="screen2"
    >
      <div className={styles.twoCols}>
        <TimetablePreviews
          schedulesSlots={schedulesSlots}
          select={setCurrentlySelectedSlots}
        ></TimetablePreviews>
        <Timetables
          schedules={schedules}
          slots={currentlySelectedSlots}
          faculties={faculties}
        ></Timetables>
        {/* {currentlySelectedSlots.length === 0 ? (
          <></>
        ) : (
          <Timetables
            schedules={schedules}
            slots={currentlySelectedSlots}
          ></Timetables>
        )} */}
      </div>
    </div>
  );
};

export default TimetablesSection;
