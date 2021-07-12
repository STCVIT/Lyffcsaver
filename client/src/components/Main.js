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
  const [faculties, setFaculties] = useState({});
  const [reservedSlots, setReservedSlots] = useState([]);
  const [currentlySelectedSlots, setCurrentlySelectedSlots] = useState([]);
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
  const getAllSlotCombinations = async (courses, faculties, reservedSlots) => {
    setAllSchedules({});
    setAllSchedules(
      await getSlotCombinations(courses, faculties, reservedSlots)
    );
    setFaculties({ ...faculties });
    setReservedSlots([...reservedSlots]);
  };

  const getSchedulesForSlots = async (newSlotsString) => {
    const result = await populateSlotCombination(
      faculties,
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
      <QuarterEllipse className={styles.ellipse}></QuarterEllipse>
      <Options
        getCourseID={getCourseID}
        generateTimetables={getAllSlotCombinations}
        selectSlots={selectSlots}
      />
      <TimetablesSection
        schedules={allSchedules}
        faculties={faculties}
        getSchedulesForSlots={getSchedulesForSlots}
        currentlySelectedSlots={currentlySelectedSlots}
        selectSlots={selectSlots}
      ></TimetablesSection>
    </div>
  );
};

export default Main;
