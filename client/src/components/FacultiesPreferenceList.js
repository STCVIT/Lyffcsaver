// using code from https://www.freecodecamp.org/news/how-to-add-drag-and-drop-in-react-with-react-beautiful-dnd/
import { useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "../css/FacultiesPreferenceList.module.css";
import useDataSearch from "../utils/useDataSearch";
import Searchbar from "./Searchbar";

const FacultiesPreferenceList = ({
  currentlySelectedCourseID,
  selectedFaculties,
  setSelectedFaculties,
}) => {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const {
    data: faculties,
    hasMore,
    loading,
    error,
  } = useDataSearch(
    { courseID: currentlySelectedCourseID, query, pageNumber },
    "faculties"
  );

  useEffect(() => {
    if (currentlySelectedCourseID === "") return;
    setQuery("");
    setPageNumber(1);
  }, [currentlySelectedCourseID]);

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setPageNumber(1);
  };

  const isSelectedFaculty = (facultyToBeChecked) => {
    return (
      selectedFaculties[currentlySelectedCourseID]?.find((selectedFaculty) => {
        return selectedFaculty["ERP ID"] === facultyToBeChecked["ERP ID"];
      }) !== undefined
    );
  };

  const InteractionElement = ({ faculty, customKey }) => {
    return (
      <div className={styles.bodyCol}>
        <input
          type="checkbox"
          name="selected"
          id={`${faculty["ERP ID"]}-selected`}
          key={customKey}
          onClick={(e) => {
            let newSelectedFaculties = selectedFaculties;
            if (newSelectedFaculties[currentlySelectedCourseID] === undefined)
              newSelectedFaculties[currentlySelectedCourseID] = [];
            if (e.target.checked) {
              if (!isSelectedFaculty(faculty))
                newSelectedFaculties[currentlySelectedCourseID].push(faculty);
            } else {
              newSelectedFaculties[currentlySelectedCourseID] =
                newSelectedFaculties[currentlySelectedCourseID].filter(
                  (selectedFaculty) => {
                    return (
                      selectedFaculty["ERP ID"] !==
                      e.target.parentNode.parentNode.id
                    );
                  }
                );
            }
            setSelectedFaculties({ ...newSelectedFaculties });
          }}
          defaultChecked={isSelectedFaculty(faculty)}
        />
      </div>
    );
  };
  const isInFaculties = (facultyToCheck) => {
    return (
      faculties.find(
        (faculty) => faculty["ERP ID"] === facultyToCheck["ERP ID"]
      ) !== undefined
    );
  };
  const selectedFacultyRows = (provided) => {
    return (
      <>
        {selectedFaculties[currentlySelectedCourseID]?.map((faculty, index) => {
          if (!isInFaculties(faculty)) return <></>;

          // Rendering selected faculties
          if (faculties.length === index + 1) {
            return (
              <Draggable
                draggableId={`${faculty["ERP ID"]}-se`}
                key={`${faculty["ERP ID"]}-se`}
                index={index}
              >
                {(provided) => (
                  <li
                    ref={(node) => {
                      lastElementRef(node);
                      provided.innerRef(node);
                    }}
                    key={`${faculty["ERP ID"]}-sec`}
                    className={`${styles.card} ${styles.selected}`}
                    id={faculty["ERP ID"]}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <InteractionElement
                      faculty={faculty}
                      customKey={`${faculty["ERP ID"]}-se-i`}
                    ></InteractionElement>
                    <div className={styles.bodyCol}>{faculty["ERP ID"]}</div>
                    <div className={styles.bodyCol}>
                      {faculty["EMPLOYEE NAME"]}
                    </div>
                    <div className={styles.bodyCol}>
                      {faculty["EMPLOYEE SCHOOL"]}
                    </div>
                  </li>
                )}
              </Draggable>
            );
          } else {
            return (
              <Draggable
                draggableId={`${faculty["ERP ID"]}-s`}
                key={`${faculty["ERP ID"]}-s`}
                index={index}
              >
                {(provided) => (
                  <li
                    className={`${styles.card} ${styles.selected}`}
                    id={faculty["ERP ID"]}
                    key={`${faculty["ERP ID"]}-sc`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <InteractionElement
                      faculty={faculty}
                      customKey={`${faculty["ERP ID"]}-s-i`}
                    ></InteractionElement>

                    <div className={styles.bodyCol}>{faculty["ERP ID"]}</div>
                    <div className={styles.bodyCol}>
                      {faculty["EMPLOYEE NAME"]}
                    </div>
                    <div className={styles.bodyCol}>
                      {faculty["EMPLOYEE SCHOOL"]}
                    </div>
                  </li>
                )}
              </Draggable>
            );
          }
        })}
        {provided.placeholder}
      </>
    );
  };
  const facultyRows = () => {
    return faculties.map((faculty, index) => {
      if (isSelectedFaculty(faculty)) return <></>;
      // Rendering unselected faculties
      if (faculties.length === index + 1) {
        return (
          <li
            ref={lastElementRef}
            className={`${styles.card} ${styles.notSelected}`}
            id={faculty["ERP ID"]}
            key={`${faculty["ERP ID"]}-ue`}
          >
            <InteractionElement
              faculty={faculty}
              customKey={`${faculty["ERP ID"]}-ue-i`}
            ></InteractionElement>

            <div className={styles.bodyCol}>{faculty["ERP ID"]}</div>
            <div className={styles.bodyCol}>{faculty["EMPLOYEE NAME"]}</div>
            <div className={styles.bodyCol}>{faculty["EMPLOYEE SCHOOL"]}</div>
          </li>
        );
      } else {
        return (
          <li
            id={faculty["ERP ID"]}
            className={`${styles.card} ${styles.notSelected}`}
            key={`${faculty["ERP ID"]}-u`}
          >
            <InteractionElement
              faculty={faculty}
              customKey={`${faculty["ERP ID"]}-u-i`}
            ></InteractionElement>

            <div className={styles.bodyCol}>{faculty["ERP ID"]}</div>
            <div className={styles.bodyCol}>{faculty["EMPLOYEE NAME"]}</div>
            <div className={styles.bodyCol}>{faculty["EMPLOYEE SCHOOL"]}</div>
          </li>
        );
      }
    });
  };
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const newSelectedFaculties = Object.assign({}, selectedFaculties);
    const [reorderedItem] = newSelectedFaculties[
      currentlySelectedCourseID
    ].splice(result.source.index, 1);
    newSelectedFaculties[currentlySelectedCourseID].splice(
      result.destination.index,
      0,
      reorderedItem
    );
    setSelectedFaculties(newSelectedFaculties);
  };

  return currentlySelectedCourseID === "" ? (
    <></>
  ) : (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerNames}>
          <div className={styles.headCol}></div>
          <div className={styles.headCol}>ERP ID</div>
          <div className={styles.headCol}>EMPLOYEE NAME</div>
          <div className={styles.headCol}>EMPLOYEE SCHOOL</div>
        </div>
        <div className={styles.headerSearch}>
          <Searchbar handleSearch={handleSearch}></Searchbar>
        </div>
      </div>

      <div className={styles.bodySection}>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="faculties">
            {(provided) => (
              <ul
                key={"faculties-list"}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {selectedFacultyRows(provided)}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        {facultyRows()}
        <div className={styles.loading}>{loading && "Loading..."}</div>
        <div className={styles.error}>{error && "Error..."}</div>
        <div className={styles.noResults}>
          {!loading && !error && faculties.length === 0 && "No Results."}
        </div>
      </div>
    </div>
  );
};

export default FacultiesPreferenceList;
