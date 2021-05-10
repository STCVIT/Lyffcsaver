import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../css/FacultiesPreferenceList.module.css";
import useDataSearch from "../utils/useDataSearch";
import Searchbar from "./Searchbar";
import InfoCols from "./InfoCols";

const FacultiesPreferenceList = ({ currentlySelectedCourse, ignoreCols }) => {
  const [facultyPreferenceInfo, setFacultyPreferenceInfo] = useState({});

  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { data: faculties, hasMore, loading, error } = useDataSearch(
    { course: currentlySelectedCourse, query, pageNumber },
    "faculties"
  );

  useEffect(() => {
    if (currentlySelectedCourse === "") return;
    const newFacultyPreferenceInfo = facultyPreferenceInfo;
    newFacultyPreferenceInfo[currentlySelectedCourse] = faculties;
    setFacultyPreferenceInfo(newFacultyPreferenceInfo);
  }, [currentlySelectedCourse]);

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

  console.log(
    "rerendering faculties",
    facultyPreferenceInfo,
    query,
    pageNumber,
    faculties,
    hasMore,
    loading,
    error
  );
  return currentlySelectedCourse !== "" ? (
    <div className={styles.container}>
      <label className={styles.label}>
        <h2>Faculties</h2>
      </label>
      <Searchbar handleSearch={handleSearch}></Searchbar>
      <div className={styles.loading}>{loading && "Loading..."}</div>
      <div className={styles.error}>{error && "Error..."}</div>
      <div className={styles.tableWrapper}>
        <table className={styles.facultyTable}>
          {faculties.length > 0 ? (
            <>
              <thead>
                <tr className={styles.headRow}>
                  {/* <th className={styles.cell} key="available-head-select"></th> */}
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
                  if (faculties.length === index + 1) {
                    return (
                      <tr
                        ref={lastElementRef}
                        className={styles.row}
                        key={faculty["ERP ID"]}
                      >
                        <InfoCols
                          entry={faculty}
                          idName="ERP ID"
                          styles={styles}
                        ></InfoCols>
                      </tr>
                    );
                  } else {
                    return (
                      <tr className={styles.row} key={faculty["ERP ID"]}>
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
          ) : (
            <tbody>
              <tr>
                <td>No Results</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default FacultiesPreferenceList;
