import { useState, useRef, useCallback } from "react";
import useCourseSearch from "../utils/useCourseSearch";
import Searchbar from "./Searchbar";
import styles from "../css/AvailableCoursesList.module.css";
import InfoCols from "./InfoCols";

const AvailableCoursesList = () => {
  // USING https://github.com/WebDevSimplified/React-Infinite-Scrolling/
  // const [availableCourses, setAvailableCourses] = useState([])
  const ignoreCols = [
    "LECTURE HOURS",
    "TUTORIAL HOURS",
    "PROJECT HOURS",
    "PRACTICAL HOURS",
  ];

  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { courses, hasMore, loading, error } = useCourseSearch(
    query,
    pageNumber
  );

  const observer = useRef();
  const lastCourseElementRef = useCallback(
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
                  if (courses.length === index + 1) {
                    return (
                      <tr
                        ref={lastCourseElementRef}
                        className={styles.row + " last"}
                        key={course["COURSE CODE"]}
                      >
                        <td
                          className={styles.cell + " " + styles.add}
                          key={course["COURSE CODE"] + "-I"}
                        >
                          +
                        </td>
                        <InfoCols
                          entry={course}
                          idName="COURSE CODE"
                          styles={styles}
                          ignoreCols={ignoreCols}
                        ></InfoCols>
                      </tr>
                    );
                  } else {
                    return (
                      <tr className={styles.row} key={course["COURSE CODE"]}>
                        <td
                          className={styles.cell + " " + styles.add}
                          key={course["COURSE CODE"] + "-I"}
                        >
                          +
                        </td>
                        <InfoCols
                          entry={course}
                          idName="COURSE CODE"
                          styles={styles}
                          ignoreCols={ignoreCols}
                        ></InfoCols>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </>
          ) : (
            <>NO RESULTS</>
          )}
        </table>
      </div>
    </div>
  );
};

export default AvailableCoursesList;
