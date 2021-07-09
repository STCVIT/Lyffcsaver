import timetableStyles from "../css/Timetable.module.css";
import timetableTemplateData from "../utils/timetableTemplateData";

const Timetable = ({ slots, selectedClasses, hoveredSlots }) => {
  console.log("rendering timetable", slots);
  let dayCount = 0;
  const id = "final-display";
  const getCellContent = (schedule, cell) => {
    const courseIDs = Object.keys(schedule);
    const courseID = courseIDs.find((courseID) =>
      schedule[courseID]["SLOT"].split("+").includes(cell)
    );
    if (
      schedule === undefined ||
      courseIDs.length === 0 ||
      courseID === undefined ||
      !(
        schedule[courseID] &&
        slots.includes(schedule[courseID]["SLOT"].split("+")[0])
      )
    )
      return cell;
    return `${cell}-${courseID}-${schedule[courseID]["ROOM NUMBER"]}`;
  };
  const getClassName = (cellContent, rowIndex, cellIndex) => {
    let className = `${timetableStyles.cell} `;
    if (cellIndex < 2) {
      className += `${timetableStyles.headDay}`;
      return className;
    }
    if (rowIndex < 2) {
      className += ` ${timetableStyles.theoryTiming} `;
    }
    if (rowIndex >= 2 && rowIndex < 4) {
      className += ` ${timetableStyles.labTiming} `;
    }
    if (rowIndex < 4) {
      className += ` ${timetableStyles.cell} ${timetableStyles.headTop} `;
      return className;
    }
    if (cellContent === "Lunch") {
      className += `${timetableStyles.lunch}`;
      return className;
    }
    if (hoveredSlots.includes(cellContent)) {
      if (rowIndex % 2 === 0) {
        className += `${timetableStyles.theory} ${timetableStyles.hoveredTheory}`;
        return className;
      } else {
        className += `${timetableStyles.lab} ${timetableStyles.hoveredLab}`;
        return className;
      }
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
    <div className={timetableStyles.container}>
      <div className={timetableStyles.legend}>
        <div className={timetableStyles.theoryLegend}>
          <div className={timetableStyles.colorExample}></div>
          <div className={timetableStyles.legendLabel}>Theory Slot</div>
        </div>
        <div className={timetableStyles.labLegend}>
          <div className={timetableStyles.colorExample}></div>
          <div className={timetableStyles.legendLabel}>Lab Slot</div>
        </div>
      </div>
      <table className={timetableStyles.timetable}>
        <thead>
          {timetableTemplateData.slice(0, 4).map((row, rowIndex) => {
            return (
              <tr key={`${id}-row-${rowIndex}`}>
                {row.map((cell, index) => {
                  return cell === "" || index === 1 ? (
                    <></>
                  ) : (
                    <th
                      key={`${id}-${rowIndex}-${index}`}
                      className={getClassName(cell, rowIndex, index)}
                      rowSpan={index === 0 ? 2 : 1}
                    >
                      {cell !== "Lunch" ? cell : ""}
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
                  return cell === "" ||
                    cellIndex === 1 ||
                    (rowIndex > 0 && cell === "Lunch") ? (
                    <></>
                  ) : (
                    <td
                      key={`${id}-${rowIndex}-${cellIndex}`}
                      className={`${getClassName(
                        cell,
                        rowIndex + 4,
                        cellIndex
                      )}`}
                      rowSpan={cell === "Lunch" ? 14 : cellIndex === 0 ? 2 : 1}
                    >
                      {getCellContent(selectedClasses, cell)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
