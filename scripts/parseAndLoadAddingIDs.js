const XLSX = require("xlsx");
const { matchesField, matchesFieldAll } = require("./matchesFieldNotStrict");
const fs = require("fs");
const path = require("path");

let count = 0;
let facultiesCount = 0;

const inferCourseTypeFromSlot = (course) => {
  if (course["SLOT"] === "NIL") {
    return "project";
  } else if (course["SLOT"].startsWith("L")) {
    return "lab";
  } else {
    return "theory";
  }
};

const isCourseWithMultipleComponents = (course, data) => {
  const courseCode = course["COURSE CODE"];
  const modifiedCourseCode = courseCode.replace(/[a-zA-Z]$/, "");
  const classesOfCourse = data.filter((course) => {
    return (
      course["COURSE CODE"].startsWith(modifiedCourseCode) ||
      course["COURSE CODE"] === courseCode
    );
  });
  const availableCourseTypes = new Set();
  for (const classInfo of classesOfCourse) {
    availableCourseTypes.add(inferCourseTypeFromSlot(classInfo));
    if (availableCourseTypes.size > 1) return true;
  }
  return false;
};

const getInferredCourseType = (course, data) => {
  if (
    course["COURSE TYPE"] !== undefined &&
    course["COURSE TYPE"] !== null &&
    course["COURSE TYPE"] !== ""
  ) {
    return course["COURSE TYPE"];
  }
  const typeFromSlot = inferCourseTypeFromSlot(course);
  const containsMultipleTypes = isCourseWithMultipleComponents(course, data);
  if (containsMultipleTypes) {
    if (typeFromSlot === "project") {
      return "EPJ";
    } else if (typeFromSlot === "lab") {
      return "ELA";
    } else if (typeFromSlot === "theory") {
      return "ETH";
    }
    return "NA";
  } else {
    if (typeFromSlot === "project") {
      return "PJT";
    } else if (typeFromSlot === "lab") {
      return "LO";
    } else if (typeFromSlot === "theory") {
      return "TH";
    }
    return "NA";
  }
};

const getCourseID = (course, data) => {
  const courseType = getInferredCourseType(course, data);
  return `${course["COURSE CODE"]}-${courseType}`;
};

const getClassID = (course, data) => {
  const courseType = getInferredCourseType(course, data);
  return `${course["COURSE CODE"]}-${courseType}-${count++}`;
};

const getFacultyID = (currFaculty, faculties) => {
  if (currFaculty["ERP ID"]) return currFaculty["ERP ID"];
  const faculty = matchesField(
    currFaculty["EMPLOYEE NAME"],
    "EMPLOYEE NAME",
    faculties
  );
  if (faculty) return faculty["ERP ID"];
  return null;
};
const parseAndLoadExcel = async (filePath, writeDir) => {
  const courses = [];
  const faculties = [];
  const classes = [];
  const workbook = XLSX.readFile(filePath);
  const sheetNameList = workbook.SheetNames;
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
  for (const classInfo of data) {
    const matchingFaculties = [
      matchesField(classInfo["ERP ID"], "ERP ID", faculties),
      matchesField(classInfo["EMPLOYEE NAME"], "EMPLOYEE NAME", faculties),
    ];
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
    const existingFacultyID = getFacultyID(classInfo, faculties);
    const currentClassFacultyID =
      existingFacultyID !== null && existingFacultyID !== undefined
        ? existingFacultyID
        : facultiesCount++;
    if (existingFacultyID === null) {
      console.log(
        "No matching faculty found for: ",
        classInfo["EMPLOYEE NAME"],
        currentClassFacultyID
      );
    } else {
      console.log(
        "Matching faculty found for: ",
        classInfo["EMPLOYEE NAME"],
        currentClassFacultyID === existingFacultyID,
        getFacultyID(classInfo, faculties)
      );
    }
    const currentCourseType = getInferredCourseType(classInfo, data);
    console.log("Current course type: ", currentCourseType);
    const newClass = {
      "ERP ID": currentClassFacultyID,
      "COURSE CODE": classInfo["COURSE CODE"],
      "CLASS ID":
        classInfo["CLASS ID"] === undefined
          ? getClassID(classInfo, data)
          : classInfo["CLASS ID"],
      "ASSO CLASS ID": classInfo["ASSO CLASS ID"],
      SLOT: classInfo["SLOT"],
      "COURSE TYPE": currentCourseType,
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
    classes.push(newClass);
    if (matchingFaculties[0] === null && matchingFaculties[1] === null) {
      const newFaculty = {
        "ERP ID": currentClassFacultyID,
        "EMPLOYEE NAME": classInfo["EMPLOYEE NAME"],
        "EMPLOYEE SCHOOL": classInfo["EMPLOYEE SCHOOL"],
      };
      faculties.push(newFaculty);
    }
    if (matchingCourse === null) {
      const newCourse = {
        "COURSE OWNER": classInfo["COURSE OWNER"],
        "COURSE CODE": classInfo["COURSE CODE"],
        "COURSE TITLE": classInfo["COURSE TITLE"],
        "COURSE TYPE": currentCourseType,
        "LECTURE HOURS": classInfo["LECTURE HOURS"],
        "PROJECT HOURS": classInfo["PROJECT HOURS"],
        "TUTORIAL HOURS": classInfo["TUTORIAL HOURS"],
        "PRACTICAL HOURS": classInfo["PRACTICAL HOURS"],
        CREDITS: classInfo["CREDITS"],
      };
      newCourse["COURSE ID"] = getCourseID(newCourse, data);
      courses.push(newCourse);
    }
  }
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

parseAndLoadExcel(process.argv[2], process.argv[3]);
