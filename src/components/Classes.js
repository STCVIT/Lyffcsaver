import ReactPaginate from "react-paginate";
import InfoCols from "./InfoCols";
import styles from "../css/Classes.module.css";
import { getCourseID } from "../utils/generalUtils";
import { useEffect, useState } from "react";
import leftArrow from "../assets/leftArrow.svg";
import rightArrow from "../assets/rightArrow.svg";
const Classes = ({
  schedules,
  slots,
  selectedClasses,
  setSelectedClasses,
  setHoveredSlots,
  classPreferences,
}) => {
  // console.log("rendering classes", slots);
  const ignoreCols = [
    "REGISTERED SEATS",
    "ASSO CLASS ID",
    "COURSE ID",
    "CLASS OPTION",
    "CLASS TYPE",
    "WAITING SEATS",
    "COURSE STATUS",
    "COURSE MODE",
    "COURSE CODE",
    "BATCH",
    "ALLOCATED SEATS",
  ];
  const courseIDs = schedules?.length > 0 ? Object.keys(schedules[0]) : [];
  const classes = {};
  const previewsPerPage = 1;
  const pageCount = courseIDs?.length / previewsPerPage;
  const [currentPage, setCurrentPage] = useState(1);

  const isUnique = (fieldName, array, element) => {
    return !array.some(
      (currentElement) => currentElement[fieldName] === element[fieldName]
    );
  };
  const getScore = (courseID, classData) => {
    return (
      (classPreferences[courseID]?.length -
        classPreferences[courseID]?.findIndex(
          (_classData) => _classData["CLASS ID"] === classData["CLASS ID"]
        )) /
      classPreferences[courseID]?.length
    );
  };
  const getScheduleScore = (schedule) => {
    let score = 0;
    Object.keys(schedule).forEach(
      (courseID) => (score += getScore(courseID, schedule[courseID]))
    );
    return score;
  };
  schedules?.sort((a, b) => getScheduleScore(b) - getScheduleScore(a));
  // schedules?.forEach(schedule => console.log())
  // console.log(schedules?.map((schedule) => getScheduleScore(schedule)));
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
  // console.log(
  //   courseIDs.map((courseID) =>
  //     classes[courseID]?.map((classData) => getScore(courseID, classData))
  //   )
  // );

  useEffect(() => {
    setCurrentPage(0);
    // useForceUpdate();
  }, [slots, schedules]);
  // useEffect(() => {}, [selectedClasses]);

  useEffect(() => {
    const newSelectedClasses = {};
    // console.log("classes", classes);
    // console.log("schedules[0]", schedules, schedules[0]);
    if (schedules !== undefined && schedules.length > 0)
      for (const courseID of Object.keys(schedules[0])) {
        newSelectedClasses[courseID] = schedules[0][courseID];
      }
    setSelectedClasses(newSelectedClasses);
  }, [slots, schedules]);

  // const getFacultyByID = (erpID, courseID) => {
  //   if (courseID !== undefined)
  //     return classesData[courseID].find(
  //       (element) => element["ERP ID"] === erpID
  //     );
  //   for (const courseID of courseIDs) {
  //     const foundElement = classesData[courseID].find(
  //       (element) => element["ERP ID"] === erpID
  //     );
  //     if (foundElement !== undefined) return foundElement;
  //   }
  //   return undefined;
  // };

  const isSelectedClass = (classToBeChecked, currentCourseID) => {
    return (
      selectedClasses !== undefined &&
      selectedClasses[currentCourseID] !== undefined &&
      selectedClasses[currentCourseID]["CLASS ID"] ===
        classToBeChecked["CLASS ID"]
    );
  };

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
            let newSelectedClasses = selectedClasses;
            if (newSelectedClasses[currentCourseID] === undefined)
              newSelectedClasses[currentCourseID] = {};
            if (e.target.checked) {
              for (const courseIDToBeChecked of Object.keys(
                newSelectedClasses
              )) {
                if (
                  currentCourseID !== courseIDToBeChecked &&
                  newSelectedClasses[courseIDToBeChecked]["SLOT"]
                    ?.split("+")
                    ?.find((slot) =>
                      currentClass["SLOT"].split("+").includes(slot)
                    )
                ) {
                  delete newSelectedClasses[courseIDToBeChecked];
                }
              }
              if (!isSelectedClass(currentClass))
                newSelectedClasses[currentCourseID] = currentClass;
            } else {
              delete newSelectedClasses[currentCourseID];
            }
            setSelectedClasses({ ...newSelectedClasses });
          }}
          defaultChecked={isSelectedClass(currentClass, currentCourseID)}
          className={styles.checkbox}
        />
      </td>
    );
  };

  const handleHover = (hoveredClass, element) => {
    if (hoveredClass === undefined) return;
    setHoveredSlots(hoveredClass["SLOT"].split("+"));
    document
      .querySelectorAll(`.${styles.hoverRow}`)
      .forEach((e) => e.classList.remove(styles.hoverRow));
    let currentElement = element?.target;
    while (
      currentElement !== null &&
      currentElement !== undefined &&
      !currentElement?.classList?.contains(styles.tableRow)
    ) {
      currentElement = currentElement.parentNode;
    }
    currentElement?.classList?.add(styles.hoverRow);
  };

  const handleDehover = (hoveredClass, element) => {
    setHoveredSlots([]);
    document
      .querySelectorAll(`.${styles.hoverRow}`)
      .forEach((e) => e.classList.remove(styles.hoverRow));
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

  // const currentPageData = courseIDs
  //   ?.slice(currentPage * previewsPerPage, (currentPage + 1) * previewsPerPage)
  //   ?.map((courseID) => {
  //     return (
  //       <div
  //         className={styles.container}
  //         key={`${slots.join("")}-${courseID}`}
  //       ></div>
  //     );
  //   });

  const currentPageData = courseIDs
    ?.slice(currentPage * previewsPerPage, (currentPage + 1) * previewsPerPage)
    ?.map((courseID) => {
      return (
        <div
          className={styles.tableWrapper}
          key={`${slots.join("")}-${courseID}`}
        >
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
                    handleHover(selectedClasses[courseID], e)
                  }
                  onMouseLeave={(e) =>
                    handleDehover(selectedClasses[courseID], e)
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
                      onMouseEnter={(e) => handleHover(currentClass, e)}
                      onMouseLeave={(e) => handleDehover(currentClass, e)}
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
    });
  const leftArrowNode = <img src={leftArrow} alt="<" />;
  const rightArrowNode = <img src={rightArrow} alt=">" />;
  return schedules === undefined || schedules.length <= 0 ? (
    <></>
  ) : (
    <div className={styles.panel}>
      <ReactPaginate
        previousLabel={leftArrowNode}
        nextLabel={rightArrowNode}
        pageCount={pageCount}
        onPageChange={({ selected }) => {
          setCurrentPage(selected);
        }}
        pageLabelBuilder={(page) => {
          return courseIDs[page - 1];
        }}
        containerClassName={styles.schedulesPagination}
        pageClassName={styles.page}
        previousLinkClassName={styles.previous}
        nextLinkClassName={styles.next}
        disabledClassName={styles.disabled}
        activeClassName={styles.active}
        marginPagesDisplayed={1}
        forcePage={currentPage}
      ></ReactPaginate>
      <div className={styles.container}>{currentPageData}</div>
    </div>
  );
};

export default Classes;
