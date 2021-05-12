import styles from "./css/App.module.css";
import Header from "./components/Header";
import Options from "./components/Options";
import { generateTimetables, getCourseID } from "./utils/generalUtils";

// // TODO: Make separate list components instead of just one that changes according to the props passed in
// TODO: Figure out how to work with timetables (slots, timings)
// TODO: Generate timetables based on preferences (generator function)
// TODO: Render timetables
// TODO: Reorder faculty list by dragging (react-beautiful-dnd)
// TODO: Add jsdoc wherever necessary

function App() {
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
