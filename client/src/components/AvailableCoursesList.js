import { useState, useRef, useCallback } from "react";
import useDataSearch from "../utils/useDataSearch";
import Searchbar from "./Searchbar";
import styles from "../css/AvailableCoursesList.module.css";
import InfoCols from "./InfoCols";
import { getCourseID } from "../utils/generalUtils";
const AvailableCoursesList = ({ ignoreCols, addCourse, selectedCourses }) => {
  // USING https://github.com/WebDevSimplified/React-Infinite-Scrolling/

  // console.log("rerendering available");

  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { data: courses, hasMore, loading, error } = useDataSearch(
    { query, pageNumber },
    "courses"
  );
  const isSelectedCourse = (course) => {
    const foundCourse = selectedCourses.find((courseToCheck) => {
      return getCourseID(courseToCheck) === getCourseID(course);
    });
    return foundCourse !== undefined;
  };
  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setPageNumber(1);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <h2>Available Courses</h2>
      </label>
      <Searchbar handleSearch={handleSearch}></Searchbar>
      <div className={styles.loading}>{loading && "Loading..."}</div>
      <div className={styles.error}>{error && "Error..."}</div>
      <div className={styles.tableWrapper}>
        <table className={styles.courseTable}>
          {courses.length > 0 ? (
            <>
              <thead>
                <tr className={styles.headRow}>
                  <th className={styles.cell} key="available-head-select"></th>
                  {Object.keys(courses[0]).map((key) => {
                    if (ignoreCols && !ignoreCols.includes(key))
                      return (
                        <th
                          className={styles.cell}
                          key={`available-head-${key}`}
                        >
                          {key}
                        </th>
                      );
                  })}
                </tr>
              </thead>

              <tbody>
                {courses.map((course, index) => {
                  if (
                    selectedCourses === undefined ||
                    (selectedCourses && !isSelectedCourse(course))
                  ) {
                    if (courses.length === index + 1) {
                      return (
                        <tr
                          ref={lastElementRef}
                          className={styles.row}
                          key={getCourseID(course)}
                        >
                          <td
                            className={styles.cell + " " + styles.add}
                            key={getCourseID(course) + "-I"}
                            data-courseid={getCourseID(course)}
                            onClick={(event) => {
                              addCourse(event.target.dataset.courseid);
                            }}
                          >
                            +
                          </td>
                          <InfoCols
                            entry={course}
                            getID={getCourseID}
                            styles={styles}
                            ignoreCols={ignoreCols}
                          ></InfoCols>
                        </tr>
                      );
                    } else {
                      return (
                        <tr className={styles.row} key={getCourseID(course)}>
                          <td
                            className={styles.cell + " " + styles.add}
                            key={getCourseID(course) + "-I"}
                            data-courseid={getCourseID(course)}
                            onClick={(event) => {
                              addCourse(event.target.dataset.courseid);
                            }}
                          >
                            +
                          </td>
                          <InfoCols
                            entry={course}
                            getID={getCourseID}
                            styles={styles}
                            ignoreCols={ignoreCols}
                          ></InfoCols>
                        </tr>
                      );
                    }
                  }
                })}
              </tbody>
            </>
          ) : (
            <tbody>
              <tr>
                <td>No Results</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default AvailableCoursesList;
