import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import NoData from 'components/no-data';

import { withRelatedEntitiesData, withLocationData } from '../../hoc';
import Section from '../../components/section';
import List, { RELATED_SOURCE_IPS } from '../../components/list';

export const RelatedSourceIP = (props) => {
  const { relatedEntitiesData, location, isRelatedEntitiesDataLoaded } = props;

  return (
    <Section size="small" title="Related Source IPs" loaded={isRelatedEntitiesDataLoaded}>
      {relatedEntitiesData.length ? (
        <List
          type={RELATED_SOURCE_IPS}
          data={relatedEntitiesData}
          pipeline={location.query.pipeline}
          customClass={{
            base: 'details-card',
            modifiers: ['+rows-highlight'],
          }}
        />
      ) : (
        <NoData
          intlId="global.nodata"
          intlDefault="There is no data to display"
          className="nodata"
          withIcon
        />
      )
      }

    </Section>
  );
};

RelatedSourceIP.displayName = 'RelatedSourceIP';

RelatedSourceIP.propTypes = {
  'relatedEntitiesData': PropTypes.object,
  'isRelatedEntitiesDataLoaded': PropTypes.bool,
  'location': PropTypes.object,
};

RelatedSourceIP.defaultProps = {
  'relatedEntitiesData': {},
  'isRelatedEntitiesDataLoaded': false,
  'location': {},
};

const enhance = compose(
  withLocationData,
  withRelatedEntitiesData,
);

export default enhance(RelatedSourceIP);

