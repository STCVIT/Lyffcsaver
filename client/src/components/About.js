import styles from "../css/About.module.css";
import lady from "../assets/aboutPageLady.svg";
import schedules from "../assets/aboutPageSchedules.svg";

const About = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <span className={styles.goto} id="about">
            &nbsp;
          </span>
          <h1 className="heading1">About Us</h1>
        </div>
        <div className={styles.cols}>
          <div className={styles.col}>
            <div className={styles.content}>
              <div className={styles.title}>
                <h2 className="heading2">Our Vision</h2>
              </div>
              <p className="body1-medium">
                lyFFCSaver aims at providing a user-friendly interface using
                which students can prepare their own timetables for the upcoming
                semesters with ease, saving them the hassle of using the fully
                flexible credit system.
              </p>
            </div>
            <img src={lady} alt="" />
          </div>
          <div className={`${styles.col} ${styles.features}`}>
            <img src={schedules} alt="" />
            <div className={styles.content}>
              <div className={styles.title}>
                <h2 className="heading2">Features</h2>
              </div>
              <p className="body1-medium">
                Choose from a variety of courses and faculties to find your
                perfect fit. Want to keep fridays light? Don’t like waking up
                early everyday? Don’t worry, we’ve got you covered. Keep slots
                free according to your convenience.
              </p>
              <p className="body1-medium">
                Find the timetable which suits you best from multiple options.
                Take screenshots for saving and sharing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
