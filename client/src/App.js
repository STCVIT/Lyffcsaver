import styles from "./css/App.module.css";
import Header from "./components/Header";
import Options from "./components/Options";
import TimetablesSection from "./components/TimetablesSection";
import { getTimetables, getCourseID } from "./utils/generalUtils";
import { useEffect, useState } from "react";

// // TODO: Make separate list components instead of just one that changes according to the props passed in
// // TODO: Generate timetables based on preferences (generator function)
// // TODO: Figure out how to work with timetables (slots, timings)
// TODO: Render timetables
// TODO: Add jsdoc wherever necessary
// TODO: Reorder faculty list by dragging (react-beautiful-dnd)

function App() {
  // const [startIndex, setStartIndex] = useState(0);
  // const size = 50;
  // const [
  //   slotCollectionsToBeRendered,
  //   setSlotCollectionsToBeRendered,
  // ] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const populateAllSchedules = async (courses, faculties) => {
    setAllSchedules([]);
    setAllSchedules(await getTimetables(courses, faculties));
  };

  useEffect(() => {
    console.log("all schedules", allSchedules);
    if (Object.keys(allSchedules).length > 0) {
      let element = document.getElementById("screen2");
      console.log(element);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allSchedules]);

  // const addSlotCollectionsToBeRendered = () => {
  //   if (allSchedules.length > 0) {
  //     let schedules = Object.keys(allSchedules).slice(
  //       startIndex,
  //       startIndex + size
  //     );
  //     setSlotCollectionsToBeRendered((prevSlotCollectionsToBeRendered) => [
  //       ...prevSlotCollectionsToBeRendered,
  //       ...schedules,
  //     ]);
  //   }
  // };
  // addSlotCollectionsToBeRendered();

  // const renderMore = () => {
  //   setStartIndex((prevStartIndex) => prevStartIndex + size);
  // };

  return (
    <>
      <Header />
      <Options
        getCourseID={getCourseID}
        generateTimetables={populateAllSchedules}
      />
      <TimetablesSection schedules={allSchedules}></TimetablesSection>
    </>
  );
}

export default App;
