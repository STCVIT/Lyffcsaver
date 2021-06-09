import { useEffect, useState } from "react";
import styles from "../css/Options.module.css";
import AvailableCoursesList from "./AvailableCoursesList";
import FacultiesPreferenceList from "./FacultiesPreferenceList";
import SelectedCoursesList from "./SelectedCoursesList";
import BlacklistSlots from "./BlacklistSlots";
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
      {/* <div className={styles.row}>
        <div className={styles.option}>
          <label htmlFor="semester">
            <h2>Semester</h2>
          </label>
          <select className={styles.select} name="semester" id="semester">
            <option value="fal-sem-19">Fall Semester 2019-20</option>
            <option value="win-sem-19">Winter Semester 2019-20</option>
            <option value="fal-sem-20">Fall Semester 2020-21</option>
            <option value="win-sem-20">Winter Semester 2020-21</option>
          </select>
        </div>
        <div className={styles.option}>
          <label htmlFor="year">
            <h2>Year</h2>
          </label>
          <input
            type="number"
            id="year"
            min={new Date().getFullYear() - 5}
            max={new Date().getFullYear() + 1}
            step="1"
            defaultValue={new Date().getFullYear()}
            className={styles.input}
          />
        </div>
        <div className={styles.option}>
          <label htmlFor="branch">
            <h2>Branch</h2>
          </label>
          <select className={styles.select} name="branch" id="branch">
            <option value="cse-info-sec">CSE with Information Security</option>
            <option value="cse-info-sec">CSE with Information Security</option>
            <option value="cse-info-sec">CSE with Information Security</option>
          </select>
        </div>
        <div className={styles.option}>
          <label htmlFor="school">
            <h2>School</h2>
          </label>
          <select className={styles.select} name="school" id="school">
            <option value="scope">Scope</option>
            <option value="scope">Scope</option>
            <option value="scope">Scope</option>
          </select>
        </div>
      </div> */}
      <div className={styles.row}>
        <BlacklistSlots
          blacklistedSlots={blacklistedSlots}
          toggleBlacklist={toggleBlacklist}
        ></BlacklistSlots>
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
