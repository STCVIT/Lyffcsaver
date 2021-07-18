import timetableTemplateData from "../utils/timetableTemplateData";
import styles from "../css/ReserveSlotsBubbles.module.css";
const ReserveSlotsBubbles = ({ reservedSlots, toggleReserve }) => {
  // const shown = [];
  const Bubble = ({ cellContent, row, col }) => {
    let alreadyShown = false;
    // for (let i = 0; i < row; i++)
    //   for (let j = 0; j < timetableTemplateData[row].length; j++)
    //     if (cellContent === timetableTemplateData[i][j]) alreadyShown = true;
    for (let i = 0; i < row; i++)
      if (timetableTemplateData[i].includes(cellContent)) alreadyShown = true;
    for (let j = 0; j < col; j++)
      if (cellContent === timetableTemplateData[row][j]) alreadyShown = true;
    if (alreadyShown) return <></>;
    const pattern = /[A-Z]+\d+/;
    if (pattern.test(cellContent)) {
      return (
        <a
          className={`${styles.bubble} ${
            reservedSlots.includes(cellContent) ? styles.reserved : ""
          }`}
          onClick={() => toggleReserve(cellContent)}
        >
          {cellContent}
        </a>
      );
    }
    return <></>;
  };
  return (
    <div className={styles.container}>
      <div className={styles.col}>
        {timetableTemplateData.slice(4).map((row, rowIndex) => {
          return (
            <div
              className={styles.row}
              key={`reserve-bubble-morning-${rowIndex}`}
            >
              {row.slice(2, 9).map((cell, cellIndex) => (
                <Bubble
                  cellContent={cell}
                  row={rowIndex + 4}
                  col={cellIndex + 2}
                  key={`reserve-bubble-${rowIndex}-${cellIndex}`}
                ></Bubble>
              ))}
            </div>
          );
        })}
      </div>
      <span className={styles.separator}></span>
      <div className={styles.col}>
        {timetableTemplateData.slice(4).map((row, rowIndex) => {
          return (
            <div
              className={styles.row}
              key={`reserve-bubble-evening-${rowIndex}`}
            >
              {row.slice(9).map((cell, cellIndex) => (
                <Bubble
                  cellContent={cell}
                  row={rowIndex + 4}
                  col={cellIndex + 9}
                  key={`reserve-bubble-${rowIndex}-${cellIndex}`}
                ></Bubble>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReserveSlotsBubbles;
