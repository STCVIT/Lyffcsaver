import styles from "../css/TimetablePreview.module.css";
import timetableTemplateData from "../utils/timetableTemplateData";
const TimetablePreview = ({ slots, id }) => {
  console.log("in timetable preview", slots, id);
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
      <table>
        <thead>
          {timetableTemplateData.slice(0, 4).map((row, rowIndex) => {
            return (
              <tr key={`${id}-row-${rowIndex}`}>
                {row.map((cell, index) => {
                  return (
                    <th
                      key={`${id}-${rowIndex}-${index}`}
                      className={`${styles.cell} ${styles.headTime}`}
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
                  return (
                    <td
                      key={`${id}-${rowIndex}-${cellIndex}`}
                      className={`${getClassName(cell, rowIndex, cellIndex)}`}
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
