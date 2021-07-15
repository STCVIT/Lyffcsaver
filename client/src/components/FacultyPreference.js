import styles from "../css/FacultyPreference.module.css";
import Button from "./Button";
const FacultyPreference = ({ selectedFaculties }) => {
  return (
    <div className={styles.container}>
      <div className={styles.facultyPriority}>
        <div className={`${styles.title} body1-bold`}>Faculty Priority</div>
        <div className={styles.addedFaculties}>
          <div className={styles.resultsWrapper}>
            {selectedFaculties?.map((selectedFaculty) => {
              return (
                <div
                  className={styles.faculty}
                  key={`selected-faculty-${selectedFaculty["ERP ID"]}`}
                ></div>
              );
            })}
          </div>
          <Button classes={styles.addFacultiesButton} type="primary">
            ADD FACULTIES +
          </Button>
          <div className={styles.buttons}>
            <Button type="clear">CLEAR</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyPreference;
