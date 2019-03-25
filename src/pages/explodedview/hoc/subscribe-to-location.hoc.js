import { connect } from 'react-redux';

export const withLocationData = (subscriber) => {
  const mapStateToProps = state => ({
    'location': state.routing.locationBeforeTransitions.query,
  });

  return connect(mapStateToProps)(subscriber);
};
