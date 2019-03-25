import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { isSameDate } from 'lib';
import { fetchBehaviorSummary } from 'model/actions/dashboard';
import { suspiciousSummary } from 'model/selectors';

import SuspiciousWidget, { SuspiciousNoData } from '../../components/suspicious-widget';

const itemsAreEmpty = (items) => {
  let isEmpty = true;
  items.forEach((el) => {
    if (el.value > 0) {
      isEmpty = false;
    }
  });
  return isEmpty;
};

class SuspiciousEntities extends React.PureComponent {
  componentDidMount() {
    const { startDate, endDate, fetchData } = this.props;
    fetchData(startDate, endDate);
  }

  /**
   * Fetch again the suspicious data if the range is changed
   *
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    const { fetchData } = this.props;
    if (!isSameDate(nextProps.startDate, this.props.startDate)
      || !isSameDate(nextProps.endDate, this.props.endDate)) {
      fetchData(nextProps.startDate, nextProps.endDate);
    }
  }

  render() {
    const { items, onClick } = this.props;

    if (itemsAreEmpty(items)) {
      return (<SuspiciousNoData />);
    }
    return (
      <SuspiciousWidget items={items} onClick={onClick} />
    );
  }
}
SuspiciousEntities.displayName = 'SuspiciousEntities';
SuspiciousEntities.propTypes = {
  'endDate': PropTypes.object.isRequired,
  'items': PropTypes.array,
  'startDate': PropTypes.object.isRequired,
  'fetchData': PropTypes.func.isRequired,
  'onClick': PropTypes.func,
};
SuspiciousEntities.defaultProps = {
  'items': [],
  'onClick': () => null,
};

const mapStateToProps = state => ({
  'items': suspiciousSummary(state),
});

const mapDispatchToProps = dispatch => ({
  'fetchData': (...args) => dispatch(fetchBehaviorSummary(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SuspiciousEntities);
