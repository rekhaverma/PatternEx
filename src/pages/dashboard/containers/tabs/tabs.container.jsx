import React from 'react';
import PropTypes from 'prop-types';
import { isMoment } from 'moment';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { fetchClusterRelations } from 'model/actions';
import { fetchBehaviorSummary } from 'model/actions/dashboard';
import { fetchMaliciousBehavior } from 'model/actions/malicious';
import { fetchSuspiciousBehavior } from 'model/actions/suspicious';

import { summaryStats } from 'model/selectors';

import { dashboardTabs } from 'config';

import Tabs from 'components/tabs';

class TabsContainer extends React.PureComponent {
  componentDidMount() {
    const { startDate, endDate } = this.props;

    if (isMoment(startDate) && isMoment(endDate)) {
      this.props.fetchBehaviorSummary(startDate, endDate);
      this.props.fetchMaliciousBehavior(startDate.format('X'), endDate.format('X'));
      this.props.fetchSuspiciousBehavior(startDate.format('X'), endDate.format('X'));
      this.props.fetchClusterRelations(startDate, endDate);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { startDate, endDate } = this.props;
    if (isMoment(startDate) && isMoment(endDate)) {
      if (nextProps.startDate.format('YYYY-MM-DD') !== startDate.format('YYYY-MM-DD')
        || nextProps.endDate.format('YYYY-MM-DD') !== endDate.format('YYYY-MM-DD')) {
        nextProps.fetchBehaviorSummary(nextProps.startDate, nextProps.endDate);
        nextProps.fetchMaliciousBehavior(nextProps.startDate.format('X'), nextProps.endDate.format('X'));
        nextProps.fetchSuspiciousBehavior(nextProps.startDate.format('X'), nextProps.endDate.format('X'));
        nextProps.fetchClusterRelations(nextProps.startDate, nextProps.endDate);
      }
    }
  }

  render() {
    const { location, handleTabChange, stats } = this.props;
    return (
      <Tabs
        absoluteCenter
        active={location.query.tab}
        className="tabsV2"
        items={dashboardTabs.map(el => ({
          ...el,
          'count': <FormattedMessage id={`tabs.count.${el.id}`} values={{ 'count': stats[el.id] }} />,
        }))}
        onClick={handleTabChange}
      />
    );
  }
}
TabsContainer.propTypes = {
  'endDate': PropTypes.object.isRequired,
  'location': PropTypes.object.isRequired,
  'startDate': PropTypes.object.isRequired,
  'stats': PropTypes.object.isRequired,
  'handleTabChange': PropTypes.func.isRequired,
  'fetchClusterRelations': PropTypes.func.isRequired,
  'fetchBehaviorSummary': PropTypes.func.isRequired,
  'fetchSuspiciousBehavior': PropTypes.func.isRequired,
  'fetchMaliciousBehavior': PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  'stats': summaryStats(state),
});

const mapDispatchToProps = dispatch => ({
  'fetchClusterRelations': (...args) => dispatch(fetchClusterRelations(...args)),
  'fetchBehaviorSummary': (...args) => dispatch(fetchBehaviorSummary(...args)),
  'fetchMaliciousBehavior': (...args) => dispatch(fetchMaliciousBehavior(...args)),
  'fetchSuspiciousBehavior': (...args) => dispatch(fetchSuspiciousBehavior(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TabsContainer);
