import { useState, useRef, useCallback } from "react";
import useDataSearch from "../utils/useDataSearch";
import Searchbar from "./Searchbar";
import styles from "../css/AvailableCoursesList.module.css";
import { getCourseID } from "../utils/generalUtils";
const AvailableCoursesList = ({ addCourse, selectedCourses }) => {
  // USING https://github.com/WebDevSimplified/React-Infinite-Scrolling/

  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const {
    data: courses,
    hasMore,
    loading,
    error,
  } = useDataSearch({ query, pageNumber }, "courses");
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
      <div className={styles.header}>
        <Searchbar
          handleSearch={handleSearch}
          text="Search courses..."
        ></Searchbar>
      </div>
      <div className={styles.body}>
        {courses.length === 0 && !loading && !error ? (
          <div className={styles.error}>No Results</div>
        ) : (
          courses.map((course, index) => {
            if (
              selectedCourses === undefined ||
              (selectedCourses && !isSelectedCourse(course))
            ) {
              if (courses.length === index + 1) {
                return (
                  <div
                    ref={lastElementRef}
                    className={styles.card}
                    key={getCourseID(course)}
                    data-courseid={getCourseID(course)}
                    onClick={(event) => {
                      let current = event.target;
                      while (
                        current.parentElement !== null &&
                        !current.classList.contains(styles.card)
                      )
                        current = current.parentElement;
                      if (
                        current.parentElement !== null &&
                        current.dataset.courseid !== undefined
                      )
                        addCourse(current.dataset.courseid);
                    }}
                  >
                    <div className={styles.courseTitle}>
                      <strong>{course["COURSE TITLE"]}</strong>
                    </div>
                    <div className={styles.courseCode}>
                      {course["COURSE CODE"]}
                    </div>
                    <div className={styles.courseType}>
                      {course["COURSE TYPE"]}
                    </div>
                    <div className={styles.courseOwner}>
                      {course["COURSE OWNER"]}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    className={styles.card}
                    key={getCourseID(course)}
                    data-courseid={getCourseID(course)}
                    onClick={(event) => {
                      let current = event.target;
                      while (
                        current.parentElement !== null &&
                        !current.classList.contains(styles.card)
                      )
                        current = current.parentElement;
                      if (
                        current.parentElement !== null &&
                        current.dataset.courseid !== undefined
                      )
                        addCourse(current.dataset.courseid);
                    }}
                  >
                    <div
                      className={`${styles.courseTitle} ${styles.courseInfo}`}
                    >
                      <strong>{course["COURSE TITLE"]}</strong>
                    </div>
                    <div
                      className={`${styles.courseCode} ${styles.courseInfo}`}
                    >
                      {course["COURSE CODE"]}
                    </div>
                    <div
                      className={`${styles.courseType} ${styles.courseInfo}`}
                    >
                      {course["COURSE TYPE"]}
                    </div>
                    <div
                      className={`${styles.courseOwner} ${styles.courseInfo}`}
                    >
                      {course["COURSE OWNER"]}
                    </div>
                  </div>
                );
              }
            }
          })
        )}
        <div className={styles.loading}>{loading && "Loading..."}</div>
        <div className={styles.error}>{error && "Error..."}</div>
      </div>
    </div>
  );
};

export default AvailableCoursesList;
