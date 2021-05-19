import { useEffect, useState } from "react";
import Timetable from "./Timetable";
import Classes from "./Classes";
import styles from "../css/Timetables.module.css";

const Timetables = ({ schedules, slots }) => {
  const [currentlySelectedSchedule, setCurrentlySelectedSchedule] = useState(
    {}
  );
  useEffect(() => {
    setCurrentlySelectedSchedule({});
  }, [slots]);
  return (
    <div id="#timetables-screen" className={styles.timetablesScreen}>
      <h3 className={styles.slotTitle}>{slots.join("+")}</h3>
      <Classes
        schedules={schedules[slots.join("+")]}
        slots={slots}
        select={setCurrentlySelectedSchedule}
      ></Classes>
      <Timetable schedule={currentlySelectedSchedule} slots={slots}></Timetable>
    </div>
  );
};

export default Timetables;
