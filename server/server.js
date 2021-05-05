// includes code from
// https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5
const express = require("express");
const app = express();
const port = 3001;
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const matchesField = (matchData, fieldName, collection) => {
  for (const data of collection) {
    if (data[fieldName] === undefined) continue;
    if (data[fieldName] === matchData) return data;
  }
  return null;
};

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
    const matchingCourse = matchesField(
      classInfo["COURSE CODE"],
      "COURSE CODE",
      courses
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
      SLOT: classInfo["SLOT"],
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
    path.join(__dirname, "data", "faculties.json"),
    JSON.stringify(faculties, null, "\t"),
    (err) => {
      if (err !== null) console.log(err);
    }
  );
  fs.writeFile(
    path.join(__dirname, "data", "courses.json"),
    JSON.stringify(courses, null, "\t"),
    (err) => {
      if (err !== null) console.log(err);
    }
  );
  fs.writeFile(
    path.join(__dirname, "data", "classes.json"),
    JSON.stringify(classes, null, "\t"),
    (err) => {
      if (err !== null) console.log(err);
    }
  );
};
parseAndLoadExcel(
  path.join(
    __dirname,
    "course-allocation",
    "WINSEM2019-20_ALL_ALLOCATIONREPORT_22-10-2019.xlsx"
  )
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
