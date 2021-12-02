import { useEffect, useState } from "react";
import styles from "../css/Options.module.css";
import ReserveSlots from "./ReserveSlots";
// import CampusToggle from "./CampusToggle";
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
  const [reserveView, setReserveView] = useState(1);

  useEffect(() => {
    setSelectedClasses((prevSelectedClasses) => {
      const obj = { ...prevSelectedClasses };
      stagedCourses.forEach((stagedCourse) => {
        const courseID = getCourseID(stagedCourse);
        if (obj[courseID] === undefined && !isProject(courseID))
          obj[courseID] = [];
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
  const stageCourse = (course, select = true) => {
    setStagedCourses((prevSelectedCourses) => [
      ...prevSelectedCourses.filter(
        (prevCourse) => getCourseID(prevCourse) !== getCourseID(course)
      ),
      course,
    ]);
    if (select) selectCourse(course);
  };

  const unstageCourse = (object) => {
    let courseID;
    if (typeof object === "string") courseID = object;
    else courseID = getCourseID(object);
    setStagedCourses((prevSelectedCourses) =>
      prevSelectedCourses.filter((course) => courseID !== getCourseID(course))
    );
  };
  const isProject = (courseID) => {
    return courseID.endsWith("PJT") || courseID.endsWith("EPJ");
  };

  const hasSelectedClasses = (courseID) => {
    return selectedClasses[courseID]?.length > 0;
  };

  /**
   * Select course and allow user to select faculties for that course
   *
   * @param {string|object} object Course ID or Course Data object
   * @returns undefined
   */
  const selectCourse = (object) => {
    let courseID;
    if (typeof object === "string") courseID = object;
    else courseID = getCourseID(object);
    console.log(courseID);
    if (isProject(courseID)) return;
    setCurrentlySelectedCourseID(courseID);
  };

  const deselectCourse = (object) => {
    let courseID;
    if (typeof object === "string") courseID = object;
    else courseID = getCourseID(object);
    if (courseID === currentlySelectedCourseID || courseID === undefined)
      setCurrentlySelectedCourseID("");
  };

  const addClass = (classData, courseID = currentlySelectedCourseID) => {
    console.log(classData, courseID);
    // if(classData["EMPLOYEE NAME"] === undefined)
    setSelectedClasses((prevSelectedClasses) => {
      const obj = { ...prevSelectedClasses };
      if (obj[courseID] === undefined) obj[courseID] = [];
      if (
        obj[courseID].find(
          (_classData) => _classData["CLASS ID"] === classData["CLASS ID"]
        ) === undefined
      )
        obj[courseID].push(classData);
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

  return (
      <>
          {/* <CampusToggle></CampusToggle> */}
          <div
              className={`${styles.sectionTitle} heading2`}
              id="reserve-slots-section"
          >
              <div className={styles.left_btns}>
                  <a
                      className={`${styles.btn} body1-medium`}
                      onClick={() => {
                          setReserveView(
                              (prevReserveView) => (prevReserveView + 1) % 2
                          );
                      }}
                  >
                      Change View
                  </a>
              </div>
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
                      // href="#add-courses-section"
                      onClick={() => {
                          document
                              .getElementById("add-courses-section")
                              ?.scrollIntoView({
                                  behavior: "smooth",
                              });
                      }}
                  >
                      Skip
                  </a>
              </div>
          </div>

          <ReserveSlots
              reservedSlots={reservedSlots}
              toggleReserve={toggleReserve}
              view={reserveView}
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
                  isProject={isProject}
                  hasSelectedClasses={hasSelectedClasses}
              ></CourseSelect>
              <ClassPreference
                  classes={selectedClasses[currentlySelectedCourseID]}
                  removeClass={removeClass}
                  setReorderedClasses={setReorderedClasses}
                  selectedCourseID={currentlySelectedCourseID}
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
              id="generate-timetables"
              clickedCallback={async () => {
                  const result = await generateTimetables(
                      selectedClasses,
                      reservedSlots
                  );
                  selectSlots([]);
                  // console.log(error);

                  // if(error !== undefined)
                  let error, data;
                  if (result?.error !== undefined) {
                      error = result.error;
                      data = result.data;
                  }
                  if (error === "NO_CLASSES") {
                      document
                          .querySelector("#add-courses-section")
                          ?.scrollIntoView({ behavior: "smooth" });
                      if (data !== undefined) selectCourse(data[0]);
                  } else if (error === "NO_COURSES")
                      document
                          .querySelector("#add-courses-section")
                          ?.scrollIntoView({ behavior: "smooth" });
                  else if (error === undefined)
                      document
                          .querySelector("#timetable-previews")
                          ?.scrollIntoView({ behavior: "smooth" });
              }}
          >
              Generate Timetables
          </Button>
      </>
  );
};

export default Options;
