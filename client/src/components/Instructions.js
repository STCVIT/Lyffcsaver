import styles from "../css/Instructions.module.css";
import calenderEmoji from "../assets/calanderEmoji.svg";
import checkmark from "../assets/checkmark.svg";
const Instructions = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Make a customized timetable in 4 easy steps
        <img src={calenderEmoji} alt="" />
      </h1>
      <ul>
        <li>
          <img src={checkmark} alt="" /> Select your courses
        </li>
        <li>
          <img src={checkmark} alt="" /> Select your preferred faculty
        </li>
        <li>
          <img src={checkmark} alt="" /> Reserve the slots you want free{" "}
        </li>
        <li>
          <img src={checkmark} alt="" /> Generate timetables and pick the one
          most convenient for you
        </li>
      </ul>
    </div>
    // <ul id="help">
    //   <li>Lorem</li>
    //   <li>lorem</li>
    //   <li>lorem</li>
    //   <li>lorem</li>
    // </ul>
  );
};

export default Instructions;
