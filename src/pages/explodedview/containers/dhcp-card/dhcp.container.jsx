import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import NoData from 'components/no-data';
import AdvancedTable from 'components/advanced-table';
import { DHCP_TABLE } from 'config';

import Section from '../../components/section';

import { withDHCPData } from '../../hoc';
import { dhcpDataFormat } from '../../config';

export const DHCPCard = props => (
  <Section
    size="small"
    title="IP Hostname Mapping"
    loaded={props.isDHCPDataLoaded}
  >
    {props.dhcpData.length > 0 ? (
      <AdvancedTable
        data={props.dhcpData}
        tableConfig={dhcpDataFormat}
        onRowClick={() => {}}
        locationPage={DHCP_TABLE}
      />) :
        (
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

DHCPCard.displayName = 'DHCPCard';

DHCPCard.propTypes = {
  'isDHCPDataLoaded': PropTypes.bool,
  'dhcpData': PropTypes.array,
};

DHCPCard.defaultProps = {
  'isDHCPDataLoaded': false,
  'dhcpData': [],
};

const enhance = compose(withDHCPData);

export default enhance(DHCPCard);
