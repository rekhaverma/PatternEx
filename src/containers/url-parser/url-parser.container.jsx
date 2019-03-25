import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';

import {
  setCluster,
  setDate,
  setPipelines,
} from 'model/actions';

class UrlParser extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.updateLocation = this.updateLocation.bind(this);
  }

  componentWillMount() {
    const { query } = this.props.location;

    if (query.cluster) {
      this.props.setCluster(query.cluster);
    }

    if (query.fromDate) {
      this.props.setDate('fromDate', query.fromDate);
    }

    if (query.untilDate) {
      this.props.setDate('untilDate', query.untilDate);
    }

    if (query.pipelines) {
      this.props.setPipelines(query.pipelines.split(','));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { query } = this.props.location;
    const nextQuery = nextProps.location.query;

    if (nextQuery.location && nextQuery.location !== query.location) {
      this.props.setCluster(nextQuery.cluster);
    }

    if (nextQuery.fromDate && nextQuery.fromDate !== query.fromDate) {
      this.props.setDate('fromDate', nextQuery.fromDate);
    }

    if (nextQuery.untilDate && nextQuery.untilDate !== query.untilDate) {
      this.props.setDate('untilDate', nextQuery.untilDate);
    }

    if (nextQuery.pipelines && nextQuery.pipelines !== query.pipelines) {
      this.props.setPipelines(nextQuery.pipelines.split(','));
    }
  }

  updateLocation(key, value, path = '') {
    const { query } = this.props.location;
    const { changeLocation } = this.props;
    const pathname = path !== ''
      ? path
      : this.props.location.pathname;

    const urlQuery = Object.keys(query).reduce((acc, queryKey) => {
      if (key === queryKey) {
        return acc.concat(`${key}=${value}&`);
      }
      if (query[queryKey]) {
        return acc.concat(`${queryKey}=${query[queryKey]}&`);
      }
      return acc;
    }, '');

    if (!urlQuery.includes(`${key}=${value}`)) {
      changeLocation(`${pathname}?${urlQuery}${key}=${value}`);
      return null;
    }

    changeLocation(`${pathname}?${urlQuery}`);
    return null;
  }

  render() {
    const { children } = this.props;
    return React.cloneElement(
      children,
      {
        ...this.props,
        'updateLocation': (...args) => this.updateLocation(...args),
      },
    );
  }
}
UrlParser.displayName = 'UrlParser';
UrlParser.propTypes = {
  'children': PropTypes.any.isRequired,
  'location': PropTypes.object,
  'changeLocation': PropTypes.func.isRequired,
  'setCluster': PropTypes.func.isRequired,
  'setDate': PropTypes.func.isRequired,
  'setPipelines': PropTypes.func.isRequired,
};
UrlParser.defaultProps = {
  'location': {
    'cluster': '',
    'fromDate': '',
    'untilDate': '',
    'pipelines': '',
  },
};

const mapDispatchToProps = dispatch => ({
  'changeLocation': url => dispatch(routerActions.push(url)),
  'setCluster': (...args) => dispatch(setCluster(...args)),
  'setDate': (...args) => dispatch(setDate(...args)),
  'setPipelines': (...args) => dispatch(setPipelines(...args)),
});


export default connect(null, mapDispatchToProps)(UrlParser);
