import styles from "../css/Timetable.module.css";
import timetableTemplateData from "../utils/timetableTemplateData";

const Timetable = ({
  slots,
  selectedClasses,
  hoveredSlots,
  classes,
  hasValidSelections,
}) => {
  // console.log("rendering timetable", slots);
  let dayCount = 0;
  const id = "final-display";
  const getSlotTiming = (slot, cellIndex) => {
    // timetableTemplateData.forEach(row =>
    //   row.forEach((cell, index) => )
    //   )
    // for (let i = 0; i < timetableTemplateData.length; i++)
    //   for (let j = 0; j < timetableTemplateData[i].length; j++)
    //     if (timetableTemplateData[i][j] === slot) index = j;
    if (slot.startsWith("L"))
      return [
        timetableTemplateData[2][cellIndex],
        timetableTemplateData[3][cellIndex],
      ];
    else
      return [
        timetableTemplateData[0][cellIndex],
        timetableTemplateData[1][cellIndex],
      ];
  };
  const getClassBySlotInSchedule = (schedule, cell) => {
    // console.log(schedule, cell);
    if (schedule === undefined || schedule === null) return {};
    const courseIDs = Object.keys(schedule);
    const courseID = courseIDs?.find((courseID) =>
      schedule[courseID]["SLOT"].split("+").includes(cell)
    );
    const classData = classes[courseID]?.find(
      (classData) => classData["CLASS ID"] === schedule[courseID]["CLASS ID"]
    );
    if (schedule[courseID] !== undefined) return schedule[courseID];
    else return {};

    // const courseIDs = Object.keys(schedule);
    // const courseID = courseIDs?.find((courseID) =>
    //   schedule[courseID]["SLOT"].split("+").includes(cell)
    // );
    // if (
    //   schedule === undefined ||
    //   courseIDs.length === 0 ||
    //   courseID === undefined ||
    /////   !(
    //     schedule[courseID] &&
    //     slots.includes(schedule[courseID]["SLOT"].split("+")[0])
    //   )
    // )
    //   return {};
    // return schedule[courseID];
  };
  const getCellContent = (schedule, cell) => {
    if (schedule === undefined || schedule === null) return "";
    // console.log(schedule, cell);
    const courseIDs = Object.keys(schedule);
    const courseID = courseIDs.find((courseID) =>
      schedule[courseID]["SLOT"].split("+").includes(cell)
    );
    if (
      schedule === undefined ||
      courseIDs.length === 0 ||
      courseID === undefined ||
      !(
        schedule[courseID] &&
        slots.includes(schedule[courseID]["SLOT"].split("+")[0])
      )
    )
      return cell;
    return `${cell}-${courseID}-${schedule[courseID]["ROOM NUMBER"]}`;
  };
  const getClassName = (cellContent, rowIndex, cellIndex) => {
    let className = `${styles.cell} `;
    if (cellIndex < 2) {
      className += `${styles.headDay}`;
      return className;
    }
    if (rowIndex < 2) {
      className += ` ${styles.theoryTiming} `;
    }
    if (rowIndex >= 2 && rowIndex < 4) {
      className += ` ${styles.labTiming} `;
    }
    if (rowIndex < 4) {
      className += ` ${styles.cell} ${styles.headTop} `;
      return className;
    }
    if (cellContent === "Lunch") {
      className += `${styles.lunch}`;
      return className;
    }
    if (hoveredSlots.includes(cellContent)) {
      if (rowIndex % 2 === 0) {
        className += `${styles.theory} ${styles.hoveredTheory}`;
        return className;
      } else {
        className += `${styles.lab} ${styles.hoveredLab}`;
        return className;
      }
    }
    if (slots.includes(cellContent)) {
      if (rowIndex % 2 === 0) {
        className += `${styles.theory}`;
        return className;
      } else {
        className += `${styles.lab}`;
        return className;
      }
    }
    if (dayCount % 2 === 0) {
      className += `${styles.evenDay}`;
      return className;
    } else {
      className += `${styles.oddDay}`;
      return className;
    }
  };
  // const getCoursesWithCourseCode = (schedule, courseCode) => {
  //   const courseIDs = Object.keys(schedule)
  //   const validCourseIDs = courseIDs.filter(courseID => courseID.startsWith(courseCode))
  //   return validCourseIDs.map(courseID => schedule[courseID])
  // }

  const getCoursesWithDifferentFaculties = (schedule) => {
    const facultiesByCourseCode = {};
    const courseCodes = new Set();
    for (const courseID of Object.keys(schedule)) {
      const courseCode = schedule[courseID]["COURSE CODE"];
      if (facultiesByCourseCode[courseCode] === undefined)
        facultiesByCourseCode[courseCode] = schedule[courseID]["ERP ID"];
      else if (
        facultiesByCourseCode[courseCode] !== schedule[courseID]["ERP ID"]
      )
        courseCodes.add(courseCode);
    }
    return Array.from(courseCodes);
  };
  // console.log(selectedClasses);
  return (
    <div className={styles.container}>
      <table className={styles.timetable} id="filled-out-timetable">
        <thead>
          {timetableTemplateData.slice(0, 4).map((row, rowIndex) => {
            return (
              <tr key={`${id}-row-${rowIndex}`}>
                {row.map((cell, index) => {
                  return cell === "" || index === 1 ? (
                    <></>
                  ) : (
                    <th
                      key={`${id}-${rowIndex}-${index}`}
                      className={getClassName(cell, rowIndex, index)}
                      rowSpan={index === 0 ? 2 : 1}
                    >
                      {cell !== "Lunch" ? cell : ""}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {timetableTemplateData.slice(4).map((row, rowIndex) => {
            if (rowIndex % 2 === 0) dayCount++;
            return (
              <tr key={`${id}-row-${rowIndex}`}>
                {row.map((cell, cellIndex) => {
                  return cell === "" ||
                    cellIndex === 1 ||
                    (rowIndex > 0 && cell === "Lunch") ? (
                    <></>
                  ) : (
                    <td
                      key={`${id}-${rowIndex}-${cellIndex}`}
                      className={`${getClassName(
                        cell,
                        rowIndex + 4,
                        cellIndex
                      )}`}
                      rowSpan={cell === "Lunch" ? 14 : cellIndex === 0 ? 2 : 1}
                    >
                      {getCellContent(selectedClasses, cell)}
                      {slots.includes(cell) ? (
                        <div className={`${styles.tooltip} caption`}>
                          <span></span>
                          <div className={styles.tooltipContainer}>
                            <div className={styles.tooltipRow}>
                              COURSE TITLE:-{" "}
                              {
                                getClassBySlotInSchedule(selectedClasses, cell)[
                                  "COURSE TITLE"
                                ]
                              }
                            </div>
                            <div className={styles.tooltipRow}>
                              SLOT:- {cell}
                            </div>
                            <div className={styles.tooltipRow}>
                              TIMING:-{" "}
                              {getSlotTiming(cell, cellIndex).join(" - ")}
                            </div>
                            <div className={styles.tooltipRow}>
                              FACULTY NAME:-{" "}
                              {
                                getClassBySlotInSchedule(selectedClasses, cell)[
                                  "EMPLOYEE NAME"
                                ]
                              }
                            </div>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {getCoursesWithDifferentFaculties(selectedClasses).length === 0 ? (
        <></>
      ) : (
        <div className={styles.disclaimer}>
          DISCLAIMER: The currently selected timetable has different faculties
          in the components of the following courses:-{" "}
          {getCoursesWithDifferentFaculties(selectedClasses).join(", ")}
          <br />
          {hasValidSelections() ? (
            <>
              Consider selecting the same faculties for all components of the
              course.
            </>
          ) : (
            <>No common faculties found</>
          )}
        </div>
      )}
    </div>
  );
};

export default Timetable;
