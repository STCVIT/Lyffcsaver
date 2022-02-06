const XLSX = require("xlsx");
const { matchesField, matchesFieldAll } = require("./matchesField");
// const { db } = require("../firebase/firebaseConfig");
const fs = require("fs");
const path = require("path");
const FACULTIES = "FACULTIES";
const COURSES = "COURSES";
const CLASSES = "CLASSES";

let count = 0;
let coursesUploaded = 0,
  coursesFailed = 0,
  classesUploaded = 0,
  classesFailed = 0,
  facultiesUploaded = 0,
  facultiesFailed = 0;
let failedFacultyData = [],
  failedCourseData = [],
  failedClassData = [];
const getCourseID = (course) => {
  return `${course["COURSE CODE"]}-${course["COURSE TYPE"]}`;
};

const getClassID = (course) => {
  const courseType =
    course["COURSE TYPE"] === undefined ? "NA" : course["COURSE TYPE"];
  return `${course["COURSE CODE"]}-${courseType}-${count++}`;
};
const addUnique = async (uniqueField, collectionName, data) => {
  // try {
  //   await db
  //     .collection(collectionName)
  //     .where(uniqueField, "==", data[uniqueField])
  //     .get()
  //     .then(async (snapshot) => {
  //       if (snapshot.docs.length === 0)
  //         await db.collection(collectionName).add(data);
  //     });
  //   if (collectionName === FACULTIES) {
  //     facultiesUploaded++;
  //   } else if (collectionName === COURSES) {
  //     coursesUploaded++;
  //   } else if (collectionName === CLASSES) {
  //     classesUploaded++;
  //   }
  // } catch (e) {
  //   if (collectionName === FACULTIES) {
  //     facultiesFailed++;
  //     failedFacultyData.push(data);
  //   } else if (collectionName === COURSES) {
  //     coursesFailed++;
  //     failedCourseData.push(data);
  //   } else if (collectionName === CLASSES) {
  //     classesFailed++;
  //     failedClassData.push(data);
  //   }
  // }
};
const parseAndLoadExcel = async (filePath, writeDir) => {
  const courses = [];
  const faculties = [];
  const classes = [];
  const workbook = XLSX.readFile(filePath);
  const sheetNameList = workbook.SheetNames;
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
  // console.log(data[0])
  for (const classInfo of data) {
    // classInfo["CLASS TYPE"] = classInfo["CLASS TY"]
    // classInfo["ROOM NUMBER"] = classInfo["ROOM NUMBE"]
    const matchingFaculty = matchesField(
      classInfo["ERP ID"],
      "ERP ID",
      faculties
    );
    const matchingCourses = matchesFieldAll(
      classInfo["COURSE CODE"],
      "COURSE CODE",
      courses
    );
    const matchingCourse = matchesField(
      classInfo["COURSE TYPE"],
      "COURSE TYPE",
      matchingCourses
    );
    const newClass = {
      "ERP ID": classInfo["ERP ID"],
      "COURSE CODE": classInfo["COURSE CODE"],
      "CLASS ID":
        classInfo["CLASS ID"] === undefined
          ? getClassID(classInfo)
          : classInfo["CLASS ID"],
      "ASSO CLASS ID": classInfo["ASSO CLASS ID"],
      SLOT: classInfo["SLOT"],
      "COURSE TYPE":
        classInfo["COURSE TYPE"] === undefined
          ? "NA"
          : classInfo["COURSE TYPE"],
      "ROOM NUMBER":
        classInfo["ROOM NUMBER"] === undefined
          ? "NA"
          : classInfo["ROOM NUMBER"],
      BATCH: classInfo["BATCH"] === undefined ? "-" : classInfo["BATCH"],
      "CLASS OPTION": classInfo["CLASS OPTION"],
      "CLASS TYPE": classInfo["CLASS TYPE"],
      "COURSE MODE": classInfo["COURSE MODE"],
      "ALLOCATED SEATS": classInfo["ALLOCATED SEATS"],
      "REGISTERED SEATS": classInfo["REGISTERED SEATS"],
      "WAITING SEATS": classInfo["WAITING SEATS"],
      "COURSE STATUS": classInfo["COURSE STATUS"],
    };
    // if (classInfo["SLOT"] !== "NIL") {
    classes.push(newClass);
    // await addUnique("CLASS ID", CLASSES, newClass);
    // console.assert(classInfo["COURSE TYPE"] !== "EPJ", getCourseID(classInfo));
    if (matchingFaculty === null) {
      const newFaculty = {
        "ERP ID": classInfo["ERP ID"],
        "EMPLOYEE NAME": classInfo["EMPLOYEE NAME"],
        "EMPLOYEE SCHOOL": classInfo["EMPLOYEE SCHOOL"],
      };
      faculties.push(newFaculty);
      // await addUnique("ERP ID", FACULTIES, newFaculty);
      // }
      // console.assert(
      //   classInfo["COURSE TYPE"] !== "EPJ",
      //   getCourseID(classInfo)
      // );
      // await addUnique("COURSE ID", COURSES, newCourse);
    }
    if (matchingCourse === null) {
      const newCourse = {
        "COURSE OWNER": classInfo["COURSE OWNER"],
        "COURSE CODE": classInfo["COURSE CODE"],
        "COURSE TITLE": classInfo["COURSE TITLE"],
        "COURSE TYPE": classInfo["COURSE TYPE"],
        "LECTURE HOURS": classInfo["LECTURE HOURS"],
        "PROJECT HOURS": classInfo["PROJECT HOURS"],
        "TUTORIAL HOURS": classInfo["TUTORIAL HOURS"],
        "PRACTICAL HOURS": classInfo["PRACTICAL HOURS"],
        CREDITS: classInfo["CREDITS"],
      };
      newCourse["COURSE ID"] = getCourseID(newCourse);
      courses.push(newCourse);
      // console.assert(
      //   classInfo["COURSE TYPE"] !== "EPJ",
      //   getCourseID(newCourse)
      // );
    }
  }
  // console.log(`Classes uploaded: ${classesUploaded}`);
  // console.log(`Classes failed: ${classesFailed}`);
  // console.log(`Classes total: ${classes.length}`);
  // console.log(`Courses uploaded: ${coursesUploaded}`);
  // console.log(`Courses failed: ${coursesFailed}`);
  // console.log(`Courses total: ${courses.length}`);
  // console.log(`Faculties uploaded: ${facultiesUploaded}`);
  // console.log(`Faculties failed: ${facultiesFailed}`);
  // console.log(`Faculties total: ${faculties.length}`);
  // fs.writeFile(
  //   path.join("data", "faculties.json"),
  //   JSON.stringify(failedFacultyData),
  //   (err) => {
  //     if (err !== null) console.log(err);
  //   }
  // );
  // fs.writeFile(
  //   path.join("data", "courses.json"),
  //   JSON.stringify(failedCourseData),
  //   (err) => {
  //     if (err !== null) console.log(err);
  //   }
  // );
  // fs.writeFile(
  //   path.join("data", "classes.json"),
  //   JSON.stringify(failedClassData),
  //   (err) => {
  //     if (err !== null) console.log(err);
  //   }
  // );
  if (!fs.existsSync(writeDir)) fs.mkdirSync(writeDir);
  fs.writeFile(
    path.join(writeDir, "faculties.json"),
    JSON.stringify(faculties),
    (err) => {
      if (err !== null) console.log(err);
    }
  );
  fs.writeFile(
    path.join(writeDir, "courses.json"),
    JSON.stringify(courses),
    (err) => {
      if (err !== null) console.log(err);
    }
  );
  fs.writeFile(
    path.join(writeDir, "classes.json"),
    JSON.stringify(classes),
    (err) => {
      if (err !== null) console.log(err);
    }
  );
};

// console.log("hello", process.argv);
parseAndLoadExcel(process.argv[2], process.argv[3]);
