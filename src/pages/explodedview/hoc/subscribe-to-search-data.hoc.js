import { connect } from 'react-redux';

export const withSearchData = (subscriber) => {
  const mapStateToProps = state => ({
    'isSearchDataLoaded': state.raw.toJS().loadStatus.searchAPI || false,
    'searchData': state.raw.toJS().explodedView.searchData[0] || {},
  });

  return connect(mapStateToProps)(subscriber);
};

export const withFullSearchData = (subscriber) => {
  const mapStateToProps = state => ({
    'isSearchDataLoaded': state.raw.toJS().loadStatus.searchAPI || false,
    'searchData': state.raw.toJS().explodedView.searchData || [],
  });

  return connect(mapStateToProps)(subscriber);
};
