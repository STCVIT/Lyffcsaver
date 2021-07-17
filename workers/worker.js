let mapping;
const getCourseID = (course) => {
  return `${course["COURSE CODE"]}-${course["COURSE TYPE"]}`;
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
    for (const resultArray of Object.values(results)) {
      for (const result of resultArray) {
        const slots = [...new Set(getSlots(result))];
        slots.sort();
        const key = slots.join("+");
        if (allResults[key] === undefined) allResults[key] = [];
        allResults[key].push(result);
      }
    }
  }
  return allResults;
};

/**
 *
 * @param {[String]} slotsToBeChecked Array containing slots
 * @param {[[String]]} slotsArraysToBeCheckedWith Array containing array containing slots
 * @returns True if slotsToBeChecked is already in slotsArraysToBeCheckedWith
 */
const slotsAlreadyConsidered = (
  slotsToBeChecked,
  slotsArraysToBeCheckedWith
) => {
  let equalArrayExists = false;
  const filteredSlotsArrays = slotsArraysToBeCheckedWith.filter(
    (slots) => slots.length === slotsToBeChecked.length
  );
  for (const slotsArray of filteredSlotsArrays) {
    let equalArrays = true;
    for (const slot of slotsArray) {
      if (
        slotsToBeChecked.find((slotToBeChecked) => slotToBeChecked === slot) ===
        undefined
      ) {
        equalArrays = false;
        break;
      }
    }
    if (equalArrays) {
      equalArrayExists = true;
      break;
    }
  }
  return equalArrayExists;
};
const slotConflict = (slotsA, slotsB) => {
  for (const slotA of slotsA) {
    const equivalentSlotsA = mapping[slotA];
    if (equivalentSlotsA === undefined) continue;
    for (const slotB of slotsB) {
      if (slotA === slotB) return true;
      const equivalentSlotsB = mapping[slotB];
      if (equivalentSlotsB === undefined) continue;
      for (const equivalentSlotA of equivalentSlotsA) {
        for (const equivalentSlotB of equivalentSlotsB) {
          if (
            equivalentSlotA === equivalentSlotB ||
            slotA === equivalentSlotB ||
            slotB === equivalentSlotA
          )
            return true;
        }
      }
    }
  }
  return false;
};
const getSlotCombinations = (courseIDs, classes, combinations = []) => {
  if (courseIDs.length === 0) {
    return combinations;
  }
  const courseID = courseIDs[0];
  const newCombinations = [];
  if (combinations.length === 0) {
    for (const currentClass of classes[courseID]) {
      if (
        getCourseID(currentClass) === courseID &&
        !slotsAlreadyConsidered(currentClass["SLOT"].split("+"), combinations)
      )
        newCombinations.push(currentClass["SLOT"].split("+").sort());
    }
  } else {
    for (const baseSlots of combinations) {
      for (const currentClass of classes[courseID]) {
        if (getCourseID(currentClass) !== courseID) continue;
        const slotsToBeAdded = currentClass["SLOT"].split("+");

        if (slotConflict(slotsToBeAdded, baseSlots)) continue;
        const newCombination = [...slotsToBeAdded, ...baseSlots];

        if (slotsAlreadyConsidered(newCombination, newCombinations)) continue;
        newCombination.sort();
        newCombinations.push(newCombination);
      }
    }
  }
  return getSlotCombinations(courseIDs.slice(1), classes, newCombinations);
};

/**
 *
 * @param {Array} arrayToBeTested Array that will have each element tested
 * @param {Array} testingArray Array against which tests are to be done
 * @returns {bool} True if all elements in arrayToBeTested are found in testing array
 */
const allElementsWithinArray = (arrayToBeTested, testingArray) => {
  return (
    arrayToBeTested.find((element) => testingArray.includes(element)) !==
    undefined
  );
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
const populateSlotCombination = (
  courseIDs,
  classes,
  slotCombinationString,
  possibleSlotCombinations = {}
) => {
  // if (possibleSlotCombinations[slotCombinationString] === undefined)
  //   return possibleSlotCombinations;
  const allowedSlots = slotCombinationString.split("+");
  const classesCopy = JSON.parse(JSON.stringify(classes));

  // filtering out all classes that don't match the required slots
  for (const courseID of courseIDs) {
    classesCopy[courseID] = classesCopy[courseID].filter((classToBeChecked) =>
      allElementsWithinArray(classToBeChecked["SLOT"].split("+"), allowedSlots)
    );
  }
  // Object in the format { courseID: {slot: [...classes]} }
  const similarClasses = {};

  // Adding and grouping similar classes together in similarClasses
  for (const courseID of courseIDs) {
    similarClasses[courseID] = {};
    for (const classToBeAdded of classesCopy[courseID]) {
      const slot = classToBeAdded["SLOT"];
      if (similarClasses[courseID][slot] === undefined)
        similarClasses[courseID][slot] = [];
      similarClasses[courseID][slot].push(classToBeAdded);
    }
  }

  // Object in format { courseID: [class] }
  const uniqueClasses = {};
  // Taking unique class from similarClasses and adding to unique classes
  for (const courseID of courseIDs) {
    uniqueClasses[courseID] = [];
    for (const slot of Object.keys(similarClasses[courseID])) {
      uniqueClasses[courseID].push(similarClasses[courseID][slot].pop());
    }
  }

  // Object in format { slotCombination: [schedules] } where schedule is in format {courseIDs: class}
  const possibleClassSelections = selectClasses(courseIDs, uniqueClasses);
  const newSchedules = [];
  const scheduleIDs = new Set();
  const getScheduleID = (schedule) => {
    let scheduleID = "";
    for (const courseID of courseIDs) {
      scheduleID +=
        schedule[courseID]["CLASS ID"] +
        schedule[courseID]["ASSOCIATED CLASS ID"] +
        "-";
    }
    return scheduleID;
  };
  const addSchedules = (...schedules) => {
    for (const schedule of schedules) {
      const scheduleID = getScheduleID(schedule);
      const previousSize = scheduleIDs.size;
      scheduleIDs.add(scheduleID);
      if (scheduleIDs.size > previousSize) newSchedules.push(schedule);
    }
  };
  if (
    possibleClassSelections[slotCombinationString] !== undefined &&
    possibleClassSelections[slotCombinationString] !== null
  )
    for (const schedule of possibleClassSelections[slotCombinationString]) {
      addSchedules(schedule);

      const findEquivalentSchedules = (courseIDs, schedule, similarClasses) => {
        const scheduleCopy = JSON.parse(JSON.stringify(schedule));
        if (courseIDs.length === 0) return [scheduleCopy];

        const courseID = courseIDs[0];
        const slot = scheduleCopy[courseID]["SLOT"];
        const allSimilarSchedules = [];

        const filteredClasses = classes[courseID].filter(
          (testingClass) => testingClass["SLOT"] === slot
        );

        for (const similarClass of filteredClasses) {
          scheduleCopy[courseID] = similarClass;
          allSimilarSchedules.push(scheduleCopy);
          const similarSchedules = findEquivalentSchedules(
            courseIDs.slice(1),
            scheduleCopy,
            similarClasses
          );
          allSimilarSchedules.push(...similarSchedules);
        }
        return allSimilarSchedules;
      };
      addSchedules(
        ...findEquivalentSchedules(courseIDs, schedule, similarClasses)
      );
    }
  possibleSlotCombinations[slotCombinationString] = newSchedules;
  return possibleSlotCombinations;
};

onmessage = (event) => {
  const req = event.data[0];
  try {
    if (req === "selectClasses") {
      mapping = event.data[1];
      const courseIDs = event.data[2];
      const classes = event.data[3];
      const possibleClassSelections = selectClasses(courseIDs, classes);
      event.ports[0].postMessage({ result: possibleClassSelections });
    } else if (req === "getSlotCombinations") {
      mapping = event.data[1];
      const courseIDs = event.data[2];
      const classes = event.data[3];
      const possibleSlotCombinations = getSlotCombinations(courseIDs, classes);
      event.ports[0].postMessage({ result: possibleSlotCombinations });
    } else if (req === "populateSlotCombination") {
      mapping = event.data[1];
      const courseIDs = event.data[2];
      const classes = event.data[3];
      const slotCombinationString = event.data[4];
      const possibleSlotCombinations = event.data[5];
      // console.log(
      //   "in worker",
      //   courseIDs,
      //   classes,
      //   slotCombinationString,
      //   possibleSlotCombinations
      // );

      const possibleClassSelections = populateSlotCombination(
        courseIDs,
        classes,
        slotCombinationString,
        possibleSlotCombinations
      );
      event.ports[0].postMessage({ result: possibleClassSelections });
    } else {
      throw "Invalid message";
    }
  } catch (e) {
    event.ports[0].postMessage({ error: e });
  }
};
