import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../css/FacultiesPreferenceList.module.css";
import useDataSearch from "../utils/useDataSearch";
import Searchbar from "./Searchbar";
import InfoCols from "./InfoCols";

const FacultiesPreferenceList = ({
  currentlySelectedCourseCode,
  ignoreCols,
}) => {
  const [selectedFaculties, setSelectedFaculties] = useState({});

  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { data: faculties, hasMore, loading, error } = useDataSearch(
    { courseCode: currentlySelectedCourseCode, query, pageNumber },
    "faculties"
  );

  useEffect(() => {
    if (currentlySelectedCourseCode === "") return;
    setQuery("");
    setPageNumber(1);
  }, [currentlySelectedCourseCode]);
  useEffect(() => {
    console.log("new selected faculties", selectedFaculties);
  }, [selectedFaculties]);

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

  console.log("rerendering faculties");
  const isSelectedFaculty = (facultyToBeChecked) => {
    return (
      selectedFaculties[currentlySelectedCourseCode]?.find(
        (selectedFaculty) => {
          return selectedFaculty["ERP ID"] === facultyToBeChecked["ERP ID"];
        }
      ) !== undefined
    );
  };

  // start code from https://stackoverflow.com/a/53837442/13378825
  const [forcingValue, setForcingValue] = useState(0); // integer state
  function useForceUpdate() {
    setForcingValue((prevforcingValue) => prevforcingValue + 1); // update the state to force render
  }
  // end code from https://stackoverflow.com/a/53837442/13378825

  const InteractionElement = ({ faculty }) => {
    return (
      <td className={styles.cell}>
        <input
          type="checkbox"
          name="selected"
          id={`${faculty["ERP ID"]}-selected`}
          onClick={(e) => {
            let newSelectedFaculties = selectedFaculties;
            console.log(selectedFaculties);
            if (newSelectedFaculties[currentlySelectedCourseCode] === undefined)
              newSelectedFaculties[currentlySelectedCourseCode] = [];
            if (e.target.checked) {
              console.log("selecting", e.target.parentNode.parentNode.id);
              if (!isSelectedFaculty(faculty))
                newSelectedFaculties[currentlySelectedCourseCode].push(faculty);
            } else {
              console.log("deselecting", e.target.parentNode.parentNode.id);
              newSelectedFaculties[
                currentlySelectedCourseCode
              ] = newSelectedFaculties[currentlySelectedCourseCode].filter(
                (selectedFaculty) => {
                  console.log(
                    selectedFaculty,
                    e.target.parentNode.parentNode.id,
                    selectedFaculty["ERP ID"] !==
                      e.target.parentNode.parentNode.id
                  );
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

  return currentlySelectedCourseCode !== "" ? (
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
                {faculties.map((faculty, index) => {
                  if (!isSelectedFaculty(faculty)) return <></>;
                  // Rendering selected faculties
                  if (faculties.length === index + 1) {
                    return (
                      <tr
                        ref={lastElementRef}
                        className={styles.row}
                        id={faculty["ERP ID"]}
                        key={faculty["ERP ID"]}
                      >
                        <InteractionElement
                          faculty={faculty}
                        ></InteractionElement>

                        <InfoCols
                          entry={faculty}
                          idName="ERP ID"
                          styles={styles}
                        ></InfoCols>
                      </tr>
                    );
                  } else {
                    return (
                      <tr
                        className={styles.row}
                        id={faculty["ERP ID"]}
                        key={faculty["ERP ID"]}
                      >
                        <InteractionElement
                          faculty={faculty}
                        ></InteractionElement>

                        <InfoCols
                          entry={faculty}
                          idName="ERP ID"
                          styles={styles}
                        ></InfoCols>
                      </tr>
                    );
                  }
                })}
                {faculties.map((faculty, index) => {
                  if (isSelectedFaculty(faculty)) return <></>;
                  // Rendering unselected faculties
                  if (faculties.length === index + 1) {
                    return (
                      <tr
                        ref={lastElementRef}
                        className={styles.row}
                        id={faculty["ERP ID"]}
                        key={faculty["ERP ID"]}
                      >
                        <InteractionElement
                          faculty={faculty}
                        ></InteractionElement>

                        <InfoCols
                          entry={faculty}
                          idName="ERP ID"
                          styles={styles}
                        ></InfoCols>
                      </tr>
                    );
                  } else {
                    return (
                      <tr
                        className={styles.row}
                        id={faculty["ERP ID"]}
                        key={faculty["ERP ID"]}
                      >
                        <InteractionElement
                          faculty={faculty}
                        ></InteractionElement>

                        <InfoCols
                          entry={faculty}
                          idName="ERP ID"
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
