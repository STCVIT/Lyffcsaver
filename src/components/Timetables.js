import { useEffect, useState } from "react";
import Timetable from "./Timetable";
import Classes from "./Classes";
import styles from "../css/Timetables.module.css";

const Timetables = ({ schedules, slots, classes }) => {
  // console.log("rerendering Timetables(", schedules, slots, faculties, ")");
  const [selectedClasses, setSelectedClasses] = useState({});
  const [hoveredSlots, setHoveredSlots] = useState([]);
  useEffect(() => {
    setHoveredSlots([]);
  }, [slots]);
  // useEffect(() => {
  //   setSelectedClasses((prevSelectedClasses) => {
  //     const obj = { ...prevSelectedClasses };
  //     console.log(JSON.stringify(obj));
  //     Object.keys(obj).forEach((courseID) => {
  //       const classID = obj[courseID]["CLASS ID"];
  //       const completeClassData = classes[courseID].find(
  //         (classData) => classData["CLASS ID"] === classID
  //       );
  //       if (completeClassData !== undefined)
  //         obj["COURSE TITLE"] = completeClassData["COURSE TITLE"];
  //       console.log(JSON.stringify(obj));
  //       return obj;
  //     });
  //   });
  // }, [selectedClasses]);
  return (
    <div id="#timetables-screen" className={styles.timetablesScreen}>
      <Timetable
        selectedClasses={selectedClasses}
        slots={slots}
        hoveredSlots={hoveredSlots}
        classes={classes}
      ></Timetable>
      {slots !== undefined && slots.length > 0 ? (
        <Classes
          schedules={schedules[slots.join("+")]}
          slots={slots}
          selectedClasses={selectedClasses}
          setSelectedClasses={setSelectedClasses}
          setHoveredSlots={setHoveredSlots}
          classPreferences={classes}
        ></Classes>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Timetables;
