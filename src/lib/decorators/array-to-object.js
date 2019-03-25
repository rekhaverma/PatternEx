/**
 * Transform an array to object
 *
 * @param {Array} array       Original array
 * @param {String} idKey      Object's key for an element
 * @returns {Object}
 */
export default (array, idKey = '') => {
  if (!Array.isArray(array)) {
    return array;
  }
  if (idKey !== '') {
    return array.reduce((acc, el) => ({
      ...acc,
      [el[idKey]]: el,
    }), {});
  }
  return array.reduce((acc, el, index) => ({
    ...acc,
    [index]: el,
  }), {});
};
