import axios from "axios";
import timetableTemplateData from "./timetableTemplateData";

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
        `Please either reduce reserved slots or add more faculties from this course`
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
        `To reduce possibilities, reduce the number of faculties selected or reserve more slots\n` +
        `Proceed?`
    );
  }
  return true;
};

const removeReservedSlots = (classes, reservedSlots) => {
  Object.keys(classes).forEach((courseID) => {
    classes[courseID] = classes[courseID].filter((classToBeChecked) => {
      return (
        classToBeChecked["SLOT"].split("+").find((slot) => {
          if (reservedSlots.includes(slot)) return reservedSlots.includes(slot);
        }) === undefined
      );
    });
  });
};

const populateSlotCombination = async (
  faculties,
  reservedSlots,
  slotsString,
  objectToPopulate
) => {
  if (window.Worker) {
    const worker = new Worker("workers/worker.js");

    getSlotMapping();

    const courseIDs = Object.keys(faculties);
    const classes = await getClasses(faculties);
    removeReservedSlots(classes, reservedSlots);
    // if (!verifyNumberOfClasses(classes)) return {};

    // sorting courseIDs in ascending order of the number of classes
    // with that courseID.
    // This is done so that backtracking algorithm will terminate quicker
    // in case some mistake is found.
    courseIDs.sort((courseIDa, courseIDb) => {
      return classes[courseIDa].length - classes[courseIDb].length;
    });

    const requestWorker = (
      courseIDs,
      classes,
      slotCombinationString,
      possibleSlotCombinations
    ) =>
      new Promise((res, rej) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = ({ data }) => {
          // console.log(JSON.stringify(data));
          console.log(data);
          channel.port1.close();
          if (data.error) {
            rej(data.error);
          } else {
            res(data.result);
          }
        };

        worker.postMessage(
          [
            "populateSlotCombination",
            mapping,
            courseIDs,
            classes,
            slotCombinationString,
            possibleSlotCombinations,
          ],
          [channel.port2]
        );
      });

    console.time("populateSlotCombination");
    const populatedSlotCombination = await requestWorker(
      courseIDs,
      classes,
      slotsString,
      objectToPopulate
    );
    console.timeEnd("populateSlotCombination");
    return populatedSlotCombination;
  }
  return {};
};
const getSlotCombinations = async (courses, faculties, reservedSlots) => {
  if (window.Worker) {
    const worker = new Worker("workers/worker.js");

    getSlotMapping();

    const courseIDs = Object.keys(faculties);
    const classes = await getClasses(faculties);

    if (!verifyPreferencesSet(courses, faculties)) return {};

    removeReservedSlots(classes, reservedSlots);
    if (!verifyNumberOfClasses(classes)) return {};

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

    const requestWorker = (mapping, courseIDs, classes) =>
      new Promise((res, rej) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = ({ data }) => {
          console.log(data);
          channel.port1.close();
          if (data.error) {
            rej(data.error);
          } else {
            res(data.result);
          }
        };

        worker.postMessage(
          ["getSlotCombinations", mapping, courseIDs, classes],
          [channel.port2]
        );
      });

    console.time("getSlotCombinations");
    const possibleSlotCombinations = await requestWorker(
      mapping,
      courseIDs,
      classes
    );
    const possibleSlotCombinationsObject = {};
    possibleSlotCombinations.forEach(
      (slotCombination) =>
        (possibleSlotCombinationsObject[slotCombination.join("+")] = [])
    );
    console.timeEnd("getSlotCombinations");
    return possibleSlotCombinationsObject;
  }
  return {};
};

/**
 *
 * @param {Object} courses Object of type {courseID: [Array of classes with this courseID]}
 * @param {Object} faculties Object of type {courseID: [Faculties teaching this course sorted by preference]}
 * @param {Array} reservedSlots Contains slots to be excluded while making timetables
 * @returns {Object} Object in the format {slots: [All schedules occupying those slots]}
 */
const getTimetables = async (courses, faculties, reservedSlots) => {
  if (window.Worker) {
    const worker = new Worker("workers/worker.js");

    getSlotMapping();

    const courseIDs = Object.keys(faculties);
    const classes = await getClasses(faculties);

    if (!verifyPreferencesSet(courses, faculties)) return [];

    removeReservedSlots(classes, reservedSlots);
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
    // using code from https://advancedweb.hu/how-to-use-async-await-with-postmessage/
    // to use async await with worker.
    const selectClasses = (mapping, courseIDs, classes) =>
      new Promise((res, rej) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = ({ data }) => {
          console.log(data);
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
    const getSlotCombinations = (mapping, courseIDs, classes) =>
      new Promise((res, rej) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = ({ data }) => {
          console.log(data);
          channel.port1.close();
          if (data.error) {
            rej(data.error);
          } else {
            res(data.result);
          }
        };

        worker.postMessage(
          ["getSlotCombinations", mapping, courseIDs, classes],
          [channel.port2]
        );
      });
    const populateSlotCombination = (
      courseIDs,
      classes,
      slotCombinationString,
      possibleSlotCombinations
    ) =>
      new Promise((res, rej) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = ({ data }) => {
          console.log(data);
          channel.port1.close();
          if (data.error) {
            rej(data.error);
          } else {
            res(data.result);
          }
        };

        worker.postMessage(
          [
            "populateSlotCombination",
            courseIDs,
            classes,
            slotCombinationString,
            possibleSlotCombinations,
          ],
          [channel.port2]
        );
      });
    console.time("getSlotCombinations");
    const possibleSlotCombinations = await getSlotCombinations(
      mapping,
      courseIDs,
      classes
    );
    console.timeEnd("getSlotCombinations");
    console.time("selectClasses");
    const possibleClassSelections = await selectClasses(
      mapping,
      courseIDs,
      classes
    );
    console.timeEnd("selectClasses");

    console.log("Possible slot combinations", possibleSlotCombinations);
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

    const actualSlotCombinations = Object.keys(possibleClassSelections);
    const possibleSlotCombinationStrings = possibleSlotCombinations.map(
      (slotCombination) => slotCombination.join("+")
    );

    const possibleSlotCombinationsObject = {};
    possibleSlotCombinationStrings.forEach(
      (slotCombination) =>
        (possibleSlotCombinationsObject[slotCombination] = [])
    );

    const missedSlotCombinations = [];
    const impossibleSlotCombinations = [];

    actualSlotCombinations.forEach((slotCombination) => {
      if (!possibleSlotCombinationStrings.includes(slotCombination))
        missedSlotCombinations.push(slotCombination);
    });
    possibleSlotCombinationStrings.forEach((slotCombination) => {
      if (!actualSlotCombinations.includes(slotCombination))
        impossibleSlotCombinations.push(slotCombination);
    });
    console.log(
      "Possible Slot combinations",
      possibleSlotCombinationsObject,
      "Missed Slot Combinations",
      missedSlotCombinations,
      "Impossible Slot Combinations",
      impossibleSlotCombinations
    );

    console.time("populatedSlotCombination");
    const populatedSlotCombinationsObject = await populateSlotCombination(
      courseIDs,
      classes,
      possibleSlotCombinationStrings[0],
      possibleSlotCombinationsObject
    );
    console.log(
      "Actual Schedules",
      possibleClassSelections[possibleSlotCombinationStrings[0]],
      "Possible Schedules",
      populatedSlotCombinationsObject[possibleSlotCombinationStrings[0]]
    );
    console.timeEnd("populatedSlotCombination");

    return possibleClassSelections;
  }
  return [];
};

export {
  getTimetables,
  getCourseID,
  getSlotCombinations,
  populateSlotCombination,
};
