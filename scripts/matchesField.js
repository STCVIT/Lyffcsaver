/**
 * Finds and returns data from a collection that has the required fieldName
 * match with matchData
 * @param {string} matchData String to be matched
 * @param {string} fieldName Name of field to be matched
 * @param {object} collection Collection of objects in which we look for the match
 * @returns {object} Matched object (null if no object is found)
 */
const matchesField = (matchData, fieldName, collection) => {
  for (const data of collection) {
    if (data[fieldName] === undefined) continue;
    if (data[fieldName] === matchData) return data;
  }
  return null;
};

const matchesFieldAll = (matchData, fieldName, collection) => {
  const results = [];
  for (const data of collection) {
    if (data[fieldName] === undefined) continue;
    if (data[fieldName] === matchData) results.push(data);
  }
  return results;
};
module.exports = { matchesField, matchesFieldAll };
