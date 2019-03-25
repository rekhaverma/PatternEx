import { createSelector } from 'reselect';

import { mapTagToColor } from 'lib';
import { tagsFromState } from './malicious-activity.selectors';

export const tagsSelector = (state) => {
  const tags = state.raw.tags.toJS().items;

  return Object.keys(tags).map(el => tags[el]);
};

export const getSelectorByName = (state, props) =>
  state.data.tags.toJS().items.filter(el => el.name.toLowerCase() === props.name.toLowerCase());

export const getSelectorById = (state, props) =>
  state.data.tags.toJS().items.filter(el => el.id === props.id);

export const getTagsForChart = createSelector(
  tagsFromState,
  tags => Object.values(tags).reduce((acc, item) => {
    if (item.labels_count > 0) {
      acc.push({
        'label': item.name,
        'count': item.labels_count,
        'color': mapTagToColor(item.name),
      });
    }
    return acc;
  }, []),
);
