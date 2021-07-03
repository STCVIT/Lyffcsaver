import { useState, useRef, useCallback } from "react";
import useDataSearch from "../utils/useDataSearch";
import Searchbar from "./Searchbar";
import styles from "../css/AvailableCoursesList.module.css";
import InfoCols from "./InfoCols";
import { getCourseID } from "../utils/generalUtils";
const AvailableCoursesList = ({ ignoreCols, addCourse, selectedCourses }) => {
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
  const columnKeys = [];

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setPageNumber(1);
  };
  const colsHeadings = () => {
    columnKeys.length = 0;
    let numOfCols = 0;
    Object.keys(courses[0]).map((key) => {
      if (ignoreCols && !ignoreCols.includes(key)) {
        numOfCols++;
        // columnKeys.push(key);
        // return (
        //   <th className={styles.cell} key={`available-head-${key}`}>
        //     {key}
        //   </th>
        // );
      }
    });
    return (
      <th colSpan={numOfCols}>
        <Searchbar handleSearch={handleSearch}></Searchbar>
      </th>
    );
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
        <div className={styles.loading}>{loading && "Loading..."}</div>
        <div className={styles.error}>{error && "Error..."}</div>
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
            // if (
            //   selectedCourses === undefined ||
            //   (selectedCourses && !isSelectedCourse(course))
            // ) {
            //   if (courses.length === index + 1) {
            //     return (
            //       <tr
            //         ref={lastElementRef}
            //         className={styles.row}
            //         key={getCourseID(course)}
            //       >
            //         <td
            //           className={styles.cell + " " + styles.add}
            //           key={getCourseID(course) + "-I"}
            //           data-courseid={getCourseID(course)}
            //           onClick={(event) => {
            //             addCourse(event.target.dataset.courseid);
            //           }}
            //         >
            //           +
            //         </td>
            //         <InfoCols
            //           keys={columnKeys}
            //           entry={course}
            //           getID={getCourseID}
            //           styles={styles}
            //           ignoreCols={ignoreCols}
            //         ></InfoCols>
            //       </tr>
            //     );
            //   } else {
            //     return (
            //       <tr className={styles.row} key={getCourseID(course)}>
            //         <td
            //           className={styles.cell + " " + styles.add}
            //           key={getCourseID(course) + "-I"}
            //           data-courseid={getCourseID(course)}
            //           onClick={(event) => {
            //             addCourse(event.target.dataset.courseid);
            //           }}
            //         >
            //           +
            //         </td>
            //         <InfoCols
            //           keys={columnKeys}
            //           entry={course}
            //           getID={getCourseID}
            //           styles={styles}
            //           ignoreCols={ignoreCols}
            //         ></InfoCols>
            //       </tr>
            //     );
            //   }
            // }
          })
        )}
      </div>
    </div>
  );

  // return (
  //   <div className={styles.container}>
  //     <label className={styles.label}>
  //       <h2>Available Courses</h2>
  //     </label>
  //     <div className={styles.loading}>{loading && "Loading..."}</div>
  //     <div className={styles.error}>{error && "Error..."}</div>
  //     <div className={styles.tableWrapper}>
  //       <table className={styles.courseTable}>
  //         {courses.length > 0 ? (
  //           <>
  //             <thead>
  //               <tr className={styles.headRow}>
  //                 <th className={styles.cell} key="available-head-select"></th>
  //                 {colsHeadings()}
  //               </tr>
  //             </thead>

  //             <tbody>
  //               {courses.map((course, index) => {
  //                 if (
  //                   selectedCourses === undefined ||
  //                   (selectedCourses && !isSelectedCourse(course))
  //                 ) {
  //                   if (courses.length === index + 1) {
  //                     return (
  //                       <tr
  //                         ref={lastElementRef}
  //                         className={styles.row}
  //                         key={getCourseID(course)}
  //                       >
  //                         {/* <td
  //                           className={styles.cell + " " + styles.add}
  //                           key={getCourseID(course) + "-I"}
  //                           data-courseid={getCourseID(course)}
  //                           onClick={(event) => {
  //                             addCourse(event.target.dataset.courseid);
  //                           }}
  //                         >
  //                           +
  //                         </td> */}
  //                         <InfoCols
  //                           keys={columnKeys}
  //                           entry={course}
  //                           getID={getCourseID}
  //                           styles={styles}
  //                           ignoreCols={ignoreCols}
  //                         ></InfoCols>
  //                       </tr>
  //                     );
  //                   } else {
  //                     return (
  //                       <tr className={styles.row} key={getCourseID(course)}>
  //                         {/* <td
  //                           className={styles.cell + " " + styles.add}
  //                           key={getCourseID(course) + "-I"}
  //                           data-courseid={getCourseID(course)}
  //                           onClick={(event) => {
  //                             addCourse(event.target.dataset.courseid);
  //                           }}
  //                         >
  //                           +
  //                         </td> */}
  //                         <InfoCols
  //                           keys={columnKeys}
  //                           entry={course}
  //                           getID={getCourseID}
  //                           styles={styles}
  //                           ignoreCols={ignoreCols}
  //                         ></InfoCols>
  //                       </tr>
  //                     );
  //                   }
  //                 }
  //               })}
  //             </tbody>
  //           </>
  //         ) : (
  //           <tbody>
  //             <tr>
  //               <td>No Results</td>
  //             </tr>
  //           </tbody>
  //         )}
  //       </table>
  //     </div>
  //   </div>
  // );
};

export default AvailableCoursesList;
