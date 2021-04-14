import { useState } from "react";
import styles from "../css/Options.module.css";
import SearchableList from "./SearchableList";
const Options = () => {
    const courses = [
        {
            courseCode: "MAT1014",
            courseName: "Discrete Mathematics and Graph Theory",
            id: "c1",
            facultyId: ["f1", "f2", "f3", "f4"],
        },
        {
            courseCode: "MAT2001",
            courseName: "Statistics for Engineers",
            id: "c2",
            facultyId: ["f1", "f2", "f3", "f4"],
        },
        {
            courseCode: "CSE1002",
            courseName: "Problem solving and Programming",
            id: "c3",
            facultyId: ["f1", "f2", "f3", "f4"],
        },
        {
            courseCode: "CHY1701",
            courseName: "Engineering Chemistry",
            id: "c4",
            facultyId: ["f1", "f2", "f3", "f4"],
        },
        {
            courseCode: "CSE1003",
            courseName: "Digital Logic and Design",
            id: "c5",
            facultyId: ["f1", "f2", "f3", "f4"],
        },
        {
            courseCode: "CSE2011",
            courseName: "Data Structures and Algorithms",
            id: "c6",
            facultyId: ["f1", "f2", "f3", "f4"],
        },
    ];
    const faculties = [
        { name: "Clement J", id: "f1" },
        { name: "Manimaran A", id: "f2" },
        { name: "Bhulakshmi", id: "f3" },
        { name: "Uma", id: "f4" },
        { name: "Akhila M", id: "f5" },
        { name: "Sharief", id: "f6" },
    ];

    const [selectedCourses, setSelectedCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState(courses);
    const [facultyList, setFacultyList] = useState([]);

    const addCourse = (id) => {
        const course = availableCourses.find((element) => element.id === id);
        if (course === undefined) return;
        setSelectedCourses((prevSelectedCourses) => [
            ...prevSelectedCourses,
            course,
        ]);
        setAvailableCourses((prevAvailableCourses) =>
            prevAvailableCourses.filter((element) => element !== course)
        );
    };
    const removeCourse = (id) => {
        const course = selectedCourses.find((element) => element.id === id);
        if (course === undefined) return;
        setAvailableCourses((prevAvailableCourses) => [
            ...prevAvailableCourses,
            course,
        ]);
        setSelectedCourses((prevSelectedCourses) =>
            prevSelectedCourses.filter((element) => element !== course)
        );
    };
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
                    values={availableCourses}
                    listType="add"
                    onAdd={addCourse}
                ></SearchableList>
                <SearchableList
                    name={"Selected Courses"}
                    values={selectedCourses}
                    listType="remove"
                    onRemove={removeCourse}
                ></SearchableList>
                <SearchableList
                    name="Faculty Preference"
                    values={facultyList}
                    listType="ranked"
                ></SearchableList>
            </div>
        </div>
    );
};

export default Options;
