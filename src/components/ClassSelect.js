import styles from "../css/ClassSelect.module.css";
import facultiesData from "../data/faculties.json";
import classesData from "../data/classes.json";
import coursesData from "../data/courses.json";
import { getCourseID } from "../utils/generalUtils";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";
const ClassSelect = ({ selectedCourseID, addClass, selectedClasses }) => {
  const defaultQuery = {
    searchQuery: "",
    slots: "",
  };
  const [query, setQuery] = useState(defaultQuery);
  const [classesToDisplay, setClassesToDisplay] = useState([]);
  let filteredClasses = classesData.filter(
    (classData) => getCourseID(classData) === selectedCourseID
  );
  const getCourseTitle = (classData) => {
    const course = coursesData.find(
      (courseData) => getCourseID(courseData) === getCourseID(classData)
    );
    if (course !== undefined) return course["COURSE TITLE"];
  };
  const completeFilteredClasses = [];
  let filteredFaculties = facultiesData.filter((faculty) =>
    filteredClasses.find((classData) => {
      return classData["ERP ID"] === faculty["ERP ID"];
    })
  );
  for (const classData of filteredClasses) {
    for (const faculty of filteredFaculties) {
      if (classData["ERP ID"] === faculty["ERP ID"]) {
        completeFilteredClasses.push({
          ...classData,
          "EMPLOYEE NAME": faculty["EMPLOYEE NAME"],
          "COURSE TITLE": getCourseTitle(classData),
        });
        continue;
      }
    }
  }
  const availableSlots = new Set();
  for (const classData of completeFilteredClasses)
    availableSlots.add(classData["SLOT"]);

  const fuse = new Fuse(completeFilteredClasses, {
    keys: ["ERP ID", "EMPLOYEE NAME"],
    shouldSort: true,
    threshold: 0.2,
  });

  useEffect(() => {
    setQuery(defaultQuery);
  }, [selectedCourseID]);

  useEffect(() => {
    const results =
      query.searchQuery.length > 1
        ? fuse.search(query.searchQuery).map((result) => result.item)
        : completeFilteredClasses;
    setClassesToDisplay(
      results.filter(
        (completeFilteredClass) =>
          query.slots.length <= 1 ||
          completeFilteredClass["SLOT"] === query.slots
      )
    );
  }, [query]);

  const isTheoryComponent = (classData) => {
    return classData["COURSE TYPE"] === "ETH";
  };
  const isLabComponent = (classData) => {
    return classData["COURSE TYPE"] === "ELA";
  };
  const getLabComponent = (classData) => {
    if (!isTheoryComponent(classData)) return;
    // console.log(selectedClasses);
    return Object.keys(selectedClasses).find((courseID) => {
      return (
        courseID.startsWith(classData["COURSE CODE"]) &&
        courseID.endsWith("ELA")
      );
    });
  };

  const selectAllWith = (fieldName, value, courseID) => {
    const validClasses = classesData.filter(
      (classData) =>
        getCourseID(classData) === courseID && classData[fieldName] === value
    );
    validClasses.forEach((classData) => {
      if (classData["EMPLOYEE NAME"] === undefined) {
        const faculty = facultiesData.find(
          (faculty) => faculty["ERP ID"] === classData["ERP ID"]
        );
        classData["EMPLOYEE NAME"] = faculty["EMPLOYEE NAME"];
      }
      if (classData["COURSE TITLE"] === undefined) {
        const course = coursesData.find(
          (course) => course["COURSE CODE"] === classData["COURSE CODE"]
        );
        classData["COURSE TITLE"] = course["COURSE TITLE"];
      }
      addClass(classData, courseID);
    });
  };

  return (
    <div className={styles.container} id="class-selection-section">
      <div className={styles.queryRow} id="class-selection-query-row">
        <div className={styles.search}>
          <label
            htmlFor="faculty-search"
            className={`${styles.title} body1-bold`}
          >
            Search by Faculty
          </label>
          <input
            type="text"
            id="faculty-search"
            name="faculty-search"
            value={query.searchQuery}
            onInput={(e) => {
              setQuery((prevQuery) => {
                const obj = {};
                obj.slots = prevQuery.slots;
                obj.searchQuery = e.target.value;
                return obj;
              });
            }}
            placeholder="Eg. 14494 or AKHILA MAHESWARI M"
          />
        </div>
        <div className={styles.slots}>
          <label
            htmlFor="faculty-slots-filter"
            className={`${styles.title} body1-bold`}
          >
            Filter classes by slots
          </label>
          <select
            name="faculty-slots-filter"
            id="faculty-slots-filter"
            value={query.slots.length > 1 ? query.slots : ""}
            onChange={(e) =>
              setQuery((prevQuery) => {
                return {
                  slots: e.target.value,
                  searchQuery: prevQuery.searchQuery,
                };
              })
            }
          >
            <option value="">Any Slot</option>
            {Array.from(availableSlots)
              .sort((a, b) => {
                let result = 0;
                if (a.length > b.length) result += 5;
                else if (a.length < b.length) result -= 5;

                if (a > b) result += 1;
                else if (a < b) result -= 1;
                return result;
              })
              .map((slot) => {
                return (
                  <option value={slot} key={`faculty-filter-${slot}`}>
                    {slot}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
      <div className={styles.resultsWrapper}>
        <div className={styles.results}>
          {classesToDisplay
            .filter(
              (classData) =>
                selectedClasses[selectedCourseID]?.find(
                  (_classData) =>
                    classData["CLASS ID"] === _classData["CLASS ID"]
                ) === undefined
            )
            .sort((a, b) => {
              let result = 0;
              if (a["EMPLOYEE NAME"] > b["EMPLOYEE NAME"]) result += 10;
              else if (a["EMPLOYEE NAME"] < b["EMPLOYEE NAME"]) result -= 10;

              if (a["SLOT"].length > b["SLOT"].length) result += 5;
              else if (a["SLOT"].length < b["SLOT"].length) result -= 5;

              if (a["SLOT"] > b["SLOT"]) result += 1;
              else if (a["SLOT"] < b["SLOT"]) result -= 1;
              return result;
            })
            .map((classData) => {
              return (
                <div
                  className={`${styles.class} selectable-class`}
                  key={`class-select-${getCourseID(classData)}-${
                    classData["ERP ID"]
                  }-${classData["SLOT"]}-${classData["CLASS ID"]}`}
                >
                  <div className={`${styles.facultyName} body1-bold`}>
                    {classData["EMPLOYEE NAME"]}
                  </div>
                  <a
                    className={styles.add}
                    onClick={(e) => {
                      e.stopPropagation();
                      addClass(classData);
                      const labComponent = getLabComponent(classData);
                      if (labComponent === undefined) return;
                      selectAllWith(
                        "ERP ID",
                        classData["ERP ID"],
                        labComponent
                      );
                    }}
                  >
                    +
                  </a>
                  <div className={styles.erpId}>{classData["ERP ID"]}</div>
                  <div className={styles.classSlots}>
                    {classData["SLOT"]?.split("+").map((slot, index) => (
                      <>
                        {index !== 0 ? "+" : ""}
                        {slot}
                        <wbr />
                      </>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
export default ClassSelect;
