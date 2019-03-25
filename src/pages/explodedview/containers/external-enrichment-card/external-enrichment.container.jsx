import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import NoData from 'components/no-data';
import AdvancedTable from 'components/advanced-table';
import { EXTERNAL_TABLE } from 'config';

import Section from '../../components/section';
import { withExternalEnrichmentData } from '../../hoc';
import { externalEnrichmentFormatData } from '../../config';

export const ExternalEnrichmentCard = (props) => {
  const { isExternalEnrichmentDataLoaded, externalEnrichmentData } = props;

  return (
    <Section
      size="small"
      className="overflow-visible"
      title="External Enrichment"
      loaded={isExternalEnrichmentDataLoaded}
    >
      {externalEnrichmentData.length > 0 ? (
        <AdvancedTable
          data={externalEnrichmentData}
          tableConfig={externalEnrichmentFormatData}
          onRowClick={() => {
          }}
          locationPage={EXTERNAL_TABLE}
        />
      ) : (
        <NoData
          intlId="global.nodata"
          intlDefault="There is no data to display"
          className="nodata"
          withIcon
        />
      )}

    </Section>
  );
};

ExternalEnrichmentCard.displayName = 'ExternalEnrichmentCard';

ExternalEnrichmentCard.propTypes = {
  'isExternalEnrichmentDataLoaded': PropTypes.bool,
  'externalEnrichmentData': PropTypes.array,
};

ExternalEnrichmentCard.defaultProps = {
  'isExternalEnrichmentDataLoaded': false,
  'externalEnrichmentData': [],
};

const enhance = compose(withExternalEnrichmentData);

export default enhance(ExternalEnrichmentCard);
