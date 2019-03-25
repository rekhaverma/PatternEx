import { connect } from 'react-redux';

import { getLogsFWProxy, getLogsDNS } from 'model/actions/exploded-view';

export const withLogsData = (subscriber) => {
  const mapStateToProps = state => ({
    'logsData': state.raw.toJS().logs,
  });

  const mapDispatchToProps = dispatch => ({
    'getLogsFWProxy': (...params) => dispatch(getLogsFWProxy(...params)),
    'getLogsDNS': (...params) => dispatch(getLogsDNS(...params)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(subscriber);
};
