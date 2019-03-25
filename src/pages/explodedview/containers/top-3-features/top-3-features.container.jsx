import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import { withLocationData, withSearchData, withColumnFormatData } from '../../hoc';
import Section from '../../components/section';
import List, { TOP3ANALYTICS_CARD } from '../../components/list';

export const Top3FeaturesCard = (props) => {
  const {
    searchData,
    location,
    columnFormat,
    isColumnFormatDataLoaded,
    isSearchDataLoaded,
  } = props;
  const isDataLoaded = (isSearchDataLoaded && isColumnFormatDataLoaded) || false;

  return (
    <Section
      size="small"
      title="Top 3 Analytics"
      loaded={isDataLoaded}
    >
      <List
        type={TOP3ANALYTICS_CARD}
        data={searchData}
        columnFormat={columnFormat}
        pipeline={location.pipeline}
        customClass={{
          base: 'standard-card',
          modifiers: ['+outlayed', '+rows-highlight', '+topAnalytics'],
        }}
      />
    </Section>
  );
};

Top3FeaturesCard.displayName = 'Top3FeaturesCard';

Top3FeaturesCard.propTypes = {
  'location': PropTypes.object,
  'searchData': PropTypes.object,
  'columnFormat': PropTypes.array,
  'isSearchDataLoaded': PropTypes.bool,
  'isColumnFormatDataLoaded': PropTypes.bool,
};

Top3FeaturesCard.defaultProps = {
  'location': {},
  'searchData': {},
  'columnFormat': [],
  'isSearchDataLoaded': false,
  'isColumnFormatDataLoaded': false,
};

const enhance = compose(
  withColumnFormatData,
  withLocationData,
  withSearchData,
);

export default enhance(Top3FeaturesCard);
