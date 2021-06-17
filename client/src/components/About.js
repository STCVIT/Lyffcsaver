import Header from "./Header";
import styles from "../css/About.module.css";
import lady from "../assets/aboutPageLady.svg";
import man from "../assets/aboutPageMan.svg";

const About = ({ logoVariant }) => {
  return (
    <>
      <Header logoVariant={logoVariant} />
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>About Us</h1>
        </div>
        <div className={styles.cols}>
          <div className={styles.col}>
            <div className={styles.title}>
              <h2>Our Vision</h2>
            </div>
            <p>
              Lyffcsaver aims at providing a user- friendly interface using
              which students can prepare their own timetables for the upcoming
              semesters with ease, saving them the hassle of using the fully
              flexible credit system.
            </p>
            <img src={lady} alt="" />
          </div>
          <div className={styles.col}>
            <img src={man} alt="" />
            <div className={styles.title}>
              <h2>Features</h2>
            </div>
            <p>
              Choose from a variety of courses and faculties to find your
              perfect fit. Want to keep fridays light? Don’t like waking up
              early everyday? Don’t worry, we’ve got you covered. Keep slots
              free according to your convenience.
            </p>
            <p>
              Find the timetable which suits you best from multiple options.
              Take screenshots for saving and sharing.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
