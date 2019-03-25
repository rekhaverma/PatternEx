/**
 *   Verify if params are the same. To optimize this, check
 * first the size (properties) of the object, if they are not the same,
 * it's clear some params were added or removed.
 *
 * @param {Object}    query         Current props
 * @param {nextQuery} nextQuery     Next props
 * @return {Boolean}
 */
export default (query, nextQuery) => {
  let output = true;

  if (Object.keys(query).length !== Object.keys(nextQuery).length) {
    return false;
  }

  Object.keys(nextQuery).forEach((key) => {
    if (query[key] !== nextQuery[key]) {
      output = false;
    }
  });

  return output;
};
