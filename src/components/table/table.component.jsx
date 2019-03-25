import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { fetchPipelineModel } from 'model/actions/rest/pipelines.actions';
import { FormattedMessage } from 'react-intl';

import './table.style.scss';

const remote = (obj) => {
  const remoteObj = Object.assign({}, obj);
  remoteObj.pagination = true;
  remoteObj.sort = false;
  return remoteObj;
};

class Table extends Component {
  /**
    *  Helper function for formating className for table rows
    * @param row
    * @param rowIndex
    * @param custom
    * @returns {string}
  */
  static trClassFormat(row, rowIndex, custom) {
    return rowIndex % 2 === 0 ? `tr-odd ${custom}` : `tr-even ${custom}`;
  }

  /**
   * Returns true if property 'is_central_entity' is found in
   * current element and it's value is true
   * @param {array} args
   * @return {boolean}
  */
  static isCentralEntity(args) {
    return Object.keys(args[0]).includes('is_central_entity') && args[0].is_central_entity === true;
  }

  /**
   * Helper function for creating the caret depending the direction of sort
   * @param direction
   * @returns {string}
   * @todo: find a way to fix the eslint issue and remove the disable
   */
  /* eslint-disable react/sort-comp */
  static getCaret(direction) {
    switch (direction) {
      case 'asc':
        return (<span className="icon-sort-asc" />);
      case 'desc':
        return (<span className="icon-sort-desc" />);
      default:
        return (<span className="icon-sort" />);
    }
  }

  constructor(props) {
    super(props);

    this.rowIsSelected = this.rowIsSelected.bind(this);
    this.rowIsActiveCluster = this.rowIsActiveCluster.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
  }

  onSortChange(sortName, sortOrder) {
    const { fetchPipelineParams } = this.props;
    if (Object.keys(fetchPipelineParams).length > 0) {
      fetchPipelineParams.params.sort_col = sortName;
      fetchPipelineParams.params.sort_dir = sortOrder;
      this.props.fetchPipelineModel(fetchPipelineParams.timestamp, fetchPipelineParams.params);
    }
  }


  /**
 * Returns true if property 'selectedEntity' is found in props object
 * and it is equal with current item's name
 * @param {array} args
 * @return {boolean}
 */
  rowIsSelected(args) {
    return Object.keys(this.props.options).includes('selectedEntity')
      && this.props.options.selectedEntity === args[0].entity_name;
  }

  /**
   * Returs true if the current item is the current active cluster
   * @param args
   * @returns {boolean}
   */
  rowIsActiveCluster(args) {
    return args[0] !== undefined && this.props.activeCluster !== undefined
      && args[0].cluster_id === this.props.activeCluster;
  }

  render() {
    const {
      data,
      options,
      customTrClassName,
      columns,
      sortableColumns,
      className,
      expandableRow,
      expandComponent,
      expandColumnOptions,
      pagination,
      customHeaderClassName,
      fetchInfo,
      enableRemote,
    } = this.props;
    return (
      <BootstrapTable
        data={data}
        remote={enableRemote ? remote : false}
        options={{
          ...options, onSortChange: this.onSortChange,
        }}
        trClassName={(...args) => {
          let formatedClassName = `${customTrClassName} `;

          if (this.rowIsActiveCluster(args)) {
            formatedClassName += 'tr-activeCluster';
          }
          if (this.rowIsSelected(args) && this.constructor.isCentralEntity(args)) {
            formatedClassName += 'tr-central tr-highlighted';
          }
          if (this.rowIsSelected(args)) {
            formatedClassName += 'tr-highlighted';
          }
          if (this.constructor.isCentralEntity(args)) {
            formatedClassName += 'tr-central';
          }
          return this.constructor.trClassFormat(...args, formatedClassName);
        }}
        headerContainerClass={`${className}__headerContainer ${customHeaderClassName}`}
        expandableRow={expandableRow}
        expandComponent={expandComponent}
        expandColumnOptions={expandColumnOptions}
        pagination={pagination}
        fetchInfo={fetchInfo}
      >
        {
          columns.map((el) => {
            const caretRender = el.field === 'top_features' ? null : this.constructor.getCaret;
                return (
                  <TableHeaderColumn
                    dataSort={el.field === 'top_features' || el.field === 'action' ? false : sortableColumns}
                    caretRender={sortableColumns && el.field !== 'action' ? caretRender : null}
                    columnClassName={el.className}
                    dataFormat={el.dataFormat}
                    dataField={el.field}
                    hidden={el.hidden}
                    key={el.field}
                    isKey={el.isKey}
                    thStyle={el.thStyle}
                    columnTitle={el.columnTitle ? el.columnTitle : false}
                    width={el.width ? el.width : undefined}
                  >{(el.intl && el.intl !== '') ? (
                    <FormattedMessage id={el.intl} />
                      ) : (
                        el.label
                      )}
                  </TableHeaderColumn>
                );
          })
        }
      </BootstrapTable>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
Table.propTypes = {
  'className': PropTypes.string.isRequired,
  'columns': PropTypes.array.isRequired,
  'customTrClassName': PropTypes.string,
  'customHeaderClassName': PropTypes.string,
  'data': PropTypes.array.isRequired,
  'options': PropTypes.object.isRequired,
  'pagination': PropTypes.bool,
  'expandableRow': PropTypes.func.isRequired,
  'expandColumnOptions': PropTypes.object,
  'expandComponent': PropTypes.func.isRequired,
  'sortableColumns': PropTypes.bool,
  'activeCluster': PropTypes.string,
  'fetchPipelineParams': PropTypes.object,
  'fetchPipelineModel': PropTypes.func.isRequired,
  'fetchInfo': PropTypes.object,
  'enableRemote': PropTypes.bool,
};
/* eslint-enable */
Table.defaultProps = {
  'customTrClassName': '',
  'customHeaderClassName': '',
  'expandColumnOptions': {},
  'pagination': false,
  'sortableColumns': true,
  'activeCluster': '',
  'fetchPipelineParams': {},
  'fetchInfo': {},
  'enableRemote': false,
};

const mapDispatchToProps = dispatch => ({
  'fetchPipelineModel': (...args) => dispatch(fetchPipelineModel(...args)),
});

export default connect(null, mapDispatchToProps)(Table);
