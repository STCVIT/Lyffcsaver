import { useEffect, useState } from "react";
import styles from "../css/Options.module.css";
import AvailableCoursesList from "./AvailableCoursesList";
import FacultiesPreferenceList from "./FacultiesPreferenceList";
import SelectedCoursesList from "./SelectedCoursesList";
import ReserveSlots from "./ReserveSlots";
import Instructions from "./Instructions";
import InitialSelect from "./InitialSelect";
import axios from "axios";
import { getCourseID } from "../utils/generalUtils";

const Options = ({ generateTimetables }) => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState({});
  const [currentlySelectedCourseID, setCurrentlySelectedCourseID] =
    useState("");
  const [reservedSlots, setReservedSlots] = useState([]);
  useEffect(() => {
    console.log({ currentlySelectedCourseID });
  }, [currentlySelectedCourseID]);
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

  const deselectCourse = (courseID) => {
    if (courseID === currentlySelectedCourseID || courseID === undefined)
      setCurrentlySelectedCourseID("");
  };
  return (
    <div className={styles.screen}>
      <div className={styles.row}>
        <Instructions></Instructions>
        <InitialSelect></InitialSelect>
      </div>
      <div className={styles.row}>
        <AvailableCoursesList
          addCourse={addCourse}
          selectedCourses={selectedCourses}
          getCourseID={getCourseID}
        ></AvailableCoursesList>
        <SelectedCoursesList
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
        ></FacultiesPreferenceList>
      </div>
      <div className={styles.row}>
        <ReserveSlots
          reservedSlots={reservedSlots}
          toggleReserve={toggleReserve}
        ></ReserveSlots>
      </div>
      <div className={styles.row}>
        <button
          className={styles.submitBtn}
          onClick={() => {
            generateTimetables(
              selectedCourses,
              selectedFaculties,
              reservedSlots
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
