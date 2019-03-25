/**
 *    Add states to a given className by looking for specific states
 * in props object.
 *
 * @param {Object}  props     Component props
 * @param {Array}   states    Array of states to be looked for in props
 * @param {String}  base      Bases className
 * @return {String}
 *
 * @example
 *  Given
 *    - props = { 'active': true, 'disabled': false }
 *    - states = [ 'active', 'disabled' ]
 *    - base = "btn"
 *  Function returns: "btn +active"
 */
export default (props, states, base) => states
  .reduce((acc, state) => (
    props[state] === true
      ? `${acc} +${state}`
      : acc
  ), base);
