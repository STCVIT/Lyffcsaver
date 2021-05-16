import TimetablePreview from "./TimetablePreview";
import styles from "../css/TimetablePreviews.module.css";
const TimetablePreviews = ({ schedulesSlots, select }) => {
  console.log("in timetable previews", schedulesSlots);
  return (
    <div className={styles.container}>
      {schedulesSlots?.map((slotsString) => {
        const slots = slotsString.split("+");
        return (
          <TimetablePreview
            key={`${slotsString}-timetable`}
            id={`${slotsString}-timetable`}
            slots={slots}
            select={select}
          ></TimetablePreview>
        );
      })}
    </div>
  );
};

export default TimetablePreviews;
