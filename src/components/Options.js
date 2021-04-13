import styles from "../css/Options.module.css";
import SearchableList from "./SearchableList";
const Options = () => {
    return (
        <div className={styles.screen}>
            <div className={styles.row}>
                <div className={styles.option}>
                    <label htmlFor="semester">
                        <h2>Semester</h2>
                    </label>
                    <select name="semester" id="semester">
                        <option value="fal-sem-19">
                            Fall Semester 2019-20
                        </option>
                        <option value="win-sem-19">
                            Winter Semester 2019-20
                        </option>
                        <option value="fal-sem-20">
                            Fall Semester 2020-21
                        </option>
                        <option value="win-sem-20">
                            Winter Semester 2020-21
                        </option>
                    </select>
                </div>
                <div className={styles.option}>
                    <label htmlFor="year">
                        <h2>Year</h2>
                    </label>
                    <input
                        type="number"
                        id="year"
                        min={new Date().getFullYear() - 5}
                        max={new Date().getFullYear() + 1}
                        step="1"
                        defaultValue={new Date().getFullYear()}
                    />
                </div>
                <div className={styles.option}>
                    <label htmlFor="branch">
                        <h2>Branch</h2>
                    </label>
                    <select name="branch" id="branch">
                        <option value="cse-info-sec">
                            CSE with Information Security
                        </option>
                        <option value="cse-info-sec">
                            CSE with Information Security
                        </option>
                        <option value="cse-info-sec">
                            CSE with Information Security
                        </option>
                    </select>
                </div>
                <div className={styles.option}>
                    <label htmlFor="school">
                        <h2>School</h2>
                    </label>
                    <select name="school" id="school">
                        <option value="scope">Scope</option>
                        <option value="scope">Scope</option>
                        <option value="scope">Scope</option>
                    </select>
                </div>
            </div>
            <div className={styles.row}>
                <SearchableList
                    name={"Available Courses"}
                    values={[
                        ["MAT1014", "Discrete Mathematics"],
                        ["MAT1014", "Discrete Mathematics"],
                        ["MAT1014", "Discrete Mathematics"],
                    ]}
                    listType="add"
                ></SearchableList>
                <SearchableList
                    name={"Selected Courses"}
                    values={[
                        ["MAT1014", "Discrete Mathematics"],
                        ["MAT1014", "Discrete Mathematics"],
                        ["MAT1014", "Discrete Mathematics"],
                    ]}
                    listType="remove"
                ></SearchableList>
                <SearchableList
                    name={"Faculty Preference"}
                    values={[
                        ["Clement J"],
                        ["Manimaran A"],
                        ["Bhulakshmi"],
                        ["Uma"],
                    ]}
                    listType="ranked"
                ></SearchableList>
            </div>
        </div>
    );
};

export default Options;
