import styles from "../css/Timetable.module.css";
import timetableTemplateData from "../utils/timetableTemplateData";
import cameraImg from "../assets/camera.svg";
import html2canvas from "html2canvas";

const Timetable = ({ slots, selectedClasses, hoveredSlots }) => {
  // console.log("rendering timetable", slots);
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
    if (hoveredSlots.includes(cellContent)) {
      if (rowIndex % 2 === 0) {
        className += `${styles.theory} ${styles.hoveredTheory}`;
        return className;
      } else {
        className += `${styles.lab} ${styles.hoveredLab}`;
        return className;
      }
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
    <div className={styles.container}>
      <table className={styles.timetable} id="filled-out-timetable">
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
      <div className={styles.buttons}>
        <input
          type="image"
          src={cameraImg}
          alt="Download timetable image"
          onClick={() => {
            const help = document.getElementById("help");
            html2canvas(help, {
              // allowTaint: true,
              // backgroundColor: "#000",
              // foreignObjectRendering: true,
              // logging: true,
              // useCORS: true,
            }).then((canvas) => {
              console.log(help, canvas);
              const a = document.createElement("a");
              a.href = canvas.toDataURL("image/png");
              // a.download = `timetable-${slots.join("+")}.png`;
              a.download = "help.png";
              a.click();
            });
          }}
        />
      </div>
    </div>
  );
};

export default Timetable;
