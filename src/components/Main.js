import Options from "./Options";
import TimetablesSection from "./TimetablesSection";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
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
    // console.log(await getTimetables(classes, reservedSlots));
    setAllSchedules({});
    const result = await getSlotCombinations(classes, reservedSlots);
    if (result.error !== undefined) return result;
    setAllSchedules(result);
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
    if (newSlotsString.length > 0)
      setAllSchedules((prevAllSchedules) => {
        prevAllSchedules[newSlotsString] = result[newSlotsString];
        return { ...prevAllSchedules };
      });
  };
  const selectSlots = async (slots) => {
    getSchedulesForSlots(slots.join("+"));
    setCurrentlySelectedSlots(slots);
  };
  const isClientMobile = () => {
    let mql = window.matchMedia("(max-width: 750px)");
    if (
      // /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      //   navigator.userAgent
      // ) &&
      mql.matches
    ) {
      return true;
    }
    return false;
  };
  return (
    <Container className={styles.container}>
      {isClientMobile() ? (
        <>Site not made for mobile use. Please open on a larger screen.</>
      ) : (
        <>
          <Options
            getCourseID={getCourseID}
            generateTimetables={getAllSlotCombinations}
            selectSlots={selectSlots}
          />
          <TimetablesSection
            schedules={allSchedules}
            classes={classes}
            getSchedulesForSlots={getSchedulesForSlots}
            currentlySelectedSlots={currentlySelectedSlots}
            selectSlots={selectSlots}
          ></TimetablesSection>
        </>
      )}
    </Container>
  );
  // return {<>}
};

export default Main;
