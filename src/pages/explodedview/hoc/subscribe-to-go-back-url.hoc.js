import { connect } from 'react-redux';

import {
  goBackUrl,
} from 'model/actions/exploded-view.actions';


export const withGoBackURL = (subscriber) => {
  const mapStateToProps = state => ({
    'backURL': state.raw.toJS().backURL,
  });

  const mapDispatchToProps = dispatch => ({
    'goBackUrl': (...params) => dispatch(goBackUrl(...params)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(subscriber);
};

