import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import NoData from 'components/no-data';

import { withNXDomainData } from '../../hoc';

import NXCircle from '../../components/nx-circle';
import Section from '../../components/section';
import List, { NX_DOMAINS } from '../../components/list';

export const NXDomainsCard = (props) => {
  const {
    nxDomainsData,
    isNxDomainsDataLoaded,
  } = props;

  const nxDomainList = (<List
    title="Domain"
    type={NX_DOMAINS}
    data={nxDomainsData}
    customClass={{
      base: 'details-card',
      modifiers: ['+rows-highlight'],
    }}
  />);

  return (
    <Section
      size="small"
      title="NX Domain"
      className="nxDomain"
      loaded={isNxDomainsDataLoaded}
      expandable
      expandableView={nxDomainList}
    >
      {nxDomainsData.length <= 0 &&
      <NoData
        intlId="global.nodata"
        intlDefault="There is no data to display"
        className="nodata"
        withIcon
      />
      }
      {nxDomainsData.length > 0 &&
      <div>
        <NXCircle domains={nxDomainsData} />
        {nxDomainList}
      </div>
      }
    </Section>
  );
};

NXDomainsCard.displayName = 'NXDomainsCard';

NXDomainsCard.propTypes = {
  'nxDomainsData': PropTypes.array,
  'isNxDomainsDataLoaded': PropTypes.bool,
};

NXDomainsCard.defaultProps = {
  'nxDomainsData': [],
  'isNxDomainsDataLoaded': false,
  'onModalOpen': () => null,
};

const enhance = compose(withNXDomainData);

export default enhance(NXDomainsCard);
