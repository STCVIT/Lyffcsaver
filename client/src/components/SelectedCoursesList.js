import styles from "../css/SelectedCoursesList.module.css";
import { getCourseID } from "../utils/generalUtils";
import deleteIcon from "../assets/deleteIcon.svg";

// TODO: Delete button picture should have transparent corners
const SelectedCoursesList = ({
  ignoreCols,
  removeCourse,
  onSelect,
  onDeselect,
  selectedCourses,
}) => {
  const columnKeys = [];
  const colsHeadings = () => {
    columnKeys.length = 0;
    return Object.keys(selectedCourses[0]).map((key) => {
      if (ignoreCols && !ignoreCols.includes(key)) {
        columnKeys.push(key);
        return (
          <th className={styles.cell} key={`selected-head-${key}`}>
            {key}
          </th>
        );
      }
    });
  };
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
    // <div className={styles.container}>
    //   <label className={styles.label}>
    //     <h2>Selected Courses</h2>
    //   </label>
    //   <div className={styles.tableWrapper}>
    //     <table className={styles.courseTable}>
    //       <thead>
    //         <tr className={styles.headRow}>
    //           <th className={styles.cell} key="selected-head-select"></th>
    //           {colsHeadings()}
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {selectedCourses.map((course) => {
    //           return (
    //             <tr
    //               className={`${styles.row} ${styles.selectedCoursesRow}`}
    //               data-courseid={getCourseID(course)}
    //               key={getCourseID(course)}
    //             >
    //               <td
    //                 className={styles.cell + " " + styles.remove}
    //                 data-courseid={getCourseID(course)}
    //                 onClick={(event) => {
    //                   removeCourse(event.target.dataset.courseid);
    //                   onDeselect();
    //                 }}
    //                 key={getCourseID(course) + "-I"}
    //               >
    //                 -
    //               </td>
    //               <InfoCols
    //                 keys={columnKeys}
    //                 entry={course}
    //                 getID={getCourseID}
    //                 styles={styles}
    //                 ignoreCols={ignoreCols}
    //                 onClick={(e) => {
    //                   document
    //                     .querySelector(`.${styles.activeRow}`)
    //                     ?.classList.remove(styles.activeRow);

    //                   e.target.parentNode.classList.toggle(styles.activeRow);
    //                   e.target.parentNode.classList.remove(styles.hoverRow);
    //                   onSelect(e.target.parentNode.dataset.courseid);
    //                 }}
    //                 onMouseEnter={(e) => {
    //                   if (
    //                     e.target.parentNode.classList.contains(styles.activeRow)
    //                   )
    //                     return;
    //                   e.target.parentNode.classList.add(styles.hoverRow);
    //                 }}
    //                 onMouseLeave={(e) => {
    //                   e.target.parentNode.classList.remove(styles.hoverRow);
    //                 }}
    //               ></InfoCols>
    //             </tr>
    //           );
    //         })}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
    <></>
  );
};
export default SelectedCoursesList;
