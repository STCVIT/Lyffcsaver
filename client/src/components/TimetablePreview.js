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
      {/* <h3>{slots.join("+")}</h3> */}
      <table
        className={styles.timetablePreview}
        onClick={() => {
          select(slots);
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
                      className={`${styles.cell} ${styles.headTime}`}
                      rowSpan={index === 0 ? 2 : 1}
                    >
                      {/* {cell} */}
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
                  return cell === "" ? (
                    <></>
                  ) : (
                    <td
                      key={`${id}-${rowIndex}-${cellIndex}`}
                      className={`${getClassName(cell, rowIndex, cellIndex)}`}
                      rowSpan={cellIndex === 0 ? 2 : 1}
                    >
                      {/* {cell} */}
                    </td>
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