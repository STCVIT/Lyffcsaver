import { useEffect, useState } from "react";
import styles from "../css/Options.module.css";
import AvailableCoursesList from "./AvailableCoursesList";
import FacultiesPreferenceList from "./FacultiesPreferenceList";
import SelectedCoursesList from "./SelectedCoursesList";
import axios from "axios";

const Options = () => {
  const ignoreCols = [
    "LECTURE HOURS",
    "TUTORIAL HOURS",
    "PROJECT HOURS",
    "PRACTICAL HOURS",
  ];
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [
    currentlySelectedCourseCode,
    setCurrentlySelectedCourseCode,
  ] = useState("");
  const [selectedFaculties, setSelectedFaculties] = useState({});

  useEffect(() => {
    console.log("added courses", selectedCourses);
  }, [selectedCourses]);
  useEffect(() => {
    console.log("currently selected course", currentlySelectedCourseCode);
  }, [currentlySelectedCourseCode]);
  useEffect(() => {
    console.log("new selected faculties", selectedFaculties);
  }, [selectedFaculties]);

  const addCourse = async (courseCode) => {
    console.log(courseCode);
    try {
      let res = await axios.get(`/courses?courseCode=${courseCode}`);
      console.log(res.data);
      if (res.data !== undefined) {
        const course = res.data;
        setSelectedCourses((prevSelectedCourses) => [
          ...prevSelectedCourses.filter(
            (prevCourse) => prevCourse["COURSE CODE"] !== course["COURSE CODE"]
          ),
          course,
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeCourse = (courseCode) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.filter(
        (course) => courseCode !== course["COURSE CODE"]
      )
    );

    const newSelectedFaculties = selectedFaculties;
    delete newSelectedFaculties[courseCode];
    setSelectedFaculties(newSelectedFaculties);
  };

  const selectCourse = (courseCode) => {
    setCurrentlySelectedCourseCode(courseCode);
  };

  const deselectCourse = () => {
    setCurrentlySelectedCourseCode("");
  };
  return (
    <div className={styles.screen}>
      <div className={styles.row}>
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
      </div>
      <div className={styles.row}>
        <AvailableCoursesList
          ignoreCols={ignoreCols}
          addCourse={addCourse}
          selectedCourses={selectedCourses}
        ></AvailableCoursesList>
        <SelectedCoursesList
          ignoreCols={ignoreCols}
          removeCourse={removeCourse}
          onSelect={selectCourse}
          onDeselect={deselectCourse}
          selectedCourses={selectedCourses}
        ></SelectedCoursesList>
        <FacultiesPreferenceList
          currentlySelectedCourseCode={currentlySelectedCourseCode}
          selectedFaculties={selectedFaculties}
          setSelectedFaculties={setSelectedFaculties}
          ignoreCols={ignoreCols}
        ></FacultiesPreferenceList>
      </div>
      <div className={styles.row}>
        <button className={styles.submitBtn}>Generate Timetables</button>
      </div>
    </div>
  );
};

export default Options;
