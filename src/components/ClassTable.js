import styles from "../css/Classes.module.css";
import { getCourseID } from "../utils/generalUtils";
import InfoCols from "./InfoCols";
const ClassTable = ({
  // classes,
  courseIDs,
  schedules,
  courseID,
  selectedClasses,
  slots,
  getScore,
  handleHover,
  handleDehover,
  onInteraction,
}) => {
  const classes = {};
  const ignoreCols = [
    "REGISTERED SEATS",
    "ASSO CLASS ID",
    "COURSE ID",
    "CLASS OPTION",
    // "COURSE TYPE",
    "WAITING SEATS",
    "COURSE STATUS",
    "COURSE MODE",
    "COURSE CODE",
    "BATCH",
    "ALLOCATED SEATS",
  ];
  const isSelectedClass = (classToBeChecked, currentCourseID) => {
    return (
      selectedClasses !== undefined &&
      selectedClasses[currentCourseID] !== undefined &&
      selectedClasses[currentCourseID]["CLASS ID"] ===
        classToBeChecked["CLASS ID"]
    );
  };
  const isUnique = (fieldName, array, element) => {
    return !array.some(
      (currentElement) => currentElement[fieldName] === element[fieldName]
    );
  };
  schedules?.forEach((schedule) =>
    courseIDs?.forEach((courseID) => {
      if (classes[courseID] === undefined) classes[courseID] = [];
      if (isUnique("CLASS ID", classes[courseID], schedule[courseID]))
        classes[courseID].push(schedule[courseID]);
    })
  );
  courseIDs.sort((a, b) => classes[b].length - classes[a].length);
  courseIDs.forEach((courseID) =>
    classes[courseID]?.sort(
      (a, b) => getScore(courseID, b) - getScore(courseID, a)
    )
  );

  const getClassName = (classToBeChecked) => {
    // console.log(classToBeChecked);
    let className = `${styles.tableRow} `;
    const newSlots = classToBeChecked["SLOT"].split("+");
    const noSlotConflict =
      selectedClasses !== undefined &&
      selectedClasses !== null &&
      newSlots.find(
        (slot) =>
          Object.keys(selectedClasses).find(
            (courseID) =>
              getCourseID(classToBeChecked) !== courseID &&
              selectedClasses[courseID]["SLOT"].split("+").includes(slot)
          ) !== undefined
      ) === undefined;
    if (!noSlotConflict) className += `${styles.faded} `;
    return className;
  };

  const InteractionElement = ({ currentClass, customKey, currentCourseID }) => {
    return (
      <td className={styles.cell}>
        <input
          type="radio"
          name="selected"
          id={`${customKey}-selected`}
          key={customKey}
          onClick={(e) => {
            if (onInteraction)
              onInteraction(e, currentCourseID, currentClass, isSelectedClass);
            // setSelectedClasses({ ...newSelectedClasses });
          }}
          defaultChecked={isSelectedClass(currentClass, currentCourseID)}
          className={styles.checkbox}
        />
      </td>
    );
  };
  const columnKeys = [];
  const colsHeadings = () => {
    columnKeys.length = 0;
    return courseIDs?.length > 0 && schedules[0][courseIDs[0]] !== undefined
      ? Object.keys(schedules[0][courseIDs[0]]).map((colName, index) => {
          if (ignoreCols && !ignoreCols.includes(colName)) {
            columnKeys.push(colName);
            return (
              <th
                className={`${styles.cell} ${styles.headRow}`}
                key={`${slots.join("")}-${index}-head-${colName}`}
              >
                {colName}
              </th>
            );
          }
        })
      : [];
  };
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th
              className={`${styles.cell} ${styles.headRow}`}
              colSpan={colsHeadings().length}
            >
              {courseID}
            </th>
          </tr>

          <tr>
            <th className={`${styles.cell} ${styles.headRow}`}></th>

            {colsHeadings()}
          </tr>
        </thead>
        <tbody>
          {selectedClasses === undefined ||
          selectedClasses[courseID] === undefined ? (
            <></>
          ) : (
            <tr
              key={`${slots.join("")}-${courseID}-${
                selectedClasses[courseID]["CLASS ID"]
              }`}
              className={styles.tableRow}
              onMouseEnter={(e) =>
                handleHover ? handleHover(selectedClasses[courseID], e) : null
              }
              onMouseLeave={(e) =>
                handleDehover
                  ? handleDehover(selectedClasses[courseID], e)
                  : null
              }
              id={`${selectedClasses[courseID]["CLASS ID"]}`}
            >
              <InteractionElement
                currentClass={selectedClasses[courseID]}
                customKey={`${slots.join("")}-${courseID}-${
                  selectedClasses[courseID]["CLASS ID"]
                }`}
                currentCourseID={courseID}
              ></InteractionElement>

              <InfoCols
                keys={columnKeys}
                entry={selectedClasses[courseID]}
                styles={styles}
                ignoreCols={ignoreCols}
                getID={() =>
                  `${slots.join("")}-${courseID}-${
                    selectedClasses[courseID]["CLASS ID"]
                  }`
                }
              ></InfoCols>
            </tr>
          )}
          {classes[courseID]?.map((currentClass) => {
            if (!isSelectedClass(currentClass, courseID))
              return (
                <tr
                  key={`${slots.join("")}-${courseID}-${
                    currentClass["CLASS ID"]
                  }`}
                  onMouseEnter={(e) =>
                    handleHover
                      ? handleHover(selectedClasses[courseID], e)
                      : null
                  }
                  onMouseLeave={(e) =>
                    handleDehover
                      ? handleDehover(selectedClasses[courseID], e)
                      : null
                  }
                  className={getClassName(currentClass)}
                  id={`${currentClass["CLASS ID"]}`}
                >
                  <InteractionElement
                    currentClass={currentClass}
                    customKey={`${slots.join("")}-${courseID}-${
                      currentClass["CLASS ID"]
                    }`}
                    currentCourseID={courseID}
                  ></InteractionElement>

                  <InfoCols
                    keys={columnKeys}
                    entry={currentClass}
                    styles={styles}
                    ignoreCols={ignoreCols}
                    getID={() =>
                      `${slots.join("")}-${courseID}-${
                        currentClass["CLASS ID"]
                      }`
                    }
                  ></InfoCols>
                </tr>
              );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ClassTable;
