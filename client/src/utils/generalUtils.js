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

const getSlots = (result) => {
  const classes = Object.values(result);
  const slots = [];
  classes
    .map((currentClass) => currentClass["SLOT"].split("+"))
    .forEach((classSlots) => {
      slots.push(...classSlots);
    });

  return slots;
};

const isPossible = (selection, courseID) => {
  const allSlots = getSlots(selection);
  const allSlotsSet = new Set(allSlots);
  if (allSlots.length > allSlotsSet.size) return false;

  const slotsToBeChecked = getSlots({ courseID: selection[courseID] });
  for (const slot of slotsToBeChecked) {
    const equivalentSlots = mapping[slot];
    if (equivalentSlots === undefined) continue;
    for (const equivalentSlot of equivalentSlots) {
      if (allSlots.includes(equivalentSlot)) return false;
    }
  }
  return true;
};

const selectClasses = (courseIDs, classes, selection = {}) => {
  if (courseIDs.length === 0) {
    const slots = [...new Set(getSlots(selection))];
    slots.sort();
    const key = slots.join("+");
    return { [key]: [selection] };
  }

  const courseID = courseIDs[0];
  if (selection[courseID] !== undefined) return [];
  const allResults = {};
  for (const currentClass of classes[courseID]) {
    selection[courseID] = currentClass;

    // only checking if the change that was made
    // is possible.
    if (!isPossible(selection, courseID)) continue;
    const results = selectClasses(
      courseIDs.slice(1),
      classes,
      Object.assign({}, selection)
    );
    Object.values(results).forEach((resultArray) =>
      resultArray.forEach((result) => {
        const slots = [...new Set(getSlots(result))];
        slots.sort();
        const key = slots.join("+");
        if (allResults[key] === undefined) allResults[key] = [];
        allResults[key].push(result);
      })
    );
  }
  return allResults;
};

/**
 *
 * @param {Object} courses Object of type {courseID: [Array of classes with this courseID]}
 * @param {Object} faculties Object of type {courseID: [Faculties teaching this course sorted by preference]}
 * @returns {Object} Object in the format {slots: [All schedules occupying those slots]}
 */
const getTimetables = async (courses, faculties) => {
  getSlotMapping();
  console.log(courses, faculties);
  if (!verifyPreferencesSet(courses, faculties)) return;

  const courseIDs = Object.keys(faculties);

  const classes = await getClasses(faculties);
  console.log(classes);

  // sorting courseIDs in ascending order of the number of classes
  // with that courseID.
  // This is done so that backtracking algorithm will terminate quicker
  // in case some mistake is found.
  courseIDs.sort((courseIDa, courseIDb) => {
    return classes[courseIDa].length - classes[courseIDb].length;
  });
  console.log(courseIDs);

  let firstB = true;
  console.log(
    "All Possible Selections:",
    Object.keys(classes).reduce((total, key) => {
      if (firstB) {
        firstB = false;
        return classes[Object.keys(classes)[0]].length * classes[key].length;
      }
      return total * classes[key].length;
    })
  );
  console.time("selectClasses");
  const possibleClassSelections = selectClasses(courseIDs, classes);
  console.timeEnd("selectClasses");
  let firstA = true;
  console.log(
    "all possible class selections",
    possibleClassSelections,
    "Groups:",
    Object.keys(possibleClassSelections).length,
    "Possible Schedules:",
    Object.keys(possibleClassSelections).reduce((total, key) => {
      if (firstA) {
        firstA = false;
        return (
          possibleClassSelections[Object.keys(possibleClassSelections)[0]]
            .length + possibleClassSelections[key].length
        );
      }
      return total + possibleClassSelections[key].length;
    })
  );
  return possibleClassSelections;
};

export { getTimetables, getCourseID };
