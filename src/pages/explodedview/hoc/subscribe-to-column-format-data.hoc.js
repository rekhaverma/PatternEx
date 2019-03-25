import { connect } from 'react-redux';

export const withColumnFormatData = (subscriber) => {
  const mapStateToProps = state => ({
    'isColumnFormatDataLoaded': state.raw.toJS().loadStatus.columnFormatLoaded || false,
    'columnFormat': state.raw.toJS().columnFormat.items,
  });

  return connect(mapStateToProps)(subscriber);
};
