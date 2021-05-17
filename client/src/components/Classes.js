import InfoCols from "./InfoCols";
import styles from "../css/Classes.module.css";
const Classes = ({ schedules, select, slots }) => {
  const ignoreCols = [
    "REGISTERED SEATS",
    "ASSO CLASS ID",
    "CLASS ID",
    "CLASS OPTION",
    "CLASS TYPE",
    "WAITING SEATS",
    "COURSE STATUS",
    "COURSE MODE",
    "BATCH",
  ];
  console.log("classes", schedules, slots);
  return (
    <div className={styles.container}>
      {schedules?.map((schedule, index) => {
        const courseIDs = Object.keys(schedule);
        return (
          <div
            key={`${slots.join("")}-${index}}`}
            className={styles.tableWrapper}
            onClick={() => select(schedule)}
          >
            <table className={styles.table}>
              <thead>
                {Object.keys(schedule[courseIDs[0]]).map((key) => {
                  if (ignoreCols && !ignoreCols.includes(key))
                    return (
                      <th
                        className={styles.cell}
                        key={`${slots.join("")}-${index}-head-${key}`}
                      >
                        {key}
                      </th>
                    );
                })}
              </thead>
              <tbody>
                {courseIDs.map((courseID) => {
                  return (
                    <tr key={`${slots.join("")}-${index}}-${courseID}`}>
                      <InfoCols
                        entry={schedule[courseID]}
                        getID={() => `${slots.join("")}-${index}}-${courseID}`}
                        styles={styles}
                        ignoreCols={ignoreCols}
                        // onClick={(e) => {
                        //   document
                        //     .querySelector(`.${styles.activeRow}`)
                        //     ?.classList.remove(styles.activeRow);

                        //   e.target.parentNode.classList.toggle(styles.activeRow);
                        //   e.target.parentNode.classList.remove(styles.hoverRow);
                        //   onSelect(e.target.parentNode.dataset.courseid);
                        // }}
                        // onMouseEnter={(e) => {
                        //   if (
                        //     e.target.parentNode.classList.contains(styles.activeRow)
                        //   )
                        //     return;
                        //   e.target.parentNode.classList.add(styles.hoverRow);
                        // }}
                        // onMouseLeave={(e) => {
                        //   e.target.parentNode.classList.remove(styles.hoverRow);
                        // }}
                      ></InfoCols>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default Classes;
