import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Table from 'components/table';
import SelectBox from 'components/select-box';

import findEntityName from 'lib/decorators/find-entity-name';

import { FormattedMessage } from 'react-intl';

import { pipelineTableData, columnFormatPipeline, pipelineTableCount } from 'model/selectors';

import { buildTableColumns } from './constants.jsx';

class PipelineTable extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'selectedFeatures': [],
      'pipeline': args[0].pipeline,
    };

    this.onSelectClick = this.onSelectClick.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updateTable) {
      this.setState({
        'pipeline': nextProps.pipeline,
        'modelType': nextProps.modelType,
      });
    }
  }
  onSelectClick(newItem, allItems) {
    this.setState({
      'selectedFeatures': allItems,
    });
  }

  handlePagination(nextPage, itemsInPage) {
    // const { currentPage } = this.state;
    // const { data } = this.props;

    const start = (nextPage - 1) * itemsInPage;
    const limit = itemsInPage;

    this.props.onPageChange(nextPage);
    this.props.handleFetchMore(start, limit);

    /* if (nextPage > currentPage) {
      if (nextPage * itemsInPage >= data.length - itemsInPage) {
        this.setState({
          'currentPage': nextPage,
        }, () => {
          this.props.handleFetchMore(data.length);
        });
      }
    } */
  }

  handlePageSizeChange(newPageSize) {
    this.props.changePageSize(newPageSize);
  }

  render() {
    const {
      data,
      features,
      handleSetLabel,
      deleteLabel,
      searchValue,
      totalDataCount,
      pageSize,
      currentPage,
    } = this.props;
    const { pipeline, modelType } = this.state;
    // const { currentPage } = this.state;
    let filteredData = data;

    const renderTopFeatureComponent = () => (
      <div className="pipeline__featureHeader">
        <span><FormattedMessage id="pipeline.table.top_features" /></span>
        <SelectBox
          hasScrollbar
          customClassName="pipeline__featureHeader__box"
          options={features}
          activeOption={this.state.selectedFeatures}
          placeholder="Select Type"
          style={{ 'maxWidth': 200 }}
          onClick={this.onSelectClick}
        />
      </div>
    );

    if (searchValue !== '') {
      filteredData = data.filter((entity) => {
        const pipelineProperty = findEntityName(pipeline, entity);
        const searchBy = searchValue.toLowerCase();

        if (pipelineProperty.split(' ').length === 2) {
          if (pipelineProperty.split(' ')[0].includes(searchBy)
            || pipelineProperty.split(' ')[1].includes(searchBy)) {
            return entity;
          }
        }
        if (pipelineProperty.includes(searchBy)) {
          return entity;
        }
        return null;
      });
    }

    return (
      <Table
        className="table"
        customTrClassName="pipeline__tableRow"
        customHeaderClassName="table--allowOverflow"
        fetchPipelineParams={this.props.fetchPipelineParams}
        columns={buildTableColumns(
          pipeline,
          modelType,
          this.state.selectedFeatures,
          renderTopFeatureComponent,
        )}
        data={filteredData.map((el, index) => ({
          ...el,
          'handlers': {
            ...el.handlers,
            'setLabel': (e) => {
              e.stopPropagation();

              handleSetLabel(el, true, index);
            },
            'deleteLabel': (e) => {
              e.stopPropagation();
              deleteLabel(el.user_tag.label_id, index);
            },
          },
        }))}
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
          'sizePerPage': pageSize,
          'pageList': currentPage,
          'page': currentPage,
          'onPageChange': this.handlePagination,
          'onSizePerPageList': this.handlePageSizeChange,
          'onRowClick': this.props.handleExplodedView,
        }}
        expandableRow={() => false}
        expandComponent={() => null}
        pagination
        sortableColumns
        fetchInfo={{
          'dataTotalSize': totalDataCount,
        }}
        enableRemote
      />
    );
  }
}
PipelineTable.propTypes = {
  'data': PropTypes.array.isRequired,
  'features': PropTypes.array.isRequired,
  'pipeline': PropTypes.string.isRequired,
  'modelType': PropTypes.string.isRequired,
  'handleSetLabel': PropTypes.func.isRequired,
  'deleteLabel': PropTypes.func.isRequired,
  'handleExplodedView': PropTypes.func.isRequired,
  'handleFetchMore': PropTypes.func.isRequired,
  'fetchPipelineParams': PropTypes.object,
  'searchValue': PropTypes.string,
  'totalDataCount': PropTypes.number,
  'changePageSize': PropTypes.func.isRequired,
  'pageSize': PropTypes.number,
  'onPageChange': PropTypes.func.isRequired,
  'currentPage': PropTypes.number.isRequired,
  'updateTable': PropTypes.bool.isRequired,
};

PipelineTable.defaultProps = {
  'fetchPipelineParams': {},
  'searchValue': '',
  'deleteLabelCall': '',
  'totalDataCount': 0,
  'pageSize': '20',
};

const mapStateToProps = state => ({
  'data': pipelineTableData(state),
  'totalDataCount': pipelineTableCount(state),
  'features': columnFormatPipeline(state),
});

export default connect(mapStateToProps)(PipelineTable);
