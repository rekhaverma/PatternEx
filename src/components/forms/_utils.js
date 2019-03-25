import { startsWith } from 'lodash';

/**
 * Filter props keys to only one that starts with
 * 'on' (all callbacks will start 'on') and return
 * a new object with only those props.
 *
 * @param  {Object} props   Component's props
 * @return {Object}         Only callback props
 */
export const extractCallbacks = props => Object.keys(props)
  .filter(prop => startsWith(prop, 'on'))
  .reduce((output, obj) => {
    output[obj] = props[obj]; // eslint-disable-line
    return output;
  }, {});
