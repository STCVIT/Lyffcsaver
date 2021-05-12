import axios from "axios";

const mapping = {};

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
  console.log(requestObject);
  try {
    const res = await axios.post("/classes", requestObject);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

const getSlotMapping = async () => {
  const data = (await axios.get("/slots")).data;
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
const isValidResult = (result, courseIDs) => {
  courseIDs.forEach((courseID) => {
    if (result[courseID] === undefined || result[courseID].length === 0)
      return false;
  });
  const classes = Object.values(result);
  const slots = [];
  classes
    .map((currentClass) => currentClass["SLOT"].split("+"))
    .forEach((classSlots) => {
      slots.push(...classSlots);
    });

  const slotsSet = new Set(slots);
  if (slots.length > slotsSet.size) return false;

  for (const slot of slots) {
    const equivalentSlots = mapping[slot];
    if (equivalentSlots === undefined) continue;
    for (const equivalentSlot of equivalentSlots) {
      if (slots.includes(equivalentSlot)) return false;
    }
  }
  return true;
};

const selectClasses = (courseIDs, classes, selection = {}) => {
  if (courseIDs.length === 0) return [selection];
  const courseID = courseIDs[0];
  if (selection[courseID] !== undefined) return [];
  const allResults = [];
  for (const currentClass of classes[courseID]) {
    selection[courseID] = currentClass;
    const results = selectClasses(
      courseIDs.slice(1),
      classes,
      Object.assign({}, selection)
    );
    results.forEach((result) => {
      if (isValidResult(result, courseIDs)) allResults.push(result);
    });
  }
  return allResults;
};

const generateTimetables = async (courses, faculties) => {
  await getSlotMapping();
  console.log(courses, faculties);
  if (!verifyPreferencesSet(courses, faculties)) return;

  const courseIDs = Object.keys(faculties);

  const classes = await getClasses(faculties);
  console.log(classes);

  courseIDs.sort((courseIDa, courseIDb) => {
    return classes[courseIDa].length - classes[courseIDb].length;
  });
  console.log(courseIDs);

  const possibleClassSelections = selectClasses(courseIDs, classes);
  console.log("all possible class selections", possibleClassSelections);
};

export { generateTimetables, getCourseID };
