let mapping;
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
onmessage = (event) => {
  const req = event.data[0];
  try {
    if (req === "selectClasses") {
      mapping = event.data[1];
      const courseIDs = event.data[2];
      const classes = event.data[3];
      const possibleClassSelections = selectClasses(courseIDs, classes);
      event.ports[0].postMessage({ result: possibleClassSelections });
    } else {
      throw "Invalid message";
    }
  } catch (e) {
    event.ports[0].postMessage({ error: e });
  }
};
