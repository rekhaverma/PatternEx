import React from 'react';
import PropTypes from 'prop-types';
import { connect, Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';

function defaultSelector(state) {
  return state.intl;
}

const mapStateToProps = (state, { intlSelector = defaultSelector }) => {
  const intl = intlSelector(state);
  return {
    ...intl,
    'key': intl.locale,
  };
};

const HOCIntl = connect(mapStateToProps)(IntlProvider);
const RawProvider = (props) => {
  const { children, store } = props;
  return (
    <Provider store={store}>
      <HOCIntl>
        {children}
      </HOCIntl>
    </Provider>
  );
};

RawProvider.displayName = 'RawProvider';
RawProvider.propTypes = {
  'children': PropTypes.element.isRequired,
  'store': PropTypes.object.isRequired,
};

export default RawProvider;
