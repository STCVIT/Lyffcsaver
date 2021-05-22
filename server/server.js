// includes code from
// https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5

// // TODO: Clean data. Remove data with important fields as NIL.
// TODO: better error handling

const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const path = require("path");
const fs = require("fs");
const Fuse = require("fuse.js");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded));
app.use(express.static(path.join(__dirname, "build")));

const { matchesField, matchesFieldAll } = require(path.join(
  __dirname,
  "utils",
  "matchesField.js"
));
const { parseAndLoadExcel } = require(path.join(
  __dirname,
  "utils",
  "parseAndLoadExcel.js"
));

if (process.argv[2] === "loadData")
  parseAndLoadExcel(
    path.join(
      __dirname,
      "course-allocation",
      "WINSEM2019-20_ALL_ALLOCATIONREPORT_22-10-2019.xlsx"
    )
  );
const getCourseID = (course) => {
  return `${course["COURSE CODE"]}-${course["COURSE TYPE"]}`;
};

app.get("/faculties", (req, res) => {
  const classes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data", "classes.json"), "utf-8")
  );
  const faculties = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data", "faculties.json"), "utf-8")
  );
  const { query, pageNumber, courseID } = req.query;
  console.log("searching for", courseID, query, pageNumber);
  const [courseCode, courseType] = courseID.split("-");

  let requiredClasses = matchesFieldAll(courseCode, "COURSE CODE", classes);
  requiredClasses = matchesFieldAll(courseType, "COURSE TYPE", requiredClasses);
  const facultyIds = new Set();
  const requiredFaculties = [];

  requiredClasses.forEach((requiredClass) => {
    facultyIds.add(requiredClass["ERP ID"]);
  });
  facultyIds.forEach((facultyId) => {
    requiredFaculties.push(matchesField(facultyId, "ERP ID", faculties));
  });

  const size = 10;
  const startIndex = Number(Number(pageNumber - 1) * size);
  const endIndex = startIndex + Number(size);

  const fuse = new Fuse(requiredFaculties, {
    keys: ["ERP ID", "EMPLOYEE NAME", "EMPLOYEE SCHOOL"],
    threshold: 0.2,
  });
  let results;
  if (query !== "" && query !== undefined) {
    console.log(`searching for ${query}`);
    results = fuse.search(query);
    let newResults = [];
    results.forEach((result) => {
      newResults.push(result.item);
    });
    results = newResults;
  } else {
    results = requiredFaculties;
  }
  console.log(`found ${results.length} results`);

  const finalResults = results.slice(startIndex, endIndex);
  console.log(`sending faculties from ${startIndex} to ${endIndex}`);
  if (endIndex < results.length - 1) {
    res.json({ faculties: finalResults, hasMore: true });
  } else {
    res.json({ faculties: finalResults, hasMore: false });
  }
});

app.get("/courses", (req, res) => {
  const courses = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data", "courses.json"), "utf-8")
  );
  const { query, pageNumber, courseCode, courseID } = req.query;
  if (
    courseID === undefined &&
    courseCode === undefined &&
    query !== undefined &&
    pageNumber !== undefined
  ) {
    const fuse = new Fuse(courses, {
      keys: ["COURSE OWNER", "COURSE CODE", "COURSE TYPE", "COURSE TITLE"],
      threshold: 0.2,
    });

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
  } else if (courseID !== undefined) {
    const [courseCode, courseType] = courseID.split("-");
    const similarCourses = matchesFieldAll(courseCode, "COURSE CODE", courses);
    const course = matchesField(courseType, "COURSE TYPE", similarCourses);
    console.log(`looking for COURSE ID = ${courseID}`);
    if (course === null) {
      console.log(`no course ${courseID} found`);
      res.status(404).json({ message: "No such course found" });
    } else {
      console.log(`course ${courseID} found`);
      res.status(200).json(course);
    }
  } else if (courseCode !== undefined) {
    const course = matchesField(courseCode, "COURSE CODE", courses);
    console.log(`looking for COURSE CODE = ${courseCode}`);
    if (course === null) {
      console.log(`no course ${courseCode} found`);
      res.status(404).json({ message: "No such course found" });
    } else {
      console.log(`course ${courseCode} found`);
      res.status(200).json(course);
    }
  }
});

app.post("/classes", (req, res) => {
  const classes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data", "classes.json"), "utf-8")
  );
  console.log(req.body);
  const data = req.body;
  const requiredClasses = {};
  classes.forEach((classToCheck) => {
    const currentCourseID = getCourseID(classToCheck);
    if (
      data[currentCourseID] !== undefined &&
      data[currentCourseID].includes(classToCheck["ERP ID"])
    ) {
      if (requiredClasses[currentCourseID] === undefined)
        requiredClasses[currentCourseID] = [];
      requiredClasses[currentCourseID].push(classToCheck);
    }
  });
  res.json(requiredClasses);
});

// app.get("/slots", (req, res) => {
//   const slotsFileData = JSON.parse(
//     fs.readFileSync(
//       path.join(__dirname, "data", "timetableTemplate.json"),
//       "utf-8"
//     )
//   );
//   res.json(slotsFileData);
// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
