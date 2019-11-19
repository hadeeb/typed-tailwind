/**
 * @type {Set<string>}
 */
const classList = new Set();

module.exports = function() {
  const classListArray = Array.from(classList);
  classList.clear();
  return classListArray;
};

/**
 * @param {string} className
 */
module.exports.appendClassName = function(className) {
  classList.add(className);
};
