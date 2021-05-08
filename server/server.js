// includes code from
// https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5
const express = require("express");
const app = express();
const port = 3001;
const path = require("path");
const fs = require("fs");
const Fuse = require("fuse.js");

const { matchesField } = require("./utils/matchesField");
const { parseAndLoadExcel } = require("./utils/parseAndLoadExcel");

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
  const { query, pageNumber, courseCode } = req.query;
  if (
    courseCode === undefined &&
    query !== undefined &&
    pageNumber !== undefined
  ) {
    const fuse = new Fuse(courses, {
      keys: ["COURSE OWNER", "COURSE CODE", "COURSE TITLE"],
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
