import { connect } from 'react-redux';
import { dhcpFormattedData } from 'model/selectors';

export const withDHCPData = (subscriber) => {
  const mapStateToProps = state => ({
    'isDHCPDataLoaded': state.raw.toJS().loadStatus.DHCPLoaded || false,
    'dhcpData': dhcpFormattedData(state),
  });

  return connect(mapStateToProps)(subscriber);
};
