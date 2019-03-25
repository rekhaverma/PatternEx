import { createSelector } from 'reselect';
import moment from 'moment';
import { dateFormats } from 'config';

const resources = state => state.resources;

const inputValue = input => input.inputValue;

/**
 * Filter out the resource based on the searched text
 *
 * @param {Array} resources
 * @return {Array}
 */
export const filterResources = createSelector(
  resources,
  inputValue,
  (resource, input) => resource.filter((el) => {
    const resourceName = el.name.toLowerCase();
    return resourceName.includes(input.toLowerCase());
  }),
);

export const formatResources = createSelector(
  resources,
  resource =>
    resource.reduce((acc, item) => acc.concat([{
      ...item,
      'create_time_x': moment.utc(item.create_time, dateFormats.longFormatWithOffset).format('X'),
    }]), []),
);
