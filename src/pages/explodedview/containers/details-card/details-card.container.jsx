import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { Link } from 'react-router';
import moment from 'moment';

import { dateFormats } from 'config';
import { createURL } from 'lib';

import { withLocationData, withSearchData } from '../../hoc';
import List, { DETAILS_CARD } from '../../components/list';
import Section from '../../components/section';

export const DetailsCard = (props) => {
  const { searchData, isSearchDataLoaded, location } = props;
  const linkToHistoricalBehaviourMap = createURL(
    '/historical-behaviour-map',
    { ...location,
      'start_time': moment(location.start_time, dateFormats.mmddyyDash).format(dateFormats.mmddyyDash),
      'end_time': moment(location.end_time, dateFormats.mmddyyDash).format(dateFormats.mmddyyDash),
    },
  );

  return (
    <Section size="small" title="Details" loaded={isSearchDataLoaded} >
      <List
        type={DETAILS_CARD}
        data={searchData}
        pipeline={location.pipeline}
        customClass={{
          base: 'details-card',
        }}
        behaviorType={Object.keys(location).includes('behavior_type') ? location.behavior_type : ''}
      />
      <div className="explodedView__toListing">
        <Link to={linkToHistoricalBehaviourMap}>
          <span className="icon-chevron-right" />
          <FormattedMessage id="evp.toHistoricalBehaviourMap" />
        </Link>
      </div>
    </Section>
  );
};

DetailsCard.displayName = 'DetailsCard';

DetailsCard.propTypes = {
  'searchData': PropTypes.object,
  'isSearchDataLoaded': PropTypes.bool,
  'location': PropTypes.object,
};

DetailsCard.defaultProps = {
  'searchData': {},
  'isSearchDataLoaded': false,
  'location': {},
};

const enhance = compose(
  withLocationData,
  withSearchData,
);

export default enhance(DetailsCard);
