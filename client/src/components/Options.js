import { useEffect, useState } from "react";
import styles from "../css/Options.module.css";
import AvailableCoursesList from "./AvailableCoursesList";
import FacultiesPreferenceList from "./FacultiesPreferenceList";
import SelectedCoursesList from "./SelectedCoursesList";
import BlacklistSlots from "./BlacklistSlots";
import Instructions from "./Instructions";
import axios from "axios";
import { getCourseID } from "../utils/generalUtils";

const Options = ({ generateTimetables }) => {
  const ignoreCols = [
    "COURSE ID",
    "LECTURE HOURS",
    "TUTORIAL HOURS",
    "PROJECT HOURS",
    "PRACTICAL HOURS",
  ];
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState({});
  const [currentlySelectedCourseID, setCurrentlySelectedCourseID] =
    useState("");
  const [blacklistedSlots, setBlacklistedSlots] = useState([]);

  const toggleBlacklist = (slot) => {
    const pattern = /[A-Z]+\d+/;
    if (pattern.test(slot)) {
      if (blacklistedSlots.includes(slot)) {
        setBlacklistedSlots((prevBlacklistedSlots) =>
          prevBlacklistedSlots.filter(
            (slotToBeChecked) => slotToBeChecked !== slot
          )
        );
      } else {
        setBlacklistedSlots((prevBlacklistedSlots) => [
          ...prevBlacklistedSlots,
          slot,
        ]);
      }
    }
  };
  const addCourse = async (courseID) => {
    try {
      let res = await axios.get(`/courses?courseID=${courseID}`);
      if (res.data !== undefined) {
        const course = res.data;
        setSelectedCourses((prevSelectedCourses) => [
          ...prevSelectedCourses.filter(
            (prevCourse) => getCourseID(prevCourse) !== getCourseID(course)
          ),
          course,
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeCourse = (courseID) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.filter((course) => courseID !== getCourseID(course))
    );

    const newSelectedFaculties = selectedFaculties;
    delete newSelectedFaculties[courseID];
    setSelectedFaculties(newSelectedFaculties);
  };

  const selectCourse = (courseID) => {
    setCurrentlySelectedCourseID(courseID);
  };

  const deselectCourse = () => {
    setCurrentlySelectedCourseID("");
  };
  return (
    <div className={styles.screen}>
      <div className={styles.row}>
        <Instructions></Instructions>
        <AvailableCoursesList
          ignoreCols={ignoreCols}
          addCourse={addCourse}
          selectedCourses={selectedCourses}
          getCourseID={getCourseID}
        ></AvailableCoursesList>
        <SelectedCoursesList
          ignoreCols={ignoreCols}
          removeCourse={removeCourse}
          onSelect={selectCourse}
          onDeselect={deselectCourse}
          getCourseID={getCourseID}
          selectedCourses={selectedCourses}
        ></SelectedCoursesList>
        <FacultiesPreferenceList
          currentlySelectedCourseID={currentlySelectedCourseID}
          selectedFaculties={selectedFaculties}
          setSelectedFaculties={setSelectedFaculties}
          getCourseID={getCourseID}
          ignoreCols={ignoreCols}
        ></FacultiesPreferenceList>
        <BlacklistSlots
          blacklistedSlots={blacklistedSlots}
          toggleBlacklist={toggleBlacklist}
        ></BlacklistSlots>
      </div>
      <div className={styles.row}>
        <button
          className={styles.submitBtn}
          onClick={() => {
            generateTimetables(
              selectedCourses,
              selectedFaculties,
              blacklistedSlots
            );
          }}
        >
          Generate Timetables
        </button>
      </div>
    </div>
  );
};

export default Options;
