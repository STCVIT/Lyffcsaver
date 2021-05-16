import { useState } from "react";
import Timetable from "./Timetable";
import Classes from "./Classes";
import styles from "../css/Timetables.module.css";

const Timetables = ({ schedules, slots }) => {
  const [currentlySelectedClasses, setCurrentlySelectedClasses] = useState({});
  return (
    <div id="#timetables-screen" className={styles.timetablesScreen}>
      <h3>{slots.join("+")}</h3>
      <Timetable slots={slots} classes={currentlySelectedClasses}></Timetable>
      <Classes
        schedules={schedules[slots.join("+")]}
        select={setCurrentlySelectedClasses}
      ></Classes>
    </div>
  );
};

export default Timetables;
