import { connect } from 'react-redux';

export const withDetailsData = (subscriber) => {
  const mapStateToProps = state => ({
    'isdetailsDataLoaded': state.raw.toJS().loadStatus.detailsLoaded || false,
    'detailsData': state.raw.toJS().explodedView.detailsData || [],
  });

  return connect(mapStateToProps)(subscriber);
};
