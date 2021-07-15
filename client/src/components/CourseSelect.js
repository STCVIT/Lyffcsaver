import styles from "../css/CourseSelect.module.css";
import Searchbar from "./Searchbar";
import coursesData from "../data/courses.json";

const CourseSelect = ({
  addCourse,
  removeCourse,
  selectedCourses,
  getCourseID,
}) => {
  let filteredCourses = coursesData.filter(
    (course) =>
      selectedCourses.find(
        (selectedCourse) =>
          selectedCourse["COURSE CODE"] === course["COURSE CODE"]
      ) === undefined
  );
  const seenCourses = new Set();
  filteredCourses = filteredCourses.filter((course) => {
    const duplicate = seenCourses.has(course["COURSE CODE"]);
    seenCourses.add(course["COURSE CODE"]);
    return !duplicate;
  });
  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <div className={`${styles.title} body1-bold`}>Select Course</div>
        <Searchbar
          selector="course-select-autocomplete"
          data={filteredCourses}
          keys={["COURSE CODE", "COURSE TITLE"]}
          onSelect={(selectedString) => {
            console.log(
              coursesData.filter((course) =>
                selectedString.startsWith(course["COURSE CODE"])
              )
            );
            coursesData.forEach((course) => {
              if (selectedString.startsWith(course["COURSE CODE"]))
                addCourse(course);
            });
          }}
          getUnique={(course) =>
            `${course["COURSE CODE"]} - ${course["COURSE TITLE"]}`
          }
          placeholder="Eg: CSE1002 or Problem Solving and Programming"
          threshold={0.9}
          suggestionElement={(course, classNames, value, onSelect, key) => {
            return (
              <div
                className={`${styles.courseSuggestion} ${classNames}`}
                data-value={value}
                onClick={(e) => {
                  onSelect(value);
                }}
                key={key}
              >
                <div>{course["COURSE CODE"]}</div>
                <div>{course["COURSE TITLE"]}</div>
              </div>
            );
          }}
          maxResults={4}
        ></Searchbar>
      </div>
      <div className={styles.selectedCourses}>
        <div className={`${styles.title} body1-bold`}>Selected Courses</div>
        <div className={styles.addedCourses}>
          <div className={styles.resultsWrapper}>
            <div className={styles.results}>
              {selectedCourses.map((selectedCourse) => {
                return (
                  <div
                    className={styles.course}
                    key={`selected-course-${getCourseID(selectedCourse)}`}
                  >
                    {/* {getCourseID(selectedCourse)}-
                    {selectedCourse["COURSE TITLE"]} */}
                    <div className={`${styles.courseTitle} body1-bold`}>
                      {selectedCourse["COURSE TITLE"]}
                    </div>
                    <a
                      className={styles.delete}
                      onClick={() => removeCourse(selectedCourse)}
                    >
                      X
                    </a>
                    <div className={styles.courseCode}>
                      {selectedCourse["COURSE CODE"]}
                    </div>
                    <div className={styles.courseType}>
                      {selectedCourse["COURSE TYPE"]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.buttons}>
            <a
              className={styles.clearButton}
              onClick={() =>
                selectedCourses.forEach((course) => removeCourse(course))
              }
            >
              CLEAR
            </a>
            <a className={styles.primaryButton}>ADD COURSE</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSelect;
