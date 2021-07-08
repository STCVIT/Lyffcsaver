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
const Main = ({ logoVariant }) => {
  const [allSchedules, setAllSchedules] = useState([]);
  const [faculties, setFaculties] = useState({});
  const [blacklistedSlots, setBlacklistedSlots] = useState([]);
  const populateAllSchedules = async (courses, faculties, blacklistedSlots) => {
    setAllSchedules([]);
    setAllSchedules(await getTimetables(courses, faculties, blacklistedSlots));
    setFaculties({ ...faculties });
  };

  useEffect(() => {
    if (Object.keys(allSchedules).length > 0) {
      let element = document.getElementById("screen2");
      element?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allSchedules]);

  useEffect(() => {
    console.log("updated allSchedules", allSchedules);
  }, [allSchedules]);
  const getAllSlotCombinations = async (
    courses,
    faculties,
    blacklistedSlots
  ) => {
    setAllSchedules([]);
    setAllSchedules(
      await getSlotCombinations(courses, faculties, blacklistedSlots)
    );
    setFaculties({ ...faculties });
    setBlacklistedSlots([...blacklistedSlots]);
  };

  const getSchedulesForSlots = async (newSlotsString) => {
    const result = await populateSlotCombination(
      faculties,
      blacklistedSlots,
      newSlotsString,
      allSchedules
    );
    setAllSchedules((prevAllSchedules) => {
      prevAllSchedules[newSlotsString] = result[newSlotsString];
      console.log("new all schedules", prevAllSchedules);
      return { ...prevAllSchedules };
    });
  };

  useEffect(() => {
    if (Object.keys(allSchedules).length > 0) {
      let element = document.getElementById("screen2");
      element?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allSchedules]);

  return (
    <div className={styles.appContainer}>
      <QuarterEllipse className={styles.ellipse}></QuarterEllipse>
      <Options
        getCourseID={getCourseID}
        generateTimetables={getAllSlotCombinations}
      />
      <TimetablesSection
        schedules={allSchedules}
        faculties={faculties}
        getSchedulesForSlots={getSchedulesForSlots}
      ></TimetablesSection>
    </div>
  );
};

export default Main;
