import styles from "./css/App.module.css";
import Header from "./components/Header";
import Options from "./components/Options";
import TimetablesSection from "./components/TimetablesSection";
import {
  getTimetables,
  getCourseID,
  getSlotCombinations,
  populateSlotCombination,
} from "./utils/generalUtils";
import { useEffect, useState } from "react";

// // TODO: Make separate list components instead of just one that changes according to the props passed in
// // TODO: Generate timetables based on preferences (generator function)
// // TODO: Figure out how to work with timetables (slots, timings)
// // TODO: Render timetables
// // TODO: Reorder faculty list by dragging (react-beautiful-dnd)
// TODO: Refactor and make classes for schedules, faculties and classes
// TODO: Add jsdoc wherever necessary

function App() {
  const [allSchedules, setAllSchedules] = useState([]);
  const [blacklistedSlots, setBlacklistedSlots] = useState([]);
  const [faculties, setFaculties] = useState({});
  // const populateAllSchedules = async (courses, faculties, blacklistedSlots) => {
  //   setAllSchedules([]);
  //   setAllSchedules(await getTimetables(courses, faculties, blacklistedSlots));
  //   setFaculties({ ...faculties });
  // };
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
    <>
      <Header />
      <Options
        getCourseID={getCourseID}
        generateTimetables={getAllSlotCombinations}
      />
      <TimetablesSection
        schedules={allSchedules}
        faculties={faculties}
        getSchedulesForSlots={getSchedulesForSlots}
      ></TimetablesSection>
    </>
  );
}

export default App;
