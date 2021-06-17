import Header from "./Header";
import Options from "./Options";
import TimetablesSection from "./TimetablesSection";
import { getTimetables, getCourseID } from "../utils/generalUtils";
import { useEffect, useState } from "react";
import { ReactComponent as QuarterEllipse } from "../assets/quarterEllipse.svg";
import styles from "../css/Main.module.css";
const Main = ({ logoVariant }) => {
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
    <div className={styles.appContainer}>
      <QuarterEllipse className={styles.ellipse}></QuarterEllipse>
      <Header logoVariant={logoVariant} />
      <Options
        getCourseID={getCourseID}
        generateTimetables={populateAllSchedules}
      />
      <TimetablesSection
        schedules={allSchedules}
        faculties={faculties}
      ></TimetablesSection>
    </div>
  );
};

export default Main;