import { connect } from 'react-redux';

export const withRelatedEntitiesData = (subscriber) => {
  const mapStateToProps = state => ({
    'isRelatedEntitiesDataLoaded': state.raw.toJS().loadStatus.relatedEntitiesDataLoaded,
    'relatedEntitiesData': state.raw.toJS().explodedView.relatedEntities,
  });

  return connect(mapStateToProps)(subscriber);
};
