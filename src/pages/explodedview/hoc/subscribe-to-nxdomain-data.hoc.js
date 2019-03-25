import { connect } from 'react-redux';

export const withNXDomainData = (subscriber) => {
  const mapStateToProps = state => ({
    'isNxDomainsDataLoaded': state.raw.toJS().loadStatus.nxDomainsDataLoaded,
    'nxDomainsData': state.raw.toJS().explodedView.nxDomains,
  });

  return connect(mapStateToProps)(subscriber);
};
