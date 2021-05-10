import styles from "../css/SelectedCoursesList.module.css";
import InfoCols from "./InfoCols";
// import Searchbar from './Searchbar'
const SelectedCoursesList = ({
  ignoreCols,
  removeCourse,
  onSelect,
  onDeselect,
  selectedCourses,
}) => {
  console.log("rerendering selected");
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
              {Object.keys(selectedCourses[0]).map((key) => {
                if (ignoreCols && !ignoreCols.includes(key))
                  return (
                    <th className={styles.cell} key={`selected-head-${key}`}>
                      {key}
                    </th>
                  );
              })}
            </tr>
          </thead>
          <tbody>
            {selectedCourses.map((course) => {
              return (
                <tr
                  className={`${styles.row} ${styles.selectedCoursesRow}`}
                  data-coursecode={course["COURSE CODE"]}
                  key={course["COURSE CODE"]}
                >
                  <td
                    className={styles.cell + " " + styles.remove}
                    data-coursecode={course["COURSE CODE"]}
                    onClick={(event) => {
                      removeCourse(event.target.dataset.coursecode);
                      onDeselect();
                    }}
                    key={course["COURSE CODE"] + "-I"}
                  >
                    -
                  </td>
                  <InfoCols
                    entry={course}
                    idName="COURSE CODE"
                    styles={styles}
                    ignoreCols={ignoreCols}
                    onClick={(e) => {
                      document
                        .querySelector(`.${styles.activeRow}`)
                        ?.classList.remove(styles.activeRow);

                      e.target.parentNode.classList.toggle(styles.activeRow);
                      e.target.parentNode.classList.remove(styles.hoverRow);
                      onSelect(e.target.parentNode.dataset.coursecode);
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
      {/* <Searchbar handleSearch={handleSearch}></Searchbar> */}
      {/* <div className={styles.loading}>{loading && "Loading..."}</div> */}
      {/* <div className={styles.error}>{error && "Error..."}</div> */}
    </div>
  ) : (
    <></>
  );
};
export default SelectedCoursesList;
