import axios from "axios";
import timetableTemplateData from "./timetableTemplateData";

// TODO: Find a better method to approximate time taken in finding valid timetables (verifyNumberOfClasses())

const mapping = {};

/**
 *
 * @param {object} course Preferably object containing course info, but any object with "COURSE CODE" and "COURSE TYPE" fields should work.
 * @returns {string} Unique identifier for object passed in by joining courseCode and courseType with a hyphen, eg:- CHY1701-ETH
 */
const getCourseID = (course) => {
  return `${course["COURSE CODE"]}-${course["COURSE TYPE"]}`;
};

const verifyPreferencesSet = (courses, faculties) => {
  if (courses.length === 0) {
    alert(`Please select at least one course.`);
    return false;
  }
  const unsetCourses = [];
  courses.forEach((course) => {
    if (faculties[getCourseID(course)] === undefined)
      unsetCourses.push(getCourseID(course));
  });
  if (unsetCourses.length > 0) {
    alert(
      `Please select at least one faculty for each course.
        Courses with no faculties set yet: ${unsetCourses.join(", ")}`
    );
    return false;
  }
  return true;
};

const getClasses = async (faculties) => {
  const requestObject = {};
  Object.keys(faculties).forEach((courseID) => {
    faculties[courseID].forEach((faculty) => {
      if (requestObject[courseID] === undefined) requestObject[courseID] = [];
      requestObject[courseID].push(faculty["ERP ID"]);
    });
  });
  try {
    const res = await axios.post("/classes", requestObject);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

const getSlotMapping = () => {
  Object.keys(mapping).forEach((key) => delete mapping[key]);
  const data = timetableTemplateData;
  for (let rowNo = 4; rowNo + 1 < data.length; rowNo += 2) {
    for (let colNo = 2; colNo < data[rowNo].length; colNo++) {
      const pattern = /[A-Z]+\d+/;
      const slotA = data[rowNo][colNo];
      const slotB = data[rowNo + 1][colNo];
      if (pattern.test(slotA) && pattern.test(slotB)) {
        if (mapping[slotA] === undefined) mapping[slotA] = [];
        if (mapping[slotB] === undefined) mapping[slotB] = [];
        mapping[slotA].push(slotB);
        mapping[slotB].push(slotA);
      }
    }
  }
};

const getNumberOfTotalPossibleSelections = (classes) => {
  let first = true;
  if (classes !== undefined) {
    const keysArray = Object.keys(classes);
    console.log(keysArray);
    if (keysArray.length > 0)
      return keysArray.reduce((total, key) => {
        if (first) {
          first = false;
          return classes[Object.keys(classes)[0]].length * classes[key].length;
        }
        return total * classes[key].length;
      });
    else return 0;
  }
};

const verifyNumberOfClasses = (classes) => {
  let courseIDWithTooFewClasses;

  if (
    Object.keys(classes).find((courseID) => {
      courseIDWithTooFewClasses = courseID;
      return classes[courseID].length === 0;
    })
  ) {
    alert(
      `No valid classes found for ${courseIDWithTooFewClasses}\n` +
        `Please either reduce blacklisted slots or add more faculties from this course`
    );
    return false;
  }

  const numberOfPossibilities = getNumberOfTotalPossibleSelections(classes);
  if (numberOfPossibilities > 20000000) {
    const minutes = numberOfPossibilities / 50000000;
    return confirm(
      `Number of Possibilities: ${numberOfPossibilities.toLocaleString()}\n` +
        `Time required: (approx) ${minutes.toLocaleString()} minutes (Actual time required might be much less)\n` +
        `If you get a message saying "Page Unresponsive" after choosing to proceed, please choose to wait.\n` +
        `To reduce possibilities, reduce the number of faculties selected or blacklist more slots\n` +
        `Proceed?`
    );
  }
  return true;
};

const removeBlacklistedSlots = (classes, blacklistedSlots) => {
  Object.keys(classes).forEach((courseID) => {
    classes[courseID] = classes[courseID].filter((classToBeChecked) => {
      return (
        classToBeChecked["SLOT"].split("+").find((slot) => {
          if (blacklistedSlots.includes(slot))
            return blacklistedSlots.includes(slot);
        }) === undefined
      );
    });
  });
};

/**
 *
 * @param {Object} courses Object of type {courseID: [Array of classes with this courseID]}
 * @param {Object} faculties Object of type {courseID: [Faculties teaching this course sorted by preference]}
 * @param {Array} blacklistedSlots Contains slots to be excluded while making timetables
 * @returns {Object} Object in the format {slots: [All schedules occupying those slots]}
 */
const getTimetables = async (courses, faculties, blacklistedSlots) => {
  // console.log(courses, faculties);
  if (window.Worker) {
    const worker = new Worker("workers/worker.js");

    getSlotMapping();

    const courseIDs = Object.keys(faculties);
    const classes = await getClasses(faculties);

    if (!verifyPreferencesSet(courses, faculties)) return [];

    removeBlacklistedSlots(classes, blacklistedSlots);
    if (!verifyNumberOfClasses(classes)) return [];

    // sorting courseIDs in ascending order of the number of classes
    // with that courseID.
    // This is done so that backtracking algorithm will terminate quicker
    // in case some mistake is found.
    courseIDs.sort((courseIDa, courseIDb) => {
      return classes[courseIDa].length - classes[courseIDb].length;
    });

    console.log(
      "All Possible Selections:",
      getNumberOfTotalPossibleSelections(classes)
    );
    console.time("selectClasses");
    // using code from https://advancedweb.hu/how-to-use-async-await-with-postmessage/
    // to use async await with worker.
    const selectClasses = (mapping, courseIDs, classes) =>
      new Promise((res, rej) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = ({ data }) => {
          channel.port1.close();
          if (data.error) {
            rej(data.error);
          } else {
            res(data.result);
          }
        };

        worker.postMessage(
          ["selectClasses", mapping, courseIDs, classes],
          [channel.port2]
        );
      });
    console.log(selectClasses(mapping, courseIDs, classes));
    const possibleClassSelections = await selectClasses(
      mapping,
      courseIDs,
      classes
    );
    console.timeEnd("selectClasses");

    let first = true;
    if (Object.keys(possibleClassSelections).length > 0)
      console.log(
        "all possible class selections",
        possibleClassSelections,
        "Groups:",
        Object.keys(possibleClassSelections).length,
        "Possible Schedules:",
        Object.keys(possibleClassSelections).reduce((total, key) => {
          if (first) {
            first = false;
            return (
              possibleClassSelections[Object.keys(possibleClassSelections)[0]]
                .length + possibleClassSelections[key].length
            );
          }
          return total + possibleClassSelections[key].length;
        })
      );
    else alert("No valid schedules found.");
    return possibleClassSelections;
  }
  return [];
};

export { getTimetables, getCourseID };
