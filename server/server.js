// includes code from
// https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5

// // TODO: Clean data. Remove data with important fields as NIL.
// TODO: CLOUD FUNCTIONS for fetching only required data wherever a query can be passed
// TODO: better error handling

const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const path = require("path");
const fs = require("fs");
const Fuse = require("fuse.js");
const { db } = require("./firebase/firebaseConfig");
const FACULTIES = "FACULTIES";
const COURSES = "COURSES";
const CLASSES = "CLASSES";

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded));
app.use(express.static(path.join(__dirname, "build")));

const { matchesField, matchesFieldAll } = require(path.join(
  __dirname,
  "utils",
  "matchesField.js"
));
const { parseAndLoadExcel, getCourseID } = require(path.join(
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

const getWithFieldValueIn = async (
  collectionNameOrSnapshot,
  fieldName,
  possibilities,
  query,
  size
) => {
  let startIndex = 0;
  let result = [];
  while (startIndex < possibilities.length) {
    // if no query and size of results is greater than required size then break out of loop
    if ((query === undefined || query === "") && result.length > size + 2)
      break;
    const endIndex = startIndex + 10;
    let snapshot;
    if (typeof collectionNameOrSnapshot === "string") {
      snapshot = db
        .collection(collectionNameOrSnapshot)
        .where(fieldName, "in", possibilities.slice(startIndex, endIndex));
      if ((query === undefined || query === "") && size !== undefined)
        snapshot = snapshot.limit(size - result.length + 3);
      snapshot = await snapshot.get();
    } else {
      snapshot = collectionNameOrSnapshot.where(
        fieldName,
        "in",
        possibilities.slice(startIndex, endIndex)
      );
      if ((query === undefined || query === "") && size !== undefined)
        snapshot = snapshot.limit(size - result.length + 3);
      snapshot = await snapshot.get();
    }
    result.push(...snapshot.docs.map((doc) => doc.data()));
    startIndex = endIndex;
  }
  return result;
};

app.get("/faculties", async (req, res) => {
  const { query, pageNumber, courseID } = req.query;
  console.log("searching for", courseID, query, pageNumber);
  const [courseCode, courseType] = courseID.split("-");

  let requiredClassesSnapshot = await db
    .collection(CLASSES)
    .where("COURSE CODE", "==", courseCode)
    .where("COURSE TYPE", "==", courseType)
    .get();
  let requiredClasses = requiredClassesSnapshot.docs;
  let facultyIds = new Set();

  requiredClasses.forEach((requiredClass) => {
    facultyIds.add(requiredClass.data()["ERP ID"]);
  });
  facultyIds = [...facultyIds];
  const size = 10;
  const requiredFaculties = await getWithFieldValueIn(
    FACULTIES,
    "ERP ID",
    facultyIds,
    query,
    size * pageNumber
  );

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

app.post("/classes", async (req, res) => {
  console.log(req.body);
  const data = req.body;
  const requiredClasses = {};
  for (const courseID of Object.keys(data)) {
    const [courseCode, courseType] = courseID.split("-");
    const partialQuery = await db
      .collection(CLASSES)
      .where("COURSE CODE", "==", courseCode)
      .where("COURSE TYPE", "==", courseType);
    requiredClasses[courseID] = [
      ...(await getWithFieldValueIn(partialQuery, "ERP ID", data[courseID])),
    ];
  }
  res.json(requiredClasses);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
