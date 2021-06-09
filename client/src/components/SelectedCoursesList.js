import styles from "../css/SelectedCoursesList.module.css";
import InfoCols from "./InfoCols";
import { getCourseID } from "../utils/generalUtils";

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
      <label className={styles.label}>
        <h2>Selected Courses</h2>
      </label>
      <div className={styles.tableWrapper}>
        <table className={styles.courseTable}>
          <thead>
            <tr className={styles.headRow}>
              <th className={styles.cell} key="selected-head-select"></th>
              {colsHeadings()}
            </tr>
          </thead>
          <tbody>
            {selectedCourses.map((course) => {
              return (
                <tr
                  className={`${styles.row} ${styles.selectedCoursesRow}`}
                  data-courseid={getCourseID(course)}
                  key={getCourseID(course)}
                >
                  <td
                    className={styles.cell + " " + styles.remove}
                    data-courseid={getCourseID(course)}
                    onClick={(event) => {
                      removeCourse(event.target.dataset.courseid);
                      onDeselect();
                    }}
                    key={getCourseID(course) + "-I"}
                  >
                    -
                  </td>
                  <InfoCols
                    keys={columnKeys}
                    entry={course}
                    getID={getCourseID}
                    styles={styles}
                    ignoreCols={ignoreCols}
                    onClick={(e) => {
                      document
                        .querySelector(`.${styles.activeRow}`)
                        ?.classList.remove(styles.activeRow);

                      e.target.parentNode.classList.toggle(styles.activeRow);
                      e.target.parentNode.classList.remove(styles.hoverRow);
                      onSelect(e.target.parentNode.dataset.courseid);
                    }}
                    onMouseEnter={(e) => {
                      if (
                        e.target.parentNode.classList.contains(styles.activeRow)
                      )
                        return;
                      e.target.parentNode.classList.add(styles.hoverRow);
                    }}
                    onMouseLeave={(e) => {
                      e.target.parentNode.classList.remove(styles.hoverRow);
                    }}
                  ></InfoCols>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <></>
  );
};
export default SelectedCoursesList;
