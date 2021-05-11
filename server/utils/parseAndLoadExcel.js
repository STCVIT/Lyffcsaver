const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const { matchesField, matchesFieldAll } = require("./matchesField");
const parseAndLoadExcel = async (filePath) => {
  const courses = [];
  const faculties = [];
  const classes = [];

  const workbook = XLSX.readFile(filePath);
  const sheetNameList = workbook.SheetNames;
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

  for (const classInfo of data) {
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

    if (matchingFaculty === null) {
      const newFaculty = {
        "ERP ID": classInfo["ERP ID"],
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
        "COURSE TYPE": classInfo["COURSE TYPE"],
        "LECTURE HOURS": classInfo["LECTURE HOURS"],
        "PROJECT HOURS": classInfo["PROJECT HOURS"],
        "TUTORIAL HOURS": classInfo["TUTORIAL HOURS"],
        "PRACTICAL HOURS": classInfo["PRACTICAL HOURS"],
        CREDITS: classInfo["CREDITS"],
      };
      courses.push(newCourse);
    }
    const newClass = {
      "ERP ID": classInfo["ERP ID"],
      "COURSE CODE": classInfo["COURSE CODE"],
      "CLASS ID": classInfo["CLASS ID"],
      "ASSO CLASS ID": classInfo["ASSO CLASS ID"],
      SLOT: classInfo["SLOT"],
      "COURSE TYPE": classInfo["COURSE TYPE"],
      "ROOM NUMBER": classInfo["ROOM NUMBER"],
      BATCH: classInfo["BATCH"],
      "CLASS OPTION": classInfo["CLASS OPTION"],
      "CLASS TYPE": classInfo["CLASS TYPE"],
      "COURSE MODE": classInfo["COURSE MODE"],
      "ALLOCATED SEATS": classInfo["ALLOCATED SEATS"],
      "REGISTERED SEATS": classInfo["REGISTERED SEATS"],
      "WAITING SEATS": classInfo["WAITING SEATS"],
      "COURSE STATUS": classInfo["COURSE STATUS"],
    };
    classes.push(newClass);
  }
  fs.writeFile(
    path.join("data", "faculties.json"),
    JSON.stringify(faculties),
    (err) => {
      if (err !== null) console.log(err);
    }
  );
  fs.writeFile(
    path.join("data", "courses.json"),
    JSON.stringify(courses),
    (err) => {
      if (err !== null) console.log(err);
    }
  );
  fs.writeFile(
    path.join("data", "classes.json"),
    JSON.stringify(classes),
    (err) => {
      if (err !== null) console.log(err);
    }
  );
};

module.exports = { parseAndLoadExcel };
