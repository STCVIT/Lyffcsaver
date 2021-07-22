const timetableTemplateData = require("../.tests.data/timetableTemplateData");
const {
  allElementsWithinArray,
  getCourseID,
  getSlotCombinations,
  getSlots,
  isPossible,
  selectClasses,
  slotConflict,
  slotsAlreadyConsidered,
  populateSlotCombination,
} = require("../public/workers/worker");

// allElementsWithinArray
test("helper function for checking if all elements in one array are also in the other", () => {
  expect(allElementsWithinArray([1, 2, 3], [2, 3])).toBe(false);
  expect(allElementsWithinArray([1, 2, 3], [1, 2, 3, 4])).toBe(true);
  expect(allElementsWithinArray([], [1, 2, 3, 4])).toBe(true);
});

// getCourseID
test("gets proper course id", () => {
  expect(getCourseID(classDatas[0])).toBe("MGT1022-ETH");
  expect(getCourseID(classDatas[1])).toBe("MAT2001-ELA");
});

// getSlots
test("testing if getting valid slots from a selection", () => {
  expect(getSlots(validSelections[0])).toStrictEqual(validSlots[0]);
});

// isPossible
test("check validity of test for valid selection", () => {
  const mapping = {};
  getSlotMapping(mapping);
  expect(isPossible(validSelections[0], "CSE2012-ETH", mapping)).toBe(true);
  expect(isPossible(validSelections[0], "STS2201-SS", mapping)).toBe(true);
  expect(isPossible(validSelections[0], "abc", mapping)).toBe(false);
});

// slotMapping
test("check validity of test of slot conflicts", () => {
  const mapping = {};
  getSlotMapping(mapping);
  expect(slotConflict(validSlots[0], ["L59"], mapping)).toBe(false);
  expect(slotConflict(validSlots[0], ["A1"], mapping)).toBe(true);
  expect(slotConflict(validSlots[0], ["B1"], mapping)).toBe(true);
  expect(slotConflict(validSlots[0], [], mapping)).toBe(false);
  expect(slotConflict([], validSlots[0], mapping)).toBe(false);
  expect(slotConflict([], [], mapping)).toBe(false);
});

// slotsAlreadyConsidered
test("check validity of test of whether slot sequence exists in array of slot sequences", () => {
  expect(slotsAlreadyConsidered(["A1", "TA1"], [["A1", "TA1"]])).toBe(true);
  expect(
    slotsAlreadyConsidered(
      ["A1", "TA1"],
      [["A1"], ["A1", "TA1"], ["A1", "TA1", "L1"]]
    )
  ).toBe(true);
  expect(slotsAlreadyConsidered(["A1", "TA1"], [["A2", "TA2"]])).toBe(false);
  expect(
    slotsAlreadyConsidered(
      ["A1", "TA1"],
      [["A1"], ["A2", "TA1"], ["A1", "TA1", "L1"]]
    )
  ).toBe(false);
});

/*#########################################################################################*/
const classDatas = [
  {
    "ERP ID": 10080,
    "COURSE CODE": "MGT1022",
    "CLASS ID": "MGT1022-ETH-0",
    SLOT: "TE1",
    "COURSE TYPE": "ETH",
    "ROOM NUMBER": "SJT424",
    BATCH: "-",
  },
  {
    "ERP ID": 14469,
    "COURSE CODE": "MAT2001",
    "CLASS ID": "MAT2001-ELA-378",
    SLOT: "L21+L22",
    "COURSE TYPE": "ELA",
    "ROOM NUMBER": "SJT620A",
    BATCH: "-",
  },
];

const validSelections = [
  {
    "CSE1011-ELA": {
      BATCH: "-",
      "CLASS ID": "CSE1011-ELA-1247",
      "COURSE CODE": "CSE1011",
      "COURSE TITLE": "Cryptography Fundamentals",
      "COURSE TYPE": "ELA",
      "EMPLOYEE NAME": "MADHU VISWANATHAM V",
      "ERP ID": 10704,
      "ROOM NUMBER": "SJT418",
      SLOT: "L41+L42",
    },
    "CSE1011-ETH": {
      BATCH: "-",
      "CLASS ID": "CSE1011-ETH-1243",
      "COURSE CODE": "CSE1011",
      "COURSE TITLE": "Cryptography Fundamentals",
      "COURSE TYPE": "ETH",
      "EMPLOYEE NAME": "MADHU VISWANATHAM V",
      "ERP ID": 10704,
      "ROOM NUMBER": "SJT513",
      SLOT: "D1",
    },
    "CSE2001-TH": {
      BATCH: "-",
      "CLASS ID": "CSE2001-TH-1257",
      "COURSE CODE": "CSE2001",
      "COURSE TITLE": "Computer Architecture and Organization",
      "COURSE TYPE": "TH",
      "EMPLOYEE NAME": "ANISHA M. LAL",
      "ERP ID": 10667,
      "ROOM NUMBER": "SJT505",
      SLOT: "A1+TA1",
    },
    "CSE2004-ELA": {
      BATCH: "-",
      "CLASS ID": "CSE2004-ELA-1322",
      "COURSE CODE": "CSE2004",
      "COURSE TITLE": "Database Management Systems",
      "COURSE TYPE": "ELA",
      "EMPLOYEE NAME": "ANBARASI M",
      "ERP ID": 10483,
      "ROOM NUMBER": "PLB117",
      SLOT: "L57+L58",
    },
    "CSE2004-ETH": {
      BATCH: "-",
      "CLASS ID": "CSE2004-ETH-1297",
      "COURSE CODE": "CSE2004",
      "COURSE TITLE": "Database Management Systems",
      "COURSE TYPE": "ETH",
      "EMPLOYEE NAME": "ANBARASI M",
      "ERP ID": 10483,
      "ROOM NUMBER": "SJT522",
      SLOT: "B1+TB1",
    },
    "CSE2012-ELA": {
      BATCH: "-",
      "CLASS ID": "CSE2012-ELA-1519",
      "COURSE CODE": "CSE2012",
      "COURSE TITLE": "Design and Analysis of Algorithms",
      "COURSE TYPE": "ELA",
      "EMPLOYEE NAME": "ANURADHA G",
      "ERP ID": 13703,
      "ROOM NUMBER": "PLB118",
      SLOT: "L49+L50",
    },
    "CSE2012-ETH": {
      BATCH: "-",
      "CLASS ID": "CSE2012-ETH-1495",
      "COURSE CODE": "CSE2012",
      "COURSE TITLE": "Design and Analysis of Algorithms",
      "COURSE TYPE": "ETH",
      "EMPLOYEE NAME": "ANURADHA G",
      "ERP ID": 13703,
      "ROOM NUMBER": "SJT710",
      SLOT: "F1+TF1",
    },
    "STS2201-SS": {
      BATCH: "-",
      "CLASS ID": "STS2201-SS-94",
      "COURSE CODE": "STS2201",
      "COURSE TITLE": "Numerical Ability and Cognitive Intelligence",
      "COURSE TYPE": "SS",
      "EMPLOYEE NAME": "ETHNUS (APT)",
      "ERP ID": "ETHNUS",
      "ROOM NUMBER": "SJT109",
      SLOT: "E1+TE1",
    },
  },
];
const validSlots = [
  [
    "L41",
    "L42",
    "D1",
    "A1",
    "TA1",
    "L57",
    "L58",
    "B1",
    "TB1",
    "L49",
    "L50",
    "F1",
    "TF1",
    "E1",
    "TE1",
  ],
];

const getSlotMapping = (mapping) => {
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
