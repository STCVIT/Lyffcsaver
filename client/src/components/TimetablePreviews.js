import TimetablePreview from "./TimetablePreview";
import styles from "../css/TimetablePreviews.module.css";
import { useState } from "react";
import ReactPaginate from "react-paginate";
// using code from
// https://ihsavru.medium.com/react-paginate-implementing-pagination-in-react-f199625a5c8e
// for pagination.
const TimetablePreviews = ({ schedulesSlots, select }) => {
  const previewsPerPage = 15;
  const pageCount = Math.ceil(schedulesSlots.length / previewsPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  const currentPageData = schedulesSlots
    .slice(currentPage * previewsPerPage, (currentPage + 1) * previewsPerPage)
    .map((slotsString) => {
      const slots = slotsString.split("+");
      return (
        <TimetablePreview
          key={`${slotsString}-timetable`}
          id={`${slotsString}-timetable`}
          slots={slots}
          select={select}
        ></TimetablePreview>
      );
    });
  return (
    <div className={styles.panel}>
      <div className={styles.container}>{currentPageData}</div>
      <ReactPaginate
        previousLabel="<"
        nextLabel=">"
        pageCount={pageCount}
        onPageChange={({ selected }) => {
          setCurrentPage(selected);
          select([]);
        }}
        containerClassName={styles.paginatedPreviews}
        previousLinkClassName={styles.previous}
        nextLinkClassName={styles.next}
        disabledClassName={styles.disabled}
        activeClassName={styles.active}
      ></ReactPaginate>
    </div>
  );
};

export default TimetablePreviews;
