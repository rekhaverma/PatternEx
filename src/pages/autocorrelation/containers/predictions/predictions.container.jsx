import React from 'react';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import { connect } from 'react-redux';
import { FormattedHTMLMessage } from 'react-intl';

import { clusterPredictions, clusterLabels } from 'model/selectors';
import { EvpOpenMethods } from 'model/classes/evp-open-methods';
import Tabs from 'components/tabs';
import Table from 'components/table';

import { predictionsColumns, labelsColums } from './constants.jsx';

const UNLABELED = 'unlabeled';
const LABELS = 'labels';

class Predictions extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'activeTab': '',
    };

    this.updateTabView = this.updateTabView.bind(this);
  }

  componentDidMount() {
    if (this.state.activeTab === '') {
      this.setState({
        'activeTab': UNLABELED,
      });
    }
  }

  updateTabView(nextTab) {
    this.setState({
      'activeTab': nextTab,
    });
  }

  render() {
    const { isOldEVPActive, handleExplodedView } = this.props;
    let data = this.props.searchValue !== ''
      ? this.props.data.filter(el => (
        el.entity_name.toLowerCase().includes(this.props.searchValue.toLowerCase())
        || el.threat.toLowerCase().includes(this.props.searchValue.toLowerCase())
      ))
      : this.props.data;
    const tabs = [
      { 'id': UNLABELED, 'title': <FormattedHTMLMessage id="predictions.tabs.unlabeled" values={{ 'count': data.length }} /> },
      { 'id': LABELS, 'title': <FormattedHTMLMessage id="predictions.tabs.labeled" /> },
    ];

    data = data.map(el => ({
      ...el,
      'handlers': {
        ...el.handlers,
        'setLabel': (e) => {
          e.stopPropagation();
          this.props.setLabelForPrediction(el, true);
        },
        'openEVP': (e, row) => {
          e.stopPropagation();

          EvpOpenMethods.onRowClickHandler(row, row.behavior, isOldEVPActive, handleExplodedView);
        },
      },
    }));

    return (
      <div>
        <Tabs
          slim
          fullWidth
          active={this.state.activeTab}
          className="tabsV2"
          items={tabs}
          onClick={this.updateTabView}
        />
        {
          this.state.activeTab === UNLABELED ? (
            <Table
              className="table"
              columns={predictionsColumns}
              data={data}
              options={{
                'firstPage': 'First',
                'lastPage': 'Last',
                'hidePageListOnlyOnePage': true,
                'sizePerPageList': [{
                  'text': '10', 'value': 10,
                }, {
                  'text': '20', 'value': 20,
                }, {
                  'text': '30', 'value': 30,
                }, {
                  'text': '50', 'value': 50,
                }],
                'sizePerPage': 10,
                'pageList': 1,
                'onRowClick': row => this.props.onRowClick(row.entity_name),
              }}
              expandableRow={() => false}
              expandComponent={() => null}
              pagination
            />
          ) : (
            <Table
              className="table"
              columns={labelsColums}
              data={this.props.labels}
              options={{
                'firstPage': 'First',
                'lastPage': 'Last',
                'hidePageListOnlyOnePage': true,
                'sizePerPageList': [{
                  'text': '10', 'value': 10,
                }, {
                  'text': '20', 'value': 20,
                }, {
                  'text': '30', 'value': 30,
                }, {
                  'text': '50', 'value': 50,
                }],
                'sizePerPage': 10,
                'pageList': 1,
                'onRowClick': row => this.props.onRowClick(row.entity_name),
              }}
              expandableRow={() => false}
              expandComponent={() => null}
              pagination
            />
          )
        }
      </div>
    );
  }
}
Predictions.propTypes = {
  'data': PropTypes.array,
  'labels': PropTypes.array,
  'searchValue': PropTypes.string,
  'onRowClick': PropTypes.func.isRequired,
  'setLabelForPrediction': PropTypes.func.isRequired,
  'handleExplodedView': PropTypes.func.isRequired,
  'isOldEVPActive': PropTypes.bool,
};
Predictions.defaultProps = {
  'data': [],
  'labels': [],
  'searchValue': '',
  'onRowClick': () => null,
  'isOldEVPActive': false,
};

const mapStateToProps = state => ({
  'data': clusterPredictions(state),
  'labels': clusterLabels(state),
  'isOldEVPActive': !state.app.ui.toJS().newEVPVisibility,
});

const mapDispatchToProps = dispatch => ({
  'handleExplodedView': (...args) => dispatch(routerActions.push(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Predictions);
