import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getAmbariStatus } from 'model/actions';
import { ambariStatus } from 'model/selectors';

import ServiceStatus from '../../components/service-status';


export class AmbariStatus extends React.PureComponent {
  componentDidMount() {
    this.props.getAmbariStatus();
  }

  render() {
    return (
      <ServiceStatus states={this.props.statuses} />
    );
  }
}
AmbariStatus.propTypes = {
  'statuses': PropTypes.arrayOf(PropTypes.shape({
    'name': PropTypes.string.isRequired,
    'state': PropTypes.string.isRequired,
    'running': PropTypes.string.isRequired,
  })),
  'getAmbariStatus': PropTypes.func.isRequired,
};
AmbariStatus.defaultProps = {
  'statuses': [],
};

export const mapStateToProps = state => ({
  'statuses': ambariStatus(state),
});

const mapDispatchToProps = dispatch => ({
  'getAmbariStatus': (...args) => dispatch(getAmbariStatus(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AmbariStatus);
