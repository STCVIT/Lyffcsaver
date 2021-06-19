import { useEffect, useState } from "react";
import Timetable from "./Timetable";
import Classes from "./Classes";
import styles from "../css/Timetables.module.css";

const Timetables = ({ schedules, slots, faculties }) => {
  console.log("rerendering Timetables(", schedules, slots, faculties, ")");
  const [selectedClasses, setSelectedClasses] = useState({});
  const [hoveredSlots, setHoveredSlots] = useState([]);
  useEffect(() => {
    setHoveredSlots([]);
  }, [slots]);
  // useEffect(() => console.log("selected classes", selectedClasses), [
  //   selectedClasses,
  // ]);
  return (
    <div id="#timetables-screen" className={styles.timetablesScreen}>
      {/* <h3 className={styles.slotTitle}>{slots.join("+")}</h3> */}

      <Timetable
        selectedClasses={selectedClasses}
        slots={slots}
        hoveredSlots={hoveredSlots}
      ></Timetable>
      {slots !== undefined && slots.length > 0 ? (
        <Classes
          schedules={schedules[slots.join("+")]}
          slots={slots}
          selectedClasses={selectedClasses}
          setSelectedClasses={setSelectedClasses}
          faculties={faculties}
          setHoveredSlots={setHoveredSlots}
        ></Classes>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Timetables;
