import { createSelector } from 'reselect';
import { pipelineToName } from 'lib/decorators';

const rawState = state => state.raw.toJS();

export const suspiciousSummary = createSelector(
  rawState,
  (raw) => {
    const summary = raw.behaviorSummary;
    if (Object.keys(summary).includes('pipeline_wise_suspicious_behavior')) {
      return [
        {
          'id': 'sip',
          'label': 'Source IPs',
          'value': summary.pipeline_wise_suspicious_behavior.sip || 0,
        },
        {
          'id': 'dip',
          'label': 'Destination IPs',
          'value': summary.pipeline_wise_suspicious_behavior.dip || 0,
        },
        {
          'id': 'useraccess',
          'label': 'User IPs',
          'value': summary.pipeline_wise_suspicious_behavior.useraccess || 0,
        },
        {
          'id': 'domain',
          'label': 'Domains',
          'value': summary.pipeline_wise_suspicious_behavior.domain || 0,
        },
        {
          'id': 'sipdip',
          'label': 'Connections',
          'value': summary.pipeline_wise_suspicious_behavior.sipdip || 0,
        },
        {
          'id': 'sipdomain',
          'label': 'Sessions',
          'value': summary.pipeline_wise_suspicious_behavior.sipdomain || 0,
        },
      ];
    }
    return [];
  },
);

export const suspiciousSummaryCount = createSelector(
  rawState,
  (raw) => {
    const summary = raw.behaviorSummary;
    if (Object.keys(summary).includes('total_suspicious_behavior')) {
      return summary.total_suspicious_behavior;
    }
    return 0;
  },
);

export const tagsSelectBox = createSelector(
  rawState,
  raw => Object.keys(raw.tags).map(el => ({
    'id': raw.tags[el].id,
    'content': raw.tags[el].name,
  })),
);

export const enabledPipelines = createSelector(
  rawState,
  raw => Object.keys(raw.pipelines).filter(key => raw.pipelines[key].enabled),
);

export const getPrivileges = createSelector(
  rawState,
  raw => raw.privileges,
);

/** Convert raw pipeline to array of object
* object is {id: <pipeline>, content:<pipelineDisplayName>}
*/
export const pipelinesLabels = createSelector(
  rawState,
  raw => Object.keys(raw.pipelines)
    .filter(key => raw.pipelines[key].enabled)
    .map((pipeline) => {
      const pipelineObj = {
        'id': pipeline,
        'content': pipelineToName(pipeline),
      };
      // deafult has boolean value
      if (raw.pipelines[pipeline].default) {
        pipelineObj.default = true;
      }
      return pipelineObj;
    }),
);

/**
 * Convert all columnFeatures to feature disctionary
 * @return {Map} {<featureName>: <featureDisplayName> , ..}
 */
export const allFeatureDictionary = createSelector(
  rawState,
  (raw) => {
    if (raw.columnFormat.items) {
      return raw.columnFormat.items.reduce((cur, next) => {
        const acc = cur;
        acc[next.name] = next.displayName;
        return cur;
      }, {});
    }
    return {};
  },
);

/**
 * Convert true(isFeature = true) columnFeatures to feature disctionary
 * @return {Map} {<featureName>: <featureDisplayName> , ..}
 */
export const trueFeatureDictionary = createSelector(
  rawState,
  (raw) => {
    if (raw.columnFormat.items) {
      return raw.columnFormat.items.reduce((cur, next) => {
        const acc = cur;
        if (next.isFeature) {
          acc[next.name] = {
            'name': next.displayName,
            'description': next.description,
          };
        }
        return cur;
      }, {});
    }
    return {};
  },
);

export const featureSelectOption = createSelector(
  rawState,
  (raw) => {
    if (raw.columnFormat.items) {
      const trueFeatures = raw.columnFormat.items.filter(item => item.isFeature);
      return trueFeatures.map(item => (
        {
          'id': item.name,
          'content': item.displayName,
        }
      ));
    }
    return [];
  },
);
