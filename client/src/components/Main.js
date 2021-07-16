import Header from "./Header";
import Options from "./Options";
import TimetablesSection from "./TimetablesSection";
import { useEffect, useState } from "react";
import { ReactComponent as QuarterEllipse } from "../assets/quarterEllipse.svg";
import {
  getTimetables,
  getCourseID,
  getSlotCombinations,
  populateSlotCombination,
} from "../utils/generalUtils";
import styles from "../css/Main.module.css";
const Main = () => {
  const [allSchedules, setAllSchedules] = useState({});
  const [classes, setClasses] = useState({});
  const [reservedSlots, setReservedSlots] = useState([]);
  const [currentlySelectedSlots, setCurrentlySelectedSlots] = useState([]);
  const [finalizedClasses, setFinalizedClasses] = useState([]);
  // const populateAllSchedules = async (courses, faculties, reservedSlots) => {
  //   setAllSchedules([]);
  //   setAllSchedules(await getTimetables(courses, faculties, reservedSlots));
  //   setFaculties({ ...faculties });
  // };
  // let prevSlotStrings = []

  // useEffect(() => {
  // let same = true
  // for (const slotString of prevSlotStrings) {
  //   if()
  // }
  //   if (Object.keys(allSchedules).length > 0) {
  //     let element = document.getElementById("timetable-previews");
  //     element?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [allSchedules]);

  useEffect(() => {
    console.log("updated allSchedules", allSchedules);
  }, [allSchedules]);
  const getAllSlotCombinations = async (classes, reservedSlots) => {
    setAllSchedules({});
    setAllSchedules(await getSlotCombinations(classes, reservedSlots));
    setClasses({ ...classes });
    setReservedSlots([...reservedSlots]);
  };

  const getSchedulesForSlots = async (newSlotsString) => {
    const result = await populateSlotCombination(
      classes,
      reservedSlots,
      newSlotsString,
      allSchedules
    );
    // console.log(newSlotsString, newSlotsString.length > 0);
    if (newSlotsString.length > 0)
      setAllSchedules((prevAllSchedules) => {
        prevAllSchedules[newSlotsString] = result[newSlotsString];
        // console.log("new all schedules", prevAllSchedules);
        return { ...prevAllSchedules };
      });
  };
  const selectSlots = async (slots) => {
    getSchedulesForSlots(slots.join("+"));
    setCurrentlySelectedSlots(slots);
  };

  return (
    <div className={styles.appContainer}>
      {/* <Header /> */}
      {/* <QuarterEllipse className={styles.ellipse}></QuarterEllipse> */}
      <Options
        getCourseID={getCourseID}
        generateTimetables={getAllSlotCombinations}
        selectSlots={selectSlots}
        setFinalizedClasses={setFinalizedClasses}
      />
      <TimetablesSection
        schedules={allSchedules}
        classes={classes}
        getSchedulesForSlots={getSchedulesForSlots}
        currentlySelectedSlots={currentlySelectedSlots}
        selectSlots={selectSlots}
      ></TimetablesSection>
    </div>
  );
};

export default Main;
