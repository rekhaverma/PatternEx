import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { routerActions } from 'react-router-redux';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import { addNotification } from 'model/actions';
import { fetchSuspiciousBehavior } from 'model/actions/suspicious';
import { createURL } from 'lib';
import ptrxREST from 'lib/rest';
import { tagsSelectBox, getSuspiciousBehaviorWithAlias } from 'model/selectors';
import { nameToPipeline } from 'lib/decorators';
import Tabs from 'components/tabs';
import { Button } from 'components/forms';
import SelectBox from 'components/select-box';
import DateRange from 'components/date-range';

import Layout, { Row } from '../components/layout';
import Popup from '../components/popup';
import ListingTable from '../components/listing-table';

const RECORDS = 'RECORDS';
const DOWNLOAD = 'DOWNLOAD';

const suspiciousOptions = [
  { 'id': 'all', 'content': 'All Suspicious' },
  { 'id': 'ranking', 'content': 'Outliers' },
  { 'id': 'classifier', 'content': 'Low Confidence Predictions' },
  { 'id': 'threat-intel', 'content': 'Threat Intel' },
  { 'id': 'recommendation', 'content': 'Recommendations' },
];

class SuspiciousListing extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'subView': '',
      'activeEntity': 'all',
      'suspiciousType': 'all',
      'downloadLink': '',
      'entitySearch': '',
      'displayPopup': false,
      'setCurrentPage': true,
    };

    this.changeSubView = this.changeSubView.bind(this);
    this.changeStateValue = this.changeStateValue.bind(this);
    this.changeDateValue = this.changeDateValue.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.fetchItems = this.fetchItems.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
  }

  componentDidMount() {
    const { defaultSubView, location } = this.props;

    this.setState({
      'subView': defaultSubView,
      'setCurrentPage': true,
    });
    const cb = () => {
      this.fetchItems(location.query);
    };
    this.updateFilters(this.props.location.query, cb);
  }

  componentWillReceiveProps() {
    this.setState({ 'setCurrentPage': true });
  }

  updateFilters(query, cb = () => { }) {
    const activeEntity = query.activeEntity ? query.activeEntity : 'all';
    const suspiciousType = query.suspiciousType ? query.suspiciousType : 'all';
    this.setState({
      'activeEntity': activeEntity,
      'suspiciousType': suspiciousType,
    }, cb);
  }

  changeSubView(nextView) {
    this.setState({
      'subView': nextView,
    });
  }

  changeStateValue(key, value) {
    const { location } = this.props;
    this.setState({
      [key]: value,
      'setCurrentPage': false,
    }, () => {
      if (key === 'activeEntity' || key === 'suspiciousType') {
        const nextUrl = createURL(
          location.pathname,
          { ...location.query, [key]: value },
        );
        this.props.updateLocation(nextUrl);

        this.setState({
          'downloadLink': '',
        });
      }
    });
  }

  changeDateValue(startDate, endDate) {
    const { location } = this.props;
    const utcStartDate = !startDate.isUTC() ? moment.utc(startDate.format('MM-DD-YYYY'), 'MM-DD-YYYY') : startDate;
    const utcEndDate = !endDate.isUTC() ? moment.utc(endDate.format('MM-DD-YYYY'), 'MM-DD-YYYY') : endDate;

    this.setState({
      'setCurrentPage': false,
    }, () => {
      const nextLocation = createURL(
        location.pathname,
        { ...location.query, 'start_time': utcStartDate.format('MM-DD-YYYY'), 'end_time': utcEndDate.format('MM-DD-YYYY') },
      );

      if (this.state.downloadLink !== '') {
        this.setState({
          'downloadLink': '',
        });
      }

      this.props.updateLocation(nextLocation);
    });
  }

  resetFilters() {
    this.setState({
      'activeEntity': 'all',
      'suspiciousType': 'all',
      'entitySearch': '',
      'setCurrentPage': false,
    }, () => {
      const nextLocation = createURL(
        location.pathname,
        {
          ...location.query,
          'start_time': moment.utc().subtract(7, 'day').format('MM-DD-YYYY'),
          'end_time': moment.utc().format('MM-DD-YYYY'),
        },
      );

      this.props.updateLocation(nextLocation);
    });
  }

  fetchItems(queryParams = {}) {
    const { time } = this.props;
    const params = {
      'limit': 2000,
      'start': 0,
    };

    if (this.state.activeEntity !== 'all') {
      params.pipeline = nameToPipeline(this.state.activeEntity);
    }

    if (this.state.suspiciousType !== 'all') {
      params.method_name = this.state.suspiciousType;
    }

    const list = Object.keys(queryParams);
    if (list.includes('activeEntity') && queryParams.activeEntity !== 'all') {
      params.pipeline = queryParams.activeEntity;
    }
    if (list.includes('suspiciousType') && queryParams.suspiciousType !== 'all') {
      params.suspiciousType = queryParams.suspiciousType;
    }

    this.setState({
      'setCurrentPage': true,
    });
    this.props.fetchSuspiciousBehavior(
      time.startTime.startOf('day').unix(),
      time.endTime.endOf('day').unix(),
      params,
      true,
    );
  }

  async triggerDownload() {
    this.setState({
      'downloadIsLoading': true,
    });
    const { time } = this.props;
    const startDate = time.startTime.format('X');
    const endDate = time.endTime.format('X');
    const methodName = this.state.suspiciousType !== 'all' ? `&method_name=${this.state.suspiciousType}` : '';
    let url = `suspiciousbehavior/download?start_time=${startDate}&end_time=${endDate}&limit=100000${methodName}`;
    if (this.state.activeEntity !== 'all') {
      url += `&pipeline=${nameToPipeline(this.state.activeEntity)}`;
    }
    const response = await ptrxREST.get(url);

    if (response.status >= 200 && response.status < 300) {
      this.setState({
        'downloadLink': response.data.file_url,
        'displayPopup': response.data.file_url === '',
        'downloadIsLoading': false,
      });
    } else {
      this.setState({
        'downloadIsLoading': false,
      });
      addNotification('error', 'Download suspicious records failed');
    }
  }

  render() {
    const { subView } = this.state;
    const { pipelines, time } = this.props;
    const allPipelines = [{ 'id': 'all', 'content': 'All Entities' }];
    const tabs = [
      {
        'id': RECORDS,
        'title': 'Records',
      },
      {
        'id': DOWNLOAD,
        'title': 'Download',
      },
    ];

    const linkToSuspicious = JSON.stringify({
      'url': createURL(
        `${window.location.origin}/behavior/suspicious`,
        {
          'start_time': time.startTime.format('MM-DD-YYYY'),
          'end_time': time.endTime.format('MM-DD-YYYY'),
        },
      ),
    });

    return (
      <Layout>
        <Row customClass="+center">
          <span className="title">
            <FormattedMessage id="behavior.suspiciousListingTitle" />
          </span>
        </Row>
        <Row customClass="+center">
          <span className="text">
            <FormattedHTMLMessage
              id="behavior.recordsFound"
              values={{
                'count': this.props.items.length,
              }}
            />
          </span>
        </Row>
        <Row customClass="+center">
          <Tabs
            active={this.state.subView}
            className="tabsV2"
            items={tabs}
            style={{ 'margin': 10 }}
            onClick={this.changeSubView}
          />
        </Row>
        <Row style={{ 'padding': '0 20px', 'marginTop': 5 }}>
          <div className="behaviorLayout__filter">
            <SelectBox
              singleSelect
              activeOption={this.state.activeEntity}
              options={allPipelines.concat(pipelines)}
              placeholder="Entities"
              style={{ 'marginRight': 20 }}
              onClick={value => this.changeStateValue('activeEntity', value)}
            />
          </div>
          <div className="behaviorLayout__filter">
            <SelectBox
              singleSelect
              hasScrollbar
              activeOption={this.state.suspiciousType}
              options={suspiciousOptions}
              onClick={value => this.changeStateValue('suspiciousType', value)}
              placeholder="Method Name"
            />
          </div>
          <DateRange
            startDate={time.startTime}
            endDate={time.endTime}
            updateDateRange={this.changeDateValue}
            showHoursList={false}
            theme="row"
          />
          {
            subView === RECORDS && (
              <div style={{ 'marginLeft': 'auto' }}>
                <Button
                  className="button--success +small"
                  onClick={() => this.fetchItems()}
                >
                  Apply
                </Button>
                <Button
                  className="button--dark +small"
                  onClick={() => this.resetFilters()}
                >
                  Reset
                </Button>
              </div>
            )
          }
          {
            subView === DOWNLOAD && this.state.downloadLink === '' && (
              <div style={{ 'marginLeft': 'auto', 'display': 'flex', 'alignItems': 'center' }}>
                <Button
                  className="button--success +small"
                  onClick={() => this.fetchItems()}
                >
                  Apply
                </Button>
                <Button
                  className="button--success +small"
                  onClick={() => this.triggerDownload()}
                >
                  <span className="icon-download file-download" />
                  Download
                </Button>
                {this.state.downloadIsLoading && (
                  <div className="sk-fading-circle">
                    <div className="sk-circle1 sk-circle" />
                    <div className="sk-circle2 sk-circle" />
                    <div className="sk-circle3 sk-circle" />
                    <div className="sk-circle4 sk-circle" />
                    <div className="sk-circle5 sk-circle" />
                    <div className="sk-circle6 sk-circle" />
                    <div className="sk-circle7 sk-circle" />
                    <div className="sk-circle8 sk-circle" />
                    <div className="sk-circle9 sk-circle" />
                    <div className="sk-circle10 sk-circle" />
                    <div className="sk-circle11 sk-circle" />
                    <div className="sk-circle12 sk-circle" />
                  </div>
                )}
              </div>
            )
          }
          {
            subView === DOWNLOAD && this.state.downloadLink !== '' && (
              <div style={{ 'marginLeft': '15%' }}>
                <a
                  href={this.state.downloadLink}
                  style={{ 'textDecoration': 'none', 'color': '#337ab7' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click to download CSV
                  <span
                    className="icon-close"
                    style={{ 'color': '#C52121' }}
                    onClick={(e) => {
                      e.preventDefault();
                      this.changeStateValue('downloadLink', '');
                    }}
                  />
                </a>
              </div>
            )
          }
        </Row>
        <ListingTable
          backRoute={linkToSuspicious}
          time={time}
          items={this.state.entitySearch === ''
            ? this.props.items
            : this.props.items.filter(el => el.entity_name === this.state.entitySearch)}
          tags={this.props.rawTags}
          entitySearch={this.state.entitySearch}
          updateDisplayPopup={() => this.changeStateValue('displayPopup', true)}
          type="suspicious"
          setCurrentPage={this.state.setCurrentPage}
          allColumnsAreSortable
          handleExplodedView={this.props.handleExplodedView}
          isOldEVPActive={this.props.isOldEVPActive}
        />
        {this.state.displayPopup && <Popup onClick={() => this.changeStateValue('displayPopup', false)} />}
      </Layout>
    );
  }
}
SuspiciousListing.displayName = 'SuspiciousListing';
SuspiciousListing.propTypes = {
  'defaultSubView': PropTypes.oneOf([
    RECORDS, DOWNLOAD,
  ]),
  'items': PropTypes.array,
  'pipelines': PropTypes.array,
  'rawTags': PropTypes.object.isRequired,
  'time': PropTypes.shape({
    'startTime': PropTypes.object.isRequired,
    'endTime': PropTypes.object.isRequired,
    'timezone': PropTypes.string,
  }).isRequired,
  'location': PropTypes.object,
  'fetchSuspiciousBehavior': PropTypes.func.isRequired,
  'updateLocation': PropTypes.func.isRequired,
  'handleExplodedView': PropTypes.func.isRequired,
  'isOldEVPActive': PropTypes.bool,
};
SuspiciousListing.defaultProps = {
  'dateFormat': 'YYYY-MM-DD',
  'defaultSubView': RECORDS,
  'items': [],
  'query': {},
  'pipelines': [],
  'location': {},
  'isOldEVPActive': false,
};

const mapStateToProps = state => ({
  'tags': tagsSelectBox(state),
  'rawTags': state.raw.toJS().tags,
  'items': getSuspiciousBehaviorWithAlias(state),
  'isOldEVPActive': !state.app.ui.toJS().newEVPVisibility,
});

const mapDispatchToProps = dispatch => ({
  'fetchSuspiciousBehavior': (...args) => dispatch(fetchSuspiciousBehavior(...args)),
  'addNotification': (...args) => dispatch(addNotification(...args)),
  'handleExplodedView': (...args) => dispatch(routerActions.push(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SuspiciousListing);
