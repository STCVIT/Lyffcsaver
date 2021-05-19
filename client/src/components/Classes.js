import ReactPaginate from "react-paginate";
import InfoCols from "./InfoCols";
import styles from "../css/Classes.module.css";
import { useState } from "react";
const Classes = ({ schedules, select, slots }) => {
  console.log({ schedules, slots });
  const ignoreCols = [
    "REGISTERED SEATS",
    "ASSO CLASS ID",
    // "CLASS ID",
    "CLASS OPTION",
    "CLASS TYPE",
    "WAITING SEATS",
    "COURSE STATUS",
    "COURSE MODE",
    "BATCH",
  ];
  const previewsPerPage = 2;
  const pageCount = Math.ceil(schedules?.length / previewsPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  const currentPageData = schedules
    ?.slice(currentPage * previewsPerPage, (currentPage + 1) * previewsPerPage)
    ?.map((schedule, index) => {
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
                      onClick={(e) => {
                        document
                          .querySelectorAll(`.${styles.selectedSchedule}`)
                          ?.forEach((element) =>
                            element.classList.remove(styles.selectedSchedule)
                          );

                        let element = e.target;
                        while (element !== null && element !== undefined) {
                          if (element.classList.contains(styles.table)) {
                            element.classList.add(styles.selectedSchedule);
                            break;
                          }
                          element = element.parentNode;
                        }
                      }}
                    ></InfoCols>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    });
  console.log("classes", schedules, slots);
  return schedules === undefined ? (
    <></>
  ) : (
    <div className={styles.panel}>
      <ReactPaginate
        previousLabel="<"
        nextLabel=">"
        pageCount={pageCount}
        onPageChange={({ selected }) => {
          setCurrentPage(selected);
          select({});
          document
            .querySelectorAll(`.${styles.selectedSchedule}`)
            ?.forEach((element) =>
              element.classList.remove(styles.selectedSchedule)
            );
        }}
        containerClassName={styles.schedules}
        previousLinkClassName={styles.previous}
        nextLinkClassName={styles.next}
        disabledClassName={styles.disabled}
        activeClassName={styles.active}
      ></ReactPaginate>
      <div className={styles.container}>{currentPageData}</div>
    </div>
  );
};

export default Classes;
