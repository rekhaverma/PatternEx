import { pick } from 'lodash';
import moment from 'moment';
import { createSelector } from 'reselect';
import { entitiesInCluster } from './entities.selectors';

export const timelineSelector = state => state.app.timeline.toJS();

const labelsSelector = state => state.data.labels.toJS().items;

export const getPredictionsTimeline = createSelector(
  entitiesInCluster,
  labelsSelector,
  (entities, labels) => entities.map((entity) => {
    let solved = false;
    let index = 0;

    while (index < labels.length && !solved) {
      if (labels[index].entity_name === entity.entity_name) {
        solved = true;
      }
      index += 1;
    }

    return {
      ...pick(entity, ['entity_name', 'behavior']),
      'day_ts': moment(entity.day_ts),
      'solved': !solved,
    };
  }),
);
