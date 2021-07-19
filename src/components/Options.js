import { useEffect, useState } from "react";
import styles from "../css/Options.module.css";
import ReserveSlots from "./ReserveSlots";
import CampusToggle from "./CampusToggle";
import CourseSelect from "./CourseSelect";
import ClassPreference from "./ClassPreference";
import ClassSelect from "./ClassSelect";
import Button from "./Button";
import { getCourseID } from "../utils/generalUtils";

const Options = ({ generateTimetables, selectSlots }) => {
  const [reservedSlots, setReservedSlots] = useState([]);

  const [stagedCourses, setStagedCourses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState({});
  const [currentlySelectedCourseID, setCurrentlySelectedCourseID] =
    useState("");

  useEffect(() => {
    console.log(selectedClasses);
  }, [selectedClasses]);
  useEffect(() => {
    setSelectedClasses((prevSelectedClasses) => {
      const obj = { ...prevSelectedClasses };
      stagedCourses.forEach((stagedCourse) => {
        const courseID = getCourseID(stagedCourse);
        if (obj[courseID] === undefined) obj[courseID] = [];
      });
      const courseIDs = Object.keys(obj);
      courseIDs.forEach((courseID) => {
        if (
          stagedCourses.find((course) => getCourseID(course) === courseID) ===
          undefined
        )
          delete obj[courseID];
      });
      return obj;
    });
  }, [stagedCourses]);

  const toggleReserve = (slot) => {
    const pattern = /[A-Z]+\d+/;
    if (pattern.test(slot)) {
      if (reservedSlots.includes(slot)) {
        setReservedSlots((prevReservedSlots) =>
          prevReservedSlots.filter(
            (slotToBeChecked) => slotToBeChecked !== slot
          )
        );
      } else {
        setReservedSlots((prevReservedSlots) => [...prevReservedSlots, slot]);
      }
    }
  };
  const stageCourse = (course) => {
    setStagedCourses((prevSelectedCourses) => [
      ...prevSelectedCourses.filter(
        (prevCourse) => getCourseID(prevCourse) !== getCourseID(course)
      ),
      course,
    ]);
    setCurrentlySelectedCourseID(getCourseID(course));
  };

  const unstageCourse = (object) => {
    let courseID;
    if (typeof object === "string") courseID = object;
    else courseID = getCourseID(object);
    setStagedCourses((prevSelectedCourses) =>
      prevSelectedCourses.filter((course) => courseID !== getCourseID(course))
    );
  };

  const selectCourse = (object) => {
    let courseID;
    if (typeof object === "string") courseID = object;
    else courseID = getCourseID(object);
    setCurrentlySelectedCourseID(courseID);
  };

  const deselectCourse = (object) => {
    let courseID;
    if (typeof object === "string") courseID = object;
    else courseID = getCourseID(object);
    if (courseID === currentlySelectedCourseID || courseID === undefined)
      setCurrentlySelectedCourseID("");
  };

  const addClass = (classData) => {
    setSelectedClasses((prevSelectedClasses) => {
      const obj = { ...prevSelectedClasses };
      if (obj[currentlySelectedCourseID] === undefined)
        obj[currentlySelectedCourseID] = [];
      if (
        obj[currentlySelectedCourseID].find(
          (_classData) => _classData["CLASS ID"] === classData["CLASS ID"]
        ) === undefined
      )
        obj[currentlySelectedCourseID].push(classData);
      return obj;
    });
  };

  const removeClass = (classData) => {
    setSelectedClasses((prevSelectedClasses) => {
      const obj = { ...prevSelectedClasses };
      obj[currentlySelectedCourseID] = obj[currentlySelectedCourseID].filter(
        (_classData) => classData["CLASS ID"] !== _classData["CLASS ID"]
      );
      return obj;
    });
  };

  const setReorderedClasses = (reorderedClasses) => {
    setSelectedClasses((prevSelectedClasses) => {
      const obj = { ...prevSelectedClasses };
      obj[currentlySelectedCourseID] = reorderedClasses;
      return obj;
    });
  };

  // const finalizeAll = () => {

  // }

  return (
    <>
      <CampusToggle></CampusToggle>
      <div
        className={`${styles.sectionTitle} heading2`}
        id="reserve-slots-section"
      >
        <div className={styles.title}>Reserve your Slots</div>
        <div className={styles.btns}>
          <a
            className={`${styles.btn} body1-medium`}
            onClick={() => {
              reservedSlots.forEach((slot) => toggleReserve(slot));
            }}
          >
            Clear
          </a>
          <a
            className={`${styles.btn} body1-medium`}
            href="#add-courses-section"
          >
            Skip
          </a>
        </div>
      </div>

      <ReserveSlots
        reservedSlots={reservedSlots}
        toggleReserve={toggleReserve}
      ></ReserveSlots>
      <div
        className={`${styles.sectionTitle} heading2`}
        id="add-courses-section"
      >
        <div className={styles.title}>Add courses</div>
      </div>

      <div className={styles.coursePreferences}>
        <CourseSelect
          stageCourse={stageCourse}
          unstageCourse={unstageCourse}
          getCourseID={getCourseID}
          stagedCourses={stagedCourses}
          selectCourse={selectCourse}
          deselectCourse={deselectCourse}
          selectedCourseID={currentlySelectedCourseID}
        ></CourseSelect>
        <ClassPreference
          classes={selectedClasses[currentlySelectedCourseID]}
          removeClass={removeClass}
          setReorderedClasses={setReorderedClasses}
        ></ClassPreference>
      </div>
      <ClassSelect
        selectedCourseID={currentlySelectedCourseID}
        addClass={addClass}
        selectedClasses={selectedClasses}
      ></ClassSelect>
      <Button
        classes={styles.generateTimetablesButton}
        type="primary"
        onClick={async () => {
          await generateTimetables(selectedClasses, reservedSlots);
          selectSlots([]);
          document
            .querySelector("#timetable-previews")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Generate Timetables
      </Button>
    </>
  );
  // return (
  // <div className={styles.screen}>
  //   <div className={styles.row}>
  //     <Instructions></Instructions>
  //     <InitialSelect></InitialSelect>
  //   </div>
  //   {/* <div className={styles.selectionTablesRow}> */}
  //   <div className={styles.row}>
  //     <AvailableCoursesList
  //       addCourse={addCourse}
  //       selectedCourses={selectedCourses}
  //       getCourseID={getCourseID}
  //     ></AvailableCoursesList>
  //     <SelectedCoursesList
  //       removeCourse={removeCourse}
  //       onSelect={selectCourse}
  //       onDeselect={deselectCourse}
  //       getCourseID={getCourseID}
  //       selectedCourses={selectedCourses}
  //     ></SelectedCoursesList>
  //     <FacultiesPreferenceList
  //       currentlySelectedCourseID={currentlySelectedCourseID}
  //       selectedFaculties={selectedFaculties}
  //       setSelectedFaculties={setSelectedFaculties}
  //       getCourseID={getCourseID}
  //     ></FacultiesPreferenceList>
  //   </div>
  //   <div className={styles.row}>
  //     <ReserveSlots
  //       reservedSlots={reservedSlots}
  //       toggleReserve={toggleReserve}
  //     ></ReserveSlots>
  //   </div>
  //   <div className={styles.row}>
  //     <button
  //       className={styles.submitBtn}
  //       onClick={async () => {
  //         console.log("CLICKED");
  //         await generateTimetables(
  //           selectedCourses,
  //           selectedFaculties,
  //           reservedSlots
  //         );
  //         selectSlots([]);
  //         document
  //           .querySelector("#timetable-previews")
  //           ?.scrollIntoView({ behavior: "smooth" });
  //       }}
  //     >
  //       Generate Timetables
  //     </button>
  //   </div>
  // </div>
  // );
};

export default Options;