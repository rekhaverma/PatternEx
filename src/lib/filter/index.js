import { toArray } from 'lodash';

/**
 * Filter array by a key property.
 * @param {Array} data
 * @param {String} keyOfFilter
 * @param {String} filter
 * @param {Boolean} isSearch
 * @returns {*}
 */
export default (data, keyOfFilter, filter, isSearch = false) => {
  let arr = data;

  // If data is not array, throw a warning and
  // convert data to array. Returned filter might not be
  // the expected result, but at least it will be an empty
  // array and the application won't crush.
  if (!Array.isArray(data)) {
    console.warn(`Type of "data" is ${typeof data}. Expected Array.`);  // eslint-disable-line
    arr = toArray(data);
  }

  if (isSearch) {
    return arr.filter(el => el[keyOfFilter].includes(filter));
  }

  return arr.filter(el => el[keyOfFilter].toLowerCase() === filter.toLowerCase());
};
