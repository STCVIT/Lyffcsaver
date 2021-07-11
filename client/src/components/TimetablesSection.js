import { useEffect, useState } from "react";
import styles from "../css/TimetablesSection.module.css";
import TimetablePreviews from "./TimetablePreviews";
import Timetables from "./Timetables";

const TimetablesSection = ({
  schedules,
  faculties,
  selectSlots,
  currentlySelectedSlots,
}) => {
  /**
   * Array containing slots of each schedule type
   */
  const schedulesSlots = Object.keys(schedules);
  useEffect(() => {
    // setCurrentlySelectedSlots([]);
  }, [schedules]);
  // console.log({ schedulesSlots });

  return (
    <div
      className={`${styles.screen} ${
        schedulesSlots.length > 0 ? "" : styles.disableScreen
      }`}
    >
      <span className={styles.goto} id="timetable-previews">
        &nbsp;
      </span>
      <TimetablePreviews
        schedulesSlots={schedulesSlots}
        select={selectSlots}
      ></TimetablePreviews>
      <span className={styles.goto} id="timetable">
        &nbsp;
      </span>
      <Timetables
        schedules={schedules}
        slots={currentlySelectedSlots}
        faculties={faculties}
      ></Timetables>

      {/* <div className={styles.twoCols}></div> */}
    </div>
  );
};

export default TimetablesSection;
