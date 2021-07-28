import ReactPaginate from "react-paginate";
import styles from "../css/Classes.module.css";
import { useEffect, useState } from "react";
import leftArrow from "../assets/leftArrow.svg";
import rightArrow from "../assets/rightArrow.svg";
import ClassTable from "./ClassTable";
const Classes = ({
  schedules,
  slots,
  selectedClasses,
  setSelectedClasses,
  setHoveredSlots,
  getScore,
  isUnique,
}) => {
  const courseIDs = schedules?.length > 0 ? Object.keys(schedules[0]) : [];
  const previewsPerPage = 1;
  const pageCount = courseIDs?.length / previewsPerPage;
  const [currentPage, setCurrentPage] = useState(1);

  const getScheduleScore = (schedule) => {
    let score = 0;
    Object.keys(schedule).forEach(
      (courseID) => (score += getScore(courseID, schedule[courseID]))
    );
    return score;
  };
  schedules?.sort((a, b) => getScheduleScore(b) - getScheduleScore(a));

  useEffect(() => {
    setCurrentPage(0);
  }, [slots, schedules]);

  useEffect(() => {
    const newSelectedClasses = {};
    if (schedules !== undefined && schedules.length > 0)
      for (const courseID of Object.keys(schedules[0])) {
        newSelectedClasses[courseID] = schedules[0][courseID];
      }
    setSelectedClasses(newSelectedClasses);
  }, [slots, schedules]);

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
  const classes = {};
  schedules?.forEach((schedule) =>
    courseIDs?.forEach((courseID) => {
      if (classes[courseID] === undefined) classes[courseID] = [];
      if (isUnique("CLASS ID", classes[courseID], schedule[courseID]))
        classes[courseID].push(schedule[courseID]);
    })
  );
  courseIDs.sort((a, b) => classes[b].length - classes[a].length);
  const currentPageData = courseIDs
    ?.slice(currentPage * previewsPerPage, (currentPage + 1) * previewsPerPage)
    ?.map((courseID) => {
      return (
        <ClassTable
          onInteraction={(
            e,
            currentCourseID,
            currentClass,
            isSelectedClass
          ) => {
            setSelectedClasses((prevSelectedClasses) => {
              let newSelectedClasses = { ...prevSelectedClasses };
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
                // if(isLabComponent(currentClass))
                if (!isSelectedClass(currentClass))
                  newSelectedClasses[currentCourseID] = currentClass;
              } else {
                delete newSelectedClasses[currentCourseID];
              }
              return newSelectedClasses;
            });
          }}
          key={`${slots.join("")}-${courseID}`}
          handleHover={handleHover}
          handleDehover={handleDehover}
          courseIDs={courseIDs}
          schedules={schedules}
          courseID={courseID}
          selectedClasses={selectedClasses}
          slots={slots}
          getScore={getScore}
        ></ClassTable>
      );
    });
  const leftArrowNode = <img src={leftArrow} alt="<" />;
  const rightArrowNode = <img src={rightArrow} alt=">" />;
  return schedules === undefined || schedules.length <= 0 ? (
    <></>
  ) : (
    <div className={styles.panel} id="classes">
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
