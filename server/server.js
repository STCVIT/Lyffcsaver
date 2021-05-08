// includes code from
// https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5
const express = require("express");
const app = express();
const port = 3001;
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const Fuse = require("fuse.js");

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
      "CLASS ID": classInfo["CLASS ID"],
      "ASSO CLASS ID": classInfo["ASSO CLASS ID"],
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
    JSON.stringify(faculties),
    (err) => {
      if (err !== null) console.log(err);
    }
  );
  fs.writeFile(
    path.join(__dirname, "data", "courses.json"),
    JSON.stringify(courses),
    (err) => {
      if (err !== null) console.log(err);
    }
  );
  fs.writeFile(
    path.join(__dirname, "data", "classes.json"),
    JSON.stringify(classes),
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

app.get("/courses", (req, res) => {
  const courses = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data", "courses.json"), "utf-8")
  );
  const fuse = new Fuse(courses, {
    keys: ["COURSE OWNER", "COURSE CODE", "COURSE TITLE"],
    threshold: 0.2,
  });

  const { query, pageNumber } = req.query;
  const size = 10;
  const startIndex = Number(Number(pageNumber - 1) * size);
  const endIndex = startIndex + Number(size);

  let results;
  if (query !== "") {
    console.log(`searching for ${query}`);
    results = fuse.search(query);
    let newResults = [];
    results.forEach((result) => {
      newResults.push(result.item);
    });
    results = newResults;
    console.log(`found ${results.length} results`);
  } else {
    results = courses;
  }

  const finalResults = results.slice(startIndex, endIndex);
  console.log(`sending courses from ${startIndex} to ${endIndex}`);
  if (endIndex < results.length - 1) {
    res.json({ courses: finalResults, hasMore: true });
  } else {
    res.json({ courses: finalResults, hasMore: false });
  }
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get("/faculties", (req, res) => {
//   const faculties = JSON.parse(
//     fs.readFileSync(path.join(__dirname, "data", "faculties.json"), "utf-8")
//   );
//   const { start, size } = req.query;

//   const startIndex = Number(start);
//   const endIndex = startIndex + Number(size);
//   console.log(
//     `sending faculties from ${startIndex} to ${endIndex}`,
//     faculties.slice(startIndex, endIndex)
//   );
//   res.json(faculties.slice(startIndex, endIndex));
// });

// app.get("/classes", (req, res) => {
//   const classes = JSON.parse(
//     fs.readFileSync(path.join(__dirname, "data", "classes.json"), "utf-8")
//   );
//   const { pageNumber } = req.query;
//   const size = 10;
//   const startIndex = Number(pageNumber * size);
//   const endIndex = startIndex + Number(size);
//   console.log(
//     `sending classes from ${startIndex} to ${endIndex}`
//   );
//   res.json(classes.slice(startIndex, endIndex));
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
