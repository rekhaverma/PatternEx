import { connect } from 'react-redux';
import { getHistoricalData } from 'model/actions/exploded-view';


export const withHistoricalData = (subscriber) => {
  const mapStateToProps = state => ({
    'isHistoricalDataLoaded': state.raw.toJS().loadStatus.historicalAPI || false,
    'historicalData': state.raw.toJS().explodedView.historicalData || {},
  });

  const mapDispatchToProps = dispatch => ({
    'getHistoricalData': (...params) => dispatch(getHistoricalData(...params)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(subscriber);
};

