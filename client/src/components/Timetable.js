import timetableStyles from "../css/Timetable.module.css";
import timetableTemplateData from "../utils/timetableTemplateData";

const Timetable = ({ slots, classes }) => {
  console.log("timetable", slots, classes);
  let dayCount = 0;
  const id = "final-display";
  const getClassName = (cellContent, rowIndex, cellIndex) => {
    let className = `${timetableStyles.cell} `;
    if (cellIndex < 2) {
      className += `${timetableStyles.headDay}`;
      return className;
    }
    if (cellContent === "Lunch") {
      className += `${timetableStyles.lunch}`;
      return className;
    }
    if (slots.includes(cellContent)) {
      if (rowIndex % 2 === 0) {
        className += `${timetableStyles.theory}`;
        return className;
      } else {
        className += `${timetableStyles.lab}`;
        return className;
      }
    }
    if (dayCount % 2 === 0) {
      className += `${timetableStyles.evenDay}`;
      return className;
    } else {
      className += `${timetableStyles.oddDay}`;
      return className;
    }
  };
  return (
    <>
      <table className={timetableStyles.timetable}>
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
                      className={`${timetableStyles.cell} ${timetableStyles.headTime}`}
                      rowSpan={index === 0 ? 2 : 1}
                    >
                      {cell}
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
                      {cell}
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

export default Timetable;