import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { routerActions } from 'react-router-redux';

import { typeOfSuspicious, DASHBOARD_SUSPICIOUS_TABLE } from 'config';
import { mapIcons, pipelineToName } from 'lib';
import { enabledPipelines, suspiciousList } from 'model/selectors';
import { EvpOpenMethods } from 'model/classes/evp-open-methods';
import AdvancedTable from 'components/advanced-table';
import { Row, Column } from 'components/layout';
import Loader from 'components/loader/loader-v2.component';
import MultiSearch from 'components/multi-search';

import SuspiciousFilterList from '../../components/suspicious-filter-list';

import { suspiciousColumns } from './constants.jsx';

const groupBy = (items, key) => items.reduce(
  (result, item) => ({
    ...result,
    [item[key]]: [
      ...(result[item[key]] || []),
      item,
    ],
  }),
  {},
);

class SuspiciousActivity extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'pipelineValue': '',
      'tags': [],
      'methodValue': 'all',
    };

    this.setFilter = this.setFilter.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  setFilter(key, event) {
    const value = event.target.getAttribute('data-id');
    let tbUpdated = {};
    const urlParams = {};
    if (value && value !== null) {
      if (key === 'pipelineValue') {
        const pipelineValue = value === this.state.pipelineValue ? '' : value;
        tbUpdated = {
          [key]: pipelineValue,
        };
        urlParams.activeEntity = pipelineValue;
      } else if (key === 'methodValue') {
        urlParams.suspiciousType = value === 'all' ? '' : value;
        tbUpdated = { 'methodValue': value };
      } else {
        tbUpdated = { [key]: value };
      }
      this.setState(tbUpdated, () => {
        this.props.handleURLChange(urlParams);
      });
    }
  }

  getFilteredData() {
    const { data, isOldEVPActive, handleExplodedView } = this.props;
    const { pipelineValue, tags, methodValue } = this.state;
    let filteredData = data;

    if (pipelineValue !== '') {
      filteredData = data.filter(el => el.entity_type === pipelineValue);
    }

    if (methodValue !== 'all') {
      if (pipelineValue !== '') {
        filteredData = data.filter(el =>
          el.entity_type === pipelineValue && el.method_name === methodValue);
      } else {
        filteredData = data.filter(el => el.method_name === methodValue);
      }
    }

    if (tags.length) {
      filteredData = data.filter((item) => {
        let match = 0;
        tags.forEach((tag) => {
          if (item.entity_name.toLowerCase().includes(tag.toLowerCase())) {
            match += 1;
          }
        });

        return match === tags.length;
      });
    }

    return filteredData.map(el => ({
      ...el,
      'handlers': {
        ...el.handlers,
        'onRowClick': (e, row) => EvpOpenMethods.onRowClickHandler(row, 'suspicious', isOldEVPActive, handleExplodedView),
        'onInspect': (e, row) => EvpOpenMethods.onInspectHandler(row, 'suspicious', isOldEVPActive),
        'getNewTabUrl': row => EvpOpenMethods.getNewTabUrlHandler(row, 'suspicious', isOldEVPActive),
        'onConfirm': (e) => {
          e.stopPropagation();
          const params = {
            ...el,
            start_time: el.end_time,
          };
          this.props.setLabelForPrediction(params, true);
        },
        'deleteLabel': (e) => {
          e.stopPropagation();
          if (el.user_tag && el.user_tag_id) { this.props.deleteLabel(el.user_tag.label_id); }
        },
      },
    }));
  }

  handleChange(tags) {
    this.setState({ tags });
  }

  render() {
    const { data, isDataLoaded } = this.props;
    const filteredData = this.getFilteredData();

    if (!isDataLoaded) {
      return (
        <Row style={{ position: 'relative', background: 'linear-gradient(113deg, #1d1d1d, #141414)', flex: 1 }}>
          <Loader small />
        </Row>
      );
    }

    if (isDataLoaded && filteredData.length === 0) {
      return (
        <section className="dashboard__content +withGradient +noData">
          <h1>There is no data to display</h1>
        </section>
      );
    }

    const { pipelineValue, methodValue } = this.state;
    const groupByPipeline = groupBy(data, 'entity_type');
    const listOfSuspiciousEntities = Object.keys(groupByPipeline).map(key =>
      ({
        'id': key,
        'icon': mapIcons(key),
        'label': `${groupByPipeline[key].length} ${pipelineToName(key)}`,
      }));

    return (
      <Row style={{ position: 'relative', background: 'linear-gradient(113deg, #1d1d1d, #141414)', flex: 1 }}>
        <Column size={1} total={2} style={{ justifyContent: 'space-between' }}>
          <Row style={{ margin: 15 }}>
            <Column size={1} total={2}>
              <span className="dashboard__title">
                <FormattedMessage id="suspicious.listByType" />
              </span>
              <SuspiciousFilterList
                active={pipelineValue}
                list={listOfSuspiciousEntities}
                onClick={e => this.setFilter('pipelineValue', e)}
              />
            </Column>
            <Column size={1} total={2}>
              <span className="dashboard__title">
                <FormattedMessage id="suspicious.listByMethod" />
              </span>
              <SuspiciousFilterList
                active={methodValue}
                list={typeOfSuspicious}
                onClick={e => this.setFilter('methodValue', e)}
              />
            </Column>
          </Row>
          <div className="dashboard__toListing">
            <Link to={this.props.nextUrl}>
              <span className="icon-chevron-right" />
              <FormattedMessage id="suspicious.toSuspiciousListing" />
            </Link>
          </div>
        </Column>
        <Column size={1} total={2} style={{ margin: 15 }}>
          <AdvancedTable
            classname="table"
            data={filteredData}
            tableConfig={suspiciousColumns}
            pageSize="10"
            locationPage={DASHBOARD_SUSPICIOUS_TABLE}
          >
            <div className="dashboard__topColumn" style={{ 'display': 'flex' }}>
              <MultiSearch
                tags={this.state.tags}
                onChange={this.handleChange}
                placeholder="Search for entity"
              />
            </div>
          </AdvancedTable>
        </Column>
      </Row>
    );
  }
}
SuspiciousActivity.propTypes = {
  'setLabelForPrediction': PropTypes.func.isRequired,
  'handleExplodedView': PropTypes.func.isRequired,
  'data': PropTypes.array,
  'nextUrl': PropTypes.string,
  'isDataLoaded': PropTypes.bool,
  'handleURLChange': PropTypes.func,
  'deleteLabel': PropTypes.func,
  'isOldEVPActive': PropTypes.bool,
};
SuspiciousActivity.defaultProps = {
  'data': [],
  'nextUrl': '',
  'isDataLoaded': false,
  'isOldEVPActive': false,
  'handleURLChange': () => {},
  'deleteLabel': () => {},
};

const mapStateToProps = state => ({
  'data': suspiciousList(state),
  'pipelines': enabledPipelines(state),
  'isDataLoaded': state.raw.getIn(['loadStatus', 'suspiciousBehavior']),
  'isOldEVPActive': !state.app.ui.toJS().newEVPVisibility,
});

const mapDispatchToProps = dispatch => ({
  'handleExplodedView': (...args) => dispatch(routerActions.push(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SuspiciousActivity);
