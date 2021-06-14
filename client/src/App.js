import styles from "./css/App.module.css";
import Header from "./components/Header";
import Options from "./components/Options";
import TimetablesSection from "./components/TimetablesSection";
import { getTimetables, getCourseID } from "./utils/generalUtils";
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
  const [faculties, setFaculties] = useState({});
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

  return (
    <>
      <Header />
      <Options
        getCourseID={getCourseID}
        generateTimetables={populateAllSchedules}
      />
      <TimetablesSection
        schedules={allSchedules}
        faculties={faculties}
      ></TimetablesSection>
    </>
  );
}

export default App;
