import styles from "../css/Timetable.module.css";
import timetableTemplateData from "../utils/timetableTemplateData";
const TimetablePreview = ({ slots, id, select }) => {
  let dayCount = 0;
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
  return (
    <>
      <table
        className={styles.timetablePreview}
        onClick={async (e) => {
          console.log("event", e, JSON.stringify(slots));
          await select(slots);

          document
            .querySelectorAll(`.${styles.selectedTimetablePreview}`)
            ?.forEach((element) =>
              element.classList.remove(styles.selectedTimetablePreview)
            );

          let element = e.target;
          while (element !== null && element !== undefined) {
            if (element.classList.contains(styles.timetablePreview)) {
              element.classList.add(styles.selectedTimetablePreview);
              break;
            }
            element = element.parentNode;
          }
        }}
      >
        <thead>
          {timetableTemplateData.slice(0, 4).map((row, rowIndex) => {
            return (
              <tr key={`${id}-row-${rowIndex}`}>
                {row.map((cell, index) => {
                  return cell === "" ? (
                    <></>
                  ) : (
                    <th
                      key={`${id}-${rowIndex}-${index}`}
                      className={getClassName(cell, rowIndex, index)}
                      rowSpan={index === 0 ? 2 : 1}
                    ></th>
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
                  return cell === "" ? (
                    <></>
                  ) : (
                    <td
                      key={`${id}-${rowIndex}-${cellIndex}`}
                      className={`${getClassName(
                        cell,
                        rowIndex + 4,
                        cellIndex
                      )}`}
                      rowSpan={cellIndex === 0 ? 2 : 1}
                    ></td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TimetablePreview;
