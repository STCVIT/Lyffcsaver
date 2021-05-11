import { useEffect, useState } from "react";
import styles from "../css/Options.module.css";
import SearchableList from "./SearchableList";
import AvailableCoursesList from "./AvailableCoursesList";
import FacultiesPreferenceList from "./FacultiesPreferenceList";
import SelectedCoursesList from "./SelectedCoursesList";
import axios from "axios";
const Options = () => {
  // const courses = [
  //   {
  //     courseCode: "MAT1014",
  //     courseName: "Discrete Mathematics and Graph Theory",
  //     id: "c1",
  //     faculties: [
  //       { index: 0, id: "f1", preferenceScore: 0 },
  //       { index: 1, id: "f2", preferenceScore: 0 },
  //       { index: 2, id: "f3", preferenceScore: 0 },
  //       { index: 3, id: "f4", preferenceScore: 0 },
  //       { index: 4, id: "f6", preferenceScore: 0 },
  //     ],
  //   },
  //   {
  //     courseCode: "MAT2001",
  //     courseName: "Statistics for Engineers",
  //     id: "c2",
  //     faculties: [
  //       { index: 1, id: "f1", preferenceScore: 0 },
  //       { index: 0, id: "f2", preferenceScore: 0 },
  //       { index: 2, id: "f3", preferenceScore: 0 },
  //       { index: 3, id: "f4", preferenceScore: 0 },
  //     ],
  //   },
  //   {
  //     courseCode: "CSE1002",
  //     courseName: "Problem solving and Programming",
  //     id: "c3",
  //     faculties: [
  //       { index: 0, id: "f1", preferenceScore: 0 },
  //       { index: 1, id: "f2", preferenceScore: 0 },
  //       { index: 2, id: "f3", preferenceScore: 0 },
  //     ],
  //   },
  //   {
  //     courseCode: "CHY1701",
  //     courseName: "Engineering Chemistry",
  //     id: "c4",
  //     faculties: [
  //       { index: 0, id: "f1", preferenceScore: 0 },
  //       { index: 1, id: "f3", preferenceScore: 0 },
  //       { index: 2, id: "f4", preferenceScore: 0 },
  //     ],
  //   },
  //   {
  //     courseCode: "CSE1003",
  //     courseName: "Digital Logic and Design",
  //     id: "c5",
  //     faculties: [
  //       { index: 0, id: "f1", preferenceScore: 0 },
  //       { index: 1, id: "f5", preferenceScore: 0 },
  //       { index: 2, id: "f3", preferenceScore: 0 },
  //       { index: 3, id: "f4", preferenceScore: 0 },
  //     ],
  //   },
  //   {
  //     courseCode: "CSE2011",
  //     courseName: "Data Structures and Algorithms",
  //     id: "c6",
  //     faculties: [
  //       { index: 0, id: "f1", preferenceScore: 0 },
  //       { index: 1, id: "f2", preferenceScore: 0 },
  //       { index: 2, id: "f3", preferenceScore: 0 },
  //       { index: 3, id: "f6", preferenceScore: 0 },
  //     ],
  //   },
  // ];
  // const faculties = [
  //   { name: "Clement J", id: "f1" },
  //   { name: "Manimaran A", id: "f2" },
  //   { name: "Bhulakshmi", id: "f3" },
  //   { name: "Uma", id: "f4" },
  //   { name: "Akhila M", id: "f5" },
  //   { name: "Sharief", id: "f6" },
  // ];
  // let classes;

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
  const [availableCourses, setAvailableCourses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    console.log(selectedCourses);
  }, [selectedCourses]);
  useEffect(() => {
    console.log(currentlySelectedCourseCode);
  }, [currentlySelectedCourseCode]);

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
          ignoreCols={ignoreCols}
        ></FacultiesPreferenceList>
        {/* <SearchableList
          name={"Available Courses"}
          values={availableCourses}
          listType="add"
          onAdd={addCourse}
        ></SearchableList>
        <SearchableList
          name={"Selected Courses"}
          values={selectedCourses}
          listType="remove"
          onRemove={removeCourse}
          onSelect={populateFacultyList}
        ></SearchableList>
        <SearchableList
          name="Faculty Preference"
          values={facultyList}
          listType="ranked"
        ></SearchableList> */}
      </div>
      <div className={styles.row}>
        <button className={styles.submitBtn}>Generate Timetables</button>
      </div>
    </div>
  );

  // const getById = (elements, id) => {
  //   return elements.find((element) => element.id === id);
  // };
  // const getCourseByCourseCode = (courseCode) => {
  //   return courses.find((course) => course.courseCode === courseCode);
  // };

  // const addCourse = (id, activeRowClassName) => {
  //   const course = availableCourses.find((element) => element.id === id);
  //   if (course === undefined) return;
  //   setSelectedCourses((prevSelectedCourses) => [
  //     ...prevSelectedCourses,
  //     course,
  //   ]);
  //   setAvailableCourses((prevAvailableCourses) =>
  //     prevAvailableCourses.filter((element) => element !== course)
  //   );
  //   populateFacultyList(activeRowClassName);
  // };
  // const removeCourse = (id, activeRowClassName) => {
  //   const course = selectedCourses.find((element) => element.id === id);
  //   if (course === undefined) return;
  //   setAvailableCourses((prevAvailableCourses) => [
  //     ...prevAvailableCourses,
  //     course,
  //   ]);
  //   setSelectedCourses((prevSelectedCourses) =>
  //     prevSelectedCourses.filter((element) => element !== course)
  //   );

  //   const activeRow = document.querySelector(`.${activeRowClassName}`);
  //   if (activeRow === null) {
  //     return;
  //   }
  //   const courseCode = activeRow.children[1].innerText;
  //   if (courseCode === course.courseCode) {
  //     // course being removed from selectedCourses was the one selected
  //     // and shown in faculty list, therefore faculty list has to be cleared.
  //     populateFacultyList();
  //   }
  // };
  // const populateFacultyList = (activeRowClassName) => {
  //   if (activeRowClassName === undefined) {
  //     setFacultyList([]);
  //     return;
  //   }
  //   const activeRow = document.querySelector(`.${activeRowClassName}`);
  //   if (activeRow === null) {
  //     setFacultyList([]);
  //     return;
  //   }
  //   const courseCode = activeRow.children[1].innerText;
  //   const course = getCourseByCourseCode(courseCode);
  //   const newFacultyList = [];
  //   course.faculties.sort((a, b) => a.index - b.index);
  //   course.faculties.forEach((facultyInfo) => {
  //     const faculty = getById(faculties, facultyInfo.id);
  //     newFacultyList.push(faculty);
  //   });
  //   setFacultyList(newFacultyList);
  // };
};

export default Options;
