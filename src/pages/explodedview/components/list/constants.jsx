import React from 'react';
import moment from 'moment';
import { isEmpty, capitalize, startCase } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { dateFormats } from 'config';
import { findEntityName, pipelineToName } from 'lib/decorators';
import jsLib from 'lib/js-native-functions';

export const DETAILS_CARD = '@@listComponent/details_card';
export const LABEL_HISTORY = '@@listComponent/label_history';
export const VALUES_PROP = '@@listComponent/values_prop';
export const TOP3ANALYTICS_CARD = '@@listComponent/top3Analytics_card';
export const RELATED_SOURCE_IPS = '@@listComponent/relatedSourceIPs_card';
export const RELATED_USERS = '@@listComponent/relatedUsers_card';
export const ANALYTICS = '@@listComponent/analytics';
export const DOMAIN_INFO = '@@listComponent/domain_info';
export const DOMAIN_INFO_SUBDOMAINS = '@@listComponent/domain_info_subdomains';
export const DOMAIN_INFO_RESOLUTIONS = '@@listComponent/domain_info_resolution';
export const NX_DOMAINS = '@@listComponent/nxdomains';
export const VULNERABILITY_REPORT = '@@listComponent/vulnerability_report_card';

const nodata = (<FormattedMessage id="evp.noDataLabel" />);

export const detailsCardConfig = (pipeline, searchData, behaviorType) => {
  if (Object.keys(searchData).length > 0) {
    const pipelineValue = findEntityName(pipeline, searchData) !== '' ? findEntityName(pipeline, searchData) : nodata;
    const alertCategory = searchData.predicted_tag.name ? searchData.predicted_tag.name : nodata;

    /**
     * Search for behavior_type value in data coming from search api,
     * otherwise get the behavior_type from url
     */
    const searchDataBehaviorType = searchData.behavior_type !== '' ? capitalize(searchData.behavior_type) : nodata;
    const alertType = behaviorType !== '' ? capitalize(behaviorType) : searchDataBehaviorType;
    const predictedProb = searchData.predicted_prob_sum;
    return [
      {
        name: pipelineToName(pipeline),
        key: pipeline,
        value: pipelineValue,
      },
      {
        name: 'Alert type',
        key: 'behavior_type',
        value: alertType,
      },
      {
        name: 'Alert category',
        key: 'predicted_tag.name',
        value: alertCategory,
      },
      {
        name: 'Attack probability',
        key: 'predicted_prob_sum',
        value: predictedProb != null ? jsLib.toFixed(predictedProb) : 0,
      },
      {
        name: 'Outlier score',
        key: 'score',
        value: searchData.score != null ? jsLib.toFixed(searchData.score) : 0,
      },
      {
        name: 'Timestamp',
        key: 'ts',
        value: moment.utc(searchData.ts).format(dateFormats.displayFormatUS),
      },
    ];
  }

  return [];
};

export const domainInfoConfig = (data) => {
  if (Object.keys(data).length > 0) {
    const openResolution = (
      <span
        onClick={() => {
          data.handlers.openResolution(true);
        }}
        className="domainLink"
      >
        <FormattedMessage id="evp.seeDetails" />
      </span>
    );
    const openSubdomains = (
      <span
        onClick={() => {
          data.handlers.openSubdomains(true);
        }}
        className="domainLink"
      >
        <FormattedMessage id="evp.seeDetails" />
      </span>
    );

    const cdnInfo = data.cdn_info ? data.cdn_info : nodata;
    const tag = data.community_tag ? startCase(data.community_tag) : nodata;
    const resolution = data.resolutions ? openResolution : nodata;
    const subdomains = data.subdomains ? openSubdomains : nodata;
    return [
      {
        name: 'CDN Information',
        key: '',
        value: cdnInfo,
      },
      {
        name: 'Comunity Tag',
        key: 'comunity_tag',
        value: tag,
      },
      {
        name: 'Domain Resolution',
        key: 'domain_resolution',
        value: resolution,
      },
      {
        name: 'Subdomains',
        key: 'subdomains',
        value: subdomains,
      },
    ];
  }

  return [];
};

export const labelsHistoryConfig =
  (data, startDate, endDate) => data.reduce((acc, el) => {
    if (el.id !== 'starting_el' && el.id !== 'ending_el') {
      if (moment(el.create_time).isBetween(startDate, endDate)) {
        acc.push({
          name: el.name,
          value: moment(el.create_time).format('MM-DD-YYYY'),
          labelId: el.id,
          canBeDeleted: false,
        });
      }
    }
    return acc;
  }, []);


const extractColumnInfo = (key, data) => data.find(el => (el.name === key)) || {};

/**
 * Create data for Top 3 Analytics Card
 * Get the 3 features from top_n_features and use them as keys
 * Get each feature's value from /search reasponse
 * Get feature name from /columnformat response
 * @return {Array}
 */

export const top3AnalyticsCardConfig = (searchData, columnFormat = []) => {
  try {
    if (Object.keys(searchData).includes('top_n_features')
    && Array.isArray(searchData.top_n_features)
    && searchData.top_n_features.length && columnFormat.length) {
      return searchData.top_n_features.reduce((acc, value) => [...acc, (() => {
        const searchDataKeys = Object.keys(searchData);
        const columnInfo = extractColumnInfo(value, columnFormat);
        const includeDisplayName = Object.keys(columnInfo).includes('displayName');
        const includeValue = searchDataKeys.includes(value);
        const name = includeDisplayName ? columnInfo.displayName : value;
        const valoare = searchData[value];
        const val = includeValue ? valoare : '';

        return {
          'key': value,
          'name': name,
          'value': typeof val === 'number' && !isNaN(val) ? jsLib.toFixed(val) : `${val}`,
        };
      })()], []);
    }
  } catch (err) {
    throw (err);
  }
  return [];
};

export const analyticsConfig = (searchData, columnFormat, tabData) => {
  const analyticsData = [];

  tabData.forEach((feature) => {
    if (searchData && Object.keys(searchData).includes(feature)) {
      let featureValue = 0;
      if (searchData[feature]) {
        if (typeof searchData[feature] === 'number') {
          featureValue = jsLib.toFixed(searchData[feature]);
        } else {
          featureValue = searchData[feature];
        }
      }

      analyticsData.push({
        'key': feature,
        'value': featureValue,
        'name': Object.keys(extractColumnInfo(feature, columnFormat)).includes('displayName') ?
          extractColumnInfo(feature, columnFormat).displayName : feature,
      });
    }
  });

  return analyticsData;
};

/**
 * Create data for Related Source IPs Card
 * Get the items from /relatedentity api call and for each item
 * return it's entity_name as a list item
 * @return {Array}
 */
export const relatedSourceIPsCardConfig = data => data.reduce((acc, value) => [...acc, {
  'key': value.entity_name,
  'name': value.entity_name,
  'value': '',
}], []);

/**
 * Create data for Related Users Card
 * Get the items from /search api call and for each item
 * return it's map_users as a list item
 * @return {Array}
 */

export const relatedUsersCardConfig = (data) => {
  if (!isEmpty(data)) {
    return Object.keys(data).reduce((acc, value) => [...acc, {
      'key': value,
      'name': value,
      'value': '',
    }], []);
  }
  return [];
};

/**
 * Create data for Vulnerability Report
 * Get the items from tenable report selector
 * @return {Array}
 */

export const vulnerabilityReportCardConfig = (tenableReportData) => {
  if (Object.keys(tenableReportData).length > 0) {
    return [
      {
        name: 'Entity type',
        key: 'entityTyoe',
        value: tenableReportData.entityType,
      },
      {
        name: 'DNS Name',
        key: 'dnsName',
        value: tenableReportData.dnsName,
      },
      {
        name: 'Netbios Name',
        key: 'netbios',
        value: tenableReportData.netbios,
      },
    ];
  }

  return [];
};

export const domainInfoSubdomains = (data) => {
  if (!isEmpty(data)) {
    return data.reduce((acc, value) => [...acc, {
      'key': value,
      'name': value,
      'value': '',
    }], []);
  }
  return [];
};

export const domainInfoResolution = (data) => {
  if (!isEmpty(data)) {
    return data.reduce((acc, value) => [...acc, {
      'key': value.ip_address,
      'name': value.ip_address,
      'value': value.last_resolved,
    }], []);
  }
  return [];
};

export const orderByDate = (data, order) => data.sort((a, b) => {
  let returnVal = 1;
  if (moment(a.value).isBefore(moment(b.value))) {
    returnVal = order === 'asc' ? -1 : 1;
  } else {
    returnVal = order === 'asc' ? 1 : -1;
  }
  return returnVal;
});
