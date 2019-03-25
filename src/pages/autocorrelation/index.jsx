import React from 'react';
import PropTypes from 'prop-types';
import moment, { isMoment } from 'moment';
import { createURL } from 'lib';

import { routerActions } from 'react-router-redux';

import { setLabelForPrediction } from 'model/actions/malicious-activity.actions';
import { resetDashboardLink } from 'model/actions';
import { getSelectedCluster } from 'model/selectors';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import DateRange from 'components/date-range';
import Modal from 'components/modal';

import ChangeLabel from 'containers/change-label';
import ClusterView from './containers/cluster-view';

import './autocorrelation.style.scss';

class Autocorrelation extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'changeLabelModal': false,
      'predictionRow': {},
    };

    this.updateDateRange = this.updateDateRange.bind(this);
    this.handleSetLabel = this.handleSetLabel.bind(this);
    this.closeChangeLabel = this.closeChangeLabel.bind(this);
    this.goBackToDashboard = this.goBackToDashboard.bind(this);
  }

  componentWillMount() {
    const { location } = this.props;

    const defaultStart = moment().subtract(7, 'day').utc();
    const defaultEnd = moment().utc();

    const startDate = location.query.start_time
      ? moment.utc(location.query.start_time, 'MM-DD-YYYY')
      : defaultStart;
    const endDate = location.query.end_time
      ? moment.utc(location.query.end_time, 'MM-DD-YYYY')
      : defaultEnd;

    if (isMoment(startDate) && isMoment(endDate)) {
      this.setState({
        'startDate': startDate.startOf('day'),
        'endDate': endDate.startOf('day'),
      });
    }
  }

  updateDateRange(startDate, endDate) {
    this.setState({
      'startDate': moment.utc(startDate.startOf('day')),
      'endDate': moment.utc(endDate.startOf('day')),
    }, () => {
      const { location } = this.props;
      const nextLocation = createURL(
        location.pathname,
        { ...location.query, 'start_time': startDate.format('MM-DD-YYYY'), 'end_time': endDate.format('MM-DD-YYYY') },
      );

      this.props.updateLocation(nextLocation);
    });
  }

  closeChangeLabel() {
    this.setState({ 'changeLabelModal': false, 'predictionRow': {} });
  }

  handleSetLabel(row) {
    this.setState({
      'predictionRow': row,
      'changeLabelModal': true,
    });
  }

  goBackToDashboard() {
    const { dashboardLink, router } = this.props;
    router.push(dashboardLink);
    this.props.resetDashboardLink();
  }

  render() {
    const { startDate, endDate, changeLabelModal } = this.state;
    const { location, currentCluster, dashboardLink } = this.props;

    return (
      <div className="dashboard">
        <div className="autocorrelate__row +spaceBetween">
          <div className="autocorrelate__backLink">
            {
              dashboardLink !== '' && (
                <span>
                  <span className="icon-chevron-left" />
                  <span onClick={this.goBackToDashboard}>
                    <FormattedMessage id="autocorrelation.backToDashboard" />
                  </span>
                </span>
              )
            }
          </div>
          <div className="autocorrelate__row +column +alignCenter">
            <p className="autocorrelate__header">
              <FormattedMessage id="card.autocorrelation.main" />
            </p>
            <p className="autocorrelate__subHeader">{currentCluster.central_entity} </p>
          </div>
          <div />
        </div>
        <div className="dashboard__bar">
          <div>
            <DateRange
              startDate={startDate}
              endDate={endDate}
              updateDateRange={this.updateDateRange}
            />
          </div>
        </div>
        <ClusterView
          startDate={startDate}
          endDate={endDate}
          location={location}
          setLabelForPrediction={this.handleSetLabel}
        />
        {
          changeLabelModal && (
            <Modal>
              <ChangeLabel
                predictionRow={this.state.predictionRow}
                onCancel={this.closeChangeLabel}
                onSave={this.props.setLabelForPrediction}
                title={<FormattedMessage id="suspicious.setLabel" />}
              />
            </Modal>
          )
        }
      </div>
    );
  }
}
Autocorrelation.propTypes = {
  'location': PropTypes.object.isRequired,
  'updateLocation': PropTypes.func.isRequired,
  'setLabelForPrediction': PropTypes.func.isRequired,
  'currentCluster': PropTypes.object.isRequired,
  'dashboardLink': PropTypes.string.isRequired,
  'router': PropTypes.object.isRequired,
  'resetDashboardLink': PropTypes.func.isRequired,
};
Autocorrelation.defaultProps = {
  'last_update': '',
  'maliciousCount': 0,
  'suspiciousCount': 0,
};

const mapStateToProps = state => ({
  'maliciousCount': state.raw.toJS().behaviorSummary.total_malicious_behavior,
  'suspiciousCount': state.raw.toJS().behaviorSummary.total_suspicious_behavior,
  'last_update': state.raw.toJS().systemInfo.update_time,
  'currentCluster': getSelectedCluster(state),
  'dashboardLink': state.raw.toJS().relations.dashboardLink,
});

const mapDispatchToProps = dispatch => ({
  'updateLocation': location => dispatch(routerActions.push(location)),
  'setLabelForPrediction': (...args) => dispatch(setLabelForPrediction(...args)),
  'resetDashboardLink': (...args) => dispatch(resetDashboardLink(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Autocorrelation);
