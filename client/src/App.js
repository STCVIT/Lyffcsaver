import styles from "./css/App.module.css";
import Header from "./components/Header";
import Options from "./components/Options";
import axios from "axios";

// // TODO: Make separate list components instead of just one that changes according to the props passed in
// TODO: Figure out how to work with timetables (slots, timings)
// TODO: Generate timetables based on preferences (generator function)
// TODO: Render timetables
// TODO: Reorder faculty list by dragging (react-beautiful-dnd)
// TODO: Add jsdoc wherever necessary

function App() {
  const getCourseID = (course) => {
    return `${course["COURSE CODE"]}-${course["COURSE TYPE"]}`;
  };

  const generateTimetables = (courses, faculties) => {
    console.log(courses, faculties);
    const unsetCourses = [];
    courses.forEach((course) => {
      if (faculties[getCourseID(course)] === undefined)
        unsetCourses.push(getCourseID(course));
    });
    if (unsetCourses.length > 0) {
      alert(
        `Please select at least one faculty for each course.
        Courses with no faculties set yet: ${unsetCourses.join(", ")}`
      );
      return;
    }
  };
  return (
    <>
      <Header />
      <Options
        getCourseID={getCourseID}
        generateTimetables={generateTimetables}
      />
    </>
  );
}

export default App;
