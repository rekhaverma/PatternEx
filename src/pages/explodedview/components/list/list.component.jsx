import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import NoData from 'components/no-data';

import ListItem from './components/listitem.component';
import {
  detailsCardConfig,
  top3AnalyticsCardConfig,
  relatedSourceIPsCardConfig,
  relatedUsersCardConfig,
  analyticsConfig,
  DETAILS_CARD,
  TOP3ANALYTICS_CARD,
  RELATED_SOURCE_IPS,
  RELATED_USERS,
  ANALYTICS,
  labelsHistoryConfig,
  LABEL_HISTORY,
  DOMAIN_INFO,
  DOMAIN_INFO_SUBDOMAINS,
  domainInfoSubdomains,
  domainInfoConfig,
  DOMAIN_INFO_RESOLUTIONS,
  domainInfoResolution,
  orderByDate,
  NX_DOMAINS,
  vulnerabilityReportCardConfig,
  VULNERABILITY_REPORT,
} from './constants.jsx';

const List = (props) => {
  let tbdData = [];
  switch (props.type) {
    case DETAILS_CARD:
      tbdData = detailsCardConfig(props.pipeline, props.data, props.behaviorType);
      break;

    case TOP3ANALYTICS_CARD:
      tbdData = top3AnalyticsCardConfig(props.data, props.columnFormat);
      break;

    case DOMAIN_INFO:
      tbdData = domainInfoConfig(props.data);
      break;

    case NX_DOMAINS:
      tbdData = domainInfoSubdomains(props.data);
      break;

    case DOMAIN_INFO_RESOLUTIONS:
      tbdData = orderByDate(domainInfoResolution(props.data), 'desc');
      break;

    case LABEL_HISTORY:
      tbdData = labelsHistoryConfig(props.data, props.startDate, props.endDate);
      if (tbdData.length > 0) {
        tbdData[tbdData.length - 1].canBeDeleted = true;
      }
      break;

    case DOMAIN_INFO_SUBDOMAINS:
      tbdData = domainInfoSubdomains(props.data);
      break;

    case RELATED_SOURCE_IPS:
      tbdData = relatedSourceIPsCardConfig(props.data);
      break;

    case RELATED_USERS:
      tbdData = relatedUsersCardConfig(props.data);
      break;

    case ANALYTICS:
      tbdData = analyticsConfig(props.data, props.columnFormat, props.tabData);
      break;

    case VULNERABILITY_REPORT:
      tbdData = vulnerabilityReportCardConfig(props.data);
      break;

    default:
      break;
  }

  const customClassName = `${props.customClass.base} ${Object.keys(props.customClass).includes('modifiers') ? props.customClass.modifiers.join(' ') : ''}`;

  if (tbdData.length < 1) {
    return (
      <NoData
        intlId="global.nodata"
        intlDefault="No data to display"
        className="nodata"
        withIcon
      />
    );
  }
  return (
    <div className={`card ${customClassName}`}>
      {
        tbdData.map((el, index) => (
          <ListItem
            key={`listitem-${index}`}
            data={el}
            type={props.type}
            handlers={props.handlers}
            customClass="card__item"
          />
        ))
      }
    </div>
  );
};

List.displayName = 'List';
List.propTypes = {
  'data': PropTypes.any,
  'type': PropTypes.string.isRequired,
  'customClass': PropTypes.object,
  'pipeline': PropTypes.string.isRequired,
  'columnFormat': PropTypes.array,
  'tabData': PropTypes.array,
  'handlers': PropTypes.object,
  'startDate': PropTypes.object,
  'endDate': PropTypes.object,
  'behaviorType': PropTypes.string,
};

List.defaultProps = {
  'data': null,
  'customClass': {},
  'pipeline': '',
  'columnFormat': [],
  'tabData': [],
  'handlers': {},
  'startDate': moment.utc('2018-01-01').startOf('day'),
  'endDate': moment.utc('2018-01-01').endOf('day'),
  'behaviorType': '',
};

export default List;
