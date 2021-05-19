import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../css/FacultiesPreferenceList.module.css";
import useDataSearch from "../utils/useDataSearch";
import Searchbar from "./Searchbar";
import InfoCols from "./InfoCols";

const FacultiesPreferenceList = ({
  currentlySelectedCourseID,
  selectedFaculties,
  setSelectedFaculties,
  ignoreCols,
}) => {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { data: faculties, hasMore, loading, error } = useDataSearch(
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

  // console.log("rerendering faculties");
  const isSelectedFaculty = (facultyToBeChecked) => {
    return (
      selectedFaculties[currentlySelectedCourseID]?.find((selectedFaculty) => {
        return selectedFaculty["ERP ID"] === facultyToBeChecked["ERP ID"];
      }) !== undefined
    );
  };

  // start code from https://stackoverflow.com/a/53837442/13378825
  const [forcingValue, setForcingValue] = useState(0); // integer state
  function useForceUpdate() {
    setForcingValue((prevforcingValue) => prevforcingValue + 1); // update the state to force render
  }
  // end code from https://stackoverflow.com/a/53837442/13378825

  const InteractionElement = ({ faculty, customKey }) => {
    return (
      <td className={styles.cell}>
        <input
          type="checkbox"
          name="selected"
          id={`${faculty["ERP ID"]}-selected`}
          key={customKey}
          onClick={(e) => {
            let newSelectedFaculties = selectedFaculties;
            console.log(selectedFaculties);
            if (newSelectedFaculties[currentlySelectedCourseID] === undefined)
              newSelectedFaculties[currentlySelectedCourseID] = [];
            if (e.target.checked) {
              console.log("selecting", e.target.parentNode.parentNode.id);
              if (!isSelectedFaculty(faculty))
                newSelectedFaculties[currentlySelectedCourseID].push(faculty);
            } else {
              console.log("deselecting", e.target.parentNode.parentNode.id);
              newSelectedFaculties[
                currentlySelectedCourseID
              ] = newSelectedFaculties[currentlySelectedCourseID].filter(
                (selectedFaculty) => {
                  // console.log(
                  //   selectedFaculty,
                  //   e.target.parentNode.parentNode.id,
                  //   selectedFaculty["ERP ID"] !==
                  //     e.target.parentNode.parentNode.id
                  // );
                  return (
                    selectedFaculty["ERP ID"] !==
                    e.target.parentNode.parentNode.id
                  );
                }
              );
            }
            setSelectedFaculties(newSelectedFaculties);

            // Forcing Update is necessary here as changes to selectedFaculties
            // happen at a nested level, and therefore react doesn't notice the
            // change.
            useForceUpdate();
          }}
          defaultChecked={isSelectedFaculty(faculty)}
        />
      </td>
    );
  };

  return currentlySelectedCourseID !== "" ? (
    <div className={styles.container}>
      <label className={styles.label}>
        <h2>Faculties</h2>
      </label>
      <Searchbar handleSearch={handleSearch}></Searchbar>
      <div className={styles.loading}>{loading && "Loading..."}</div>
      <div className={styles.error}>{error && "Error..."}</div>
      <div className={styles.tableWrapper}>
        <table className={styles.facultyTable}>
          {faculties.length === 0 ? (
            <tbody>
              <tr>
                <td>{!loading && !error && "No Results"}</td>
              </tr>
            </tbody>
          ) : (
            <>
              <thead>
                <tr className={styles.headRow}>
                  <th className={styles.cell} key="faculty-head-select"></th>
                  {Object.keys(faculties[0]).map((key) => {
                    if (
                      // eslint-disable-next-line no-undef
                      ignoreCols === undefined ||
                      // eslint-disable-next-line no-undef
                      (ignoreCols && !ignoreCols.includes(key))
                    )
                      return (
                        <th
                          className={styles.cell}
                          key={`faculties-head-${key}`}
                        >
                          {key}
                        </th>
                      );
                  })}
                </tr>
              </thead>

              <tbody>
                {selectedFaculties[currentlySelectedCourseID]?.map(
                  (faculty, index) => {
                    // if (!isSelectedFaculty(faculty)) return <></>;
                    // Rendering selected faculties
                    if (faculties.length === index + 1) {
                      return (
                        <tr
                          ref={lastElementRef}
                          className={`${styles.row} ${styles.selectedRow}`}
                          id={faculty["ERP ID"]}
                          key={`${faculty["ERP ID"]}-s`}
                        >
                          <InteractionElement
                            faculty={faculty}
                            customKey={`${faculty["ERP ID"]}-s-i`}
                          ></InteractionElement>

                          <InfoCols
                            entry={faculty}
                            getID={(faculty) => faculty["ERP ID"] + "s"}
                            styles={styles}
                          ></InfoCols>
                        </tr>
                      );
                    } else {
                      return (
                        <tr
                          className={`${styles.row} ${styles.selectedRow}`}
                          id={faculty["ERP ID"]}
                          key={`${faculty["ERP ID"]}-s`}
                        >
                          <InteractionElement
                            faculty={faculty}
                            customKey={`${faculty["ERP ID"]}-s-i`}
                          ></InteractionElement>

                          <InfoCols
                            entry={faculty}
                            getID={(faculty) => faculty["ERP ID"] + "s"}
                            styles={styles}
                          ></InfoCols>
                        </tr>
                      );
                    }
                  }
                )}
                {faculties.map((faculty, index) => {
                  if (isSelectedFaculty(faculty)) return <></>;
                  // Rendering unselected faculties
                  if (faculties.length === index + 1) {
                    return (
                      <tr
                        ref={lastElementRef}
                        className={`${styles.row} ${styles.notSelectedRow}`}
                        id={faculty["ERP ID"]}
                        key={`${faculty["ERP ID"]}-u`}
                      >
                        <InteractionElement
                          faculty={faculty}
                          customKey={`${faculty["ERP ID"]}-u-i`}
                        ></InteractionElement>

                        <InfoCols
                          entry={faculty}
                          getID={(faculty) => faculty["ERP ID"] + "u"}
                          styles={styles}
                        ></InfoCols>
                      </tr>
                    );
                  } else {
                    return (
                      <tr
                        id={faculty["ERP ID"]}
                        className={`${styles.row} ${styles.notSelectedRow}`}
                        key={`${faculty["ERP ID"]}-u`}
                      >
                        <InteractionElement
                          faculty={faculty}
                          customKey={`${faculty["ERP ID"]}-u-i`}
                        ></InteractionElement>

                        <InfoCols
                          entry={faculty}
                          getID={(faculty) => faculty["ERP ID"] + "u"}
                          styles={styles}
                        ></InfoCols>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </>
          )}
        </table>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default FacultiesPreferenceList;
