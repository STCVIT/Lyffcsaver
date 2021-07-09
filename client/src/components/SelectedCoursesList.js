import styles from "../css/SelectedCoursesList.module.css";
import { getCourseID } from "../utils/generalUtils";
import deleteIcon from "../assets/deleteIcon.svg";

const SelectedCoursesList = ({
  removeCourse,
  onSelect,
  onDeselect,
  selectedCourses,
}) => {
  return selectedCourses && selectedCourses.length > 0 ? (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headCol}></div>
        <div className={styles.headCol}>COURSE TITLE</div>
        <div className={styles.headCol}>COURSE CODE </div>
        <div className={styles.headCol}>COURSE OWNER</div>
        <div className={styles.headCol}>COURSE TYPE</div>
      </div>
      <div className={styles.body}>
        {selectedCourses.map((course) => {
          return (
            <div
              className={styles.card}
              data-courseid={getCourseID(course)}
              key={getCourseID(course) + "-selected"}
              onClick={(e) => {
                if (e.target.classList.contains("deleteButton")) return;
                document
                  .querySelector(`.${styles.activeRow}`)
                  ?.classList.remove(styles.activeRow);

                let current = e.target;
                while (
                  current.parentElement !== null &&
                  !current.classList.contains(styles.card)
                )
                  current = current.parentElement;
                current.classList.toggle(styles.activeRow);
                current.classList.remove(styles.hoverRow);
                onSelect(current.dataset.courseid);
              }}
              onMouseEnter={(e) => {
                let current = e.target;
                while (
                  current.parentElement !== null &&
                  !current.classList.contains(styles.card)
                )
                  current = current.parentElement;
                if (current.classList.contains(styles.activeRow)) return;
                current.classList.add(styles.hoverRow);
              }}
              onMouseLeave={(e) => {
                let current = e.target;
                while (
                  current.parentElement !== null &&
                  !current.classList.contains(styles.card)
                )
                  current = current.parentElement;
                current.classList.remove(styles.hoverRow);
              }}
            >
              <div className={styles.bodyCol}>
                <button
                  className="deleteButton"
                  onClick={(event) => {
                    const courseID =
                      event.target.parentElement.parentElement.parentElement
                        .dataset.courseid;
                    removeCourse(courseID);
                    onDeselect(courseID);
                  }}
                >
                  <img className="deleteButton" src={deleteIcon} alt="Remove" />
                </button>
              </div>
              <div className={`${styles.bodyCol} ${styles.courseTitle}`}>
                {course["COURSE TITLE"]}
              </div>
              <div className={styles.bodyCol}>{course["COURSE CODE"]}</div>
              <div className={styles.bodyCol}>{course["COURSE OWNER"]}</div>
              <div className={styles.bodyCol}>{course["COURSE TYPE"]} </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
};
export default SelectedCoursesList;
