import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { routerActions } from 'react-router-redux';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import { addNotification } from 'model/actions';
import { fetchMaliciousBehavior } from 'model/actions/malicious';
import { createURL } from 'lib';
import ptrxREST from 'lib/rest';

import { tagsSelectBox, getMaliciousBehaviorWithAlias } from 'model/selectors';
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

class MaliciousListing extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'subView': '',
      'activeEntity': 'all',
      'activeTactic': 'all',
      'downloadLink': '',
      'entitySearch': '',
      'entityTactic': '',
      'displayPopup': false,
      'downloadIsLoading': false,
      'setCurrentPage': true,
    };

    this.changeSubView = this.changeSubView.bind(this);
    this.changeStateValue = this.changeStateValue.bind(this);
    this.changeDateValue = this.changeDateValue.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.fetchItems = this.fetchItems.bind(this);
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
    this.updateFilters(location.query, cb);
  }

  componentWillReceiveProps() {
    this.setState({ 'setCurrentPage': true });
  }

  updateFilters(query, cb = () => { }) {
    const activeEntity = query.activeEntity ? query.activeEntity : 'all';
    const activeTactic = query.activeTactic ? query.activeTactic : 'all';
    this.setState({
      'activeEntity': activeEntity,
      'activeTactic': activeTactic,
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
      if (key === 'activeEntity' || key === 'activeTactic') {
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
      'activeTactic': 'all',
      'entitySearch': '',
      'entityTactic': '',
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

    if (this.state.activeTactic !== 'all') {
      this.setState({
        entityTactic: this.state.activeTactic,
      });
    } else {
      this.setState({
        entityTactic: '',
      });
    }

    const list = Object.keys(queryParams);
    if (list.includes('activeEntity') && queryParams.activeEntity !== 'all') {
      params.pipeline = queryParams.activeEntity;
    }

    this.setState({
      'setCurrentPage': true,
    });
    this.props.fetchMaliciousBehavior(
      time.startTime.startOf('day').unix(),
      time.endTime.endOf('day').unix(),
      params,
      true,
    );
  }

  filterItems() {
    let items = this.props.items;

    if (this.state.entitySearch !== '') {
      items = items.filter(item => item.entity_name === this.state.entitySearch);
    }

    if (this.state.entityTactic !== '') {
      items = items.filter(item => item.tag_id === this.state.entityTactic);
    }

    return items;
  }

  async triggerDownload() {
    this.setState({
      'downloadIsLoading': true,
    });
    const { time } = this.props;
    const startDate = time.startTime.format('X');
    const endDate = time.endTime.format('X');
    let url = `maliciousbehavior/download?start_time=${startDate}&end_time=${endDate}&limit=100000`;
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
      this.props.addNotification('error', 'Download malicious records failed');
    }
  }

  render() {
    const { subView } = this.state;
    const { pipelines, tags, time } = this.props;
    const allPipelines = [{ 'id': 'all', 'content': 'All Entities' }];
    const allTactics = [{ 'id': 'all', 'content': 'All Tactics' }];

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
    const linkToMalicious = JSON.stringify({
      'url': createURL(
        `${window.location.origin}/behavior/malicious`,
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
            <FormattedMessage id="behavior.maliciousListingTitle" />
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
          {
            subView === RECORDS && (
              <div className="behaviorLayout__filter">
                <SelectBox
                  singleSelect
                  hasScrollbar
                  activeOption={this.state.activeTactic}
                  options={allTactics.concat(tags)}
                  onClick={value => this.changeStateValue('activeTactic', value)}
                  placeholder="Tactics"
                  style={{ 'marginRight': 20 }}
                />
              </div>
            )
          }
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
          backRoute={linkToMalicious}
          time={time}
          items={this.filterItems()}
          tags={this.props.rawTags}
          updateDisplayPopup={() => this.changeStateValue('displayPopup', true)}
          type="malicious"
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
MaliciousListing.displayName = 'MaliciousListing';
MaliciousListing.propTypes = {
  'defaultSubView': PropTypes.oneOf([
    RECORDS, DOWNLOAD,
  ]),
  'items': PropTypes.array,
  'pipelines': PropTypes.array,
  'rawTags': PropTypes.object.isRequired,
  'tags': PropTypes.array,
  'time': PropTypes.shape({
    'startTime': PropTypes.object.isRequired,
    'endTime': PropTypes.object.isRequired,
    'timezone': PropTypes.string,
  }).isRequired,
  'location': PropTypes.object,
  'fetchMaliciousBehavior': PropTypes.func.isRequired,
  'updateLocation': PropTypes.func.isRequired,
  'handleExplodedView': PropTypes.func.isRequired,
  'addNotification': PropTypes.func.isRequired,
  'isOldEVPActive': PropTypes.bool,
};
MaliciousListing.defaultProps = {
  'dateFormat': 'YYYY-MM-DD',
  'defaultSubView': RECORDS,
  'items': [],
  'location': {},
  'pipelines': [],
  'tags': [],
  'isOldEVPActive': false,
};

const mapStateToProps = state => ({
  'tags': tagsSelectBox(state),
  'rawTags': state.raw.toJS().tags,
  'items': getMaliciousBehaviorWithAlias(state),
  'isOldEVPActive': !state.app.ui.toJS().newEVPVisibility,
});

const mapDispatchToProps = dispatch => ({
  'fetchMaliciousBehavior': (...args) => dispatch(fetchMaliciousBehavior(...args)),
  'addNotification': (...args) => dispatch(addNotification(...args)),
  'handleExplodedView': (...args) => dispatch(routerActions.push(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MaliciousListing);
