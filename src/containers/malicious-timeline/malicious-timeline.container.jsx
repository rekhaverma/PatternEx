import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

import { resetFilters, setFilter } from 'model/actions/malicious-activity.actions';
import { activityTimeline } from 'model/selectors/malicious-activity.selectors';
import { TimelineDiagramContainer } from 'containers/d3-timeline-diagram-container';

export const MaliciousTimeline = props => (
  <TimelineDiagramContainer {...props} items={props.items} />
);
MaliciousTimeline.propTypes = {
  'items': PropTypes.object,
};
MaliciousTimeline.defaultProps = {
  'items': {},
};

export const mapStateToProps = state => ({
  'items': activityTimeline(state),
});

const mapDispatchToProps = dispatch => ({
  'onDayClick': date => dispatch(setFilter('highlighted', moment(date).utc())),
  'resetDayClick': () => dispatch(resetFilters()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MaliciousTimeline);
