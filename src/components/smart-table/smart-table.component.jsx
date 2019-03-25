import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Cell, Column, Table } from 'fixed-data-table-2';
import { isEqual } from 'lodash';

import { filterByMultipleTags } from 'lib';

import { NoDataColumn } from './components/no-data-column/no-data-column.component';
import { TextCell } from './components/text-cell/text-cell.component';
import { Pagination } from './components/pagination/pagination.component';
import { SortHeaderCell } from './components/sort-header-cell/sort-header-cell.component';
import { CollapseCell } from './components/collapse-cell/collapse-cell.component';
import { Filter } from './components/filter/filter.component';
import { sortTypes } from './constants';
import { getTableConfigFromLocalHost, saveTableConfigOnLocalHost } from './utils';

import './smart-table.style.scss';

class SmartTableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = null;

    this.state = {
      tableWidth: 0,
      tableConfig: [],
      pageSize: '5',
      selectedPage: 0,
      sort: {
        key: '',
        direction: '',
      },
      columnsDimension: {},
      collapsedRows: new Set(),
      searchTags: [],
    };
    this.updateTableSizes = this.updateTableSizes.bind(this);
    this.onColumnResize = this.onColumnResize.bind(this);
    this.onPageSizeHandler = this.onPageSizeHandler.bind(this);
    this.onPageSelectHandler = this.onPageSelectHandler.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.handleCollapseClick = this.handleCollapseClick.bind(this);
    this.subRowHeightGetter = this.subRowHeightGetter.bind(this);
    this.rowExpandedGetter = this.rowExpandedGetter.bind(this);
    this.getExpandedRowClass = this.getExpandedRowClass.bind(this);
    this.onSearchTagsChange = this.onSearchTagsChange.bind(this);
    this.onTableConfigUpdate = this.onTableConfigUpdate.bind(this);
  }

  componentWillMount() {
    if (Number(this.props.pageSize)) {
      this.setState({
        pageSize: this.props.pageSize,
      });
    }
    const tableConfig = getTableConfigFromLocalHost(this.props.tableId, this.props.tableConfig);
    this.setState({ tableConfig });
  }

  componentDidMount() {
    this.updateTableSizes();

    window.addEventListener('resize', this.updateTableSizes);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.wrapper) {
      return;
    }
    if (!isEqual(this.props.data, nextProps.data)) {
      this.updateTableSizes();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateTableSizes);
  }

  /**
   * @todo: add function description
   * @param searchTags
   */
  onSearchTagsChange(searchTags) {
    this.setState({ searchTags });
  }

  /**
   * Function that handle the column resize
   * and update the state with the new width
   * Based on the value, a new selected page value is calculated
   *
   * Eg. if the current page of table is 10 and number of displayed rows is 10,
   * when the number of displayed rows became 20 we must set the current table page to 5
   *
   * @param {Number} newWidth - new width of the column
   * @param {String} columnKey - key of the column that was resized
   */

  onColumnResize(newWidth, columnKey) {
    this.setState({
      columnsDimension: {
        ...this.state.columnsDimension,
        [columnKey]: newWidth < 30 ? 30 : newWidth,
      },
    });
  }

  /**
   * Function that handle the page size(number of rows displayed) behavior
   *
   * @param {String} pageSize - number of visible rows
   */
  onPageSizeHandler(pageSize) {
    const { data } = this.props;
    let selectedPage = (Number(this.state.pageSize) * this.state.selectedPage) / Number(pageSize);
    if (data.length / Number(this.state.pageSize) < this.state.selectedPage) {
      selectedPage = 0;
    }
    selectedPage = Math.floor(selectedPage);
    this.setState({
      pageSize,
      selectedPage,
    });
  }

  /**
   * Function that handle the page change behavior
   * Based on value, the selectedPage and data from the table are updated
   *
   * @param {String} selectedPage - selected page number
   */
  onPageSelectHandler(selectedPage) {
    this.setState({
      selectedPage: selectedPage.selected,
      collapsedRows: new Set(),
    });
  }

  /**
   * Function that handle the page change behavior
   * Based on column and sort direction, the data is sorted and
   * passed as parameter at sliceData function
   *
   * @param {String} key - key of the column that was resized
   * @param {String} direction - desired sort direction
   */
  onSortChange(key, direction) {
    const sort = { key, direction };
    this.setState({
      sort,
      collapsedRows: new Set(),
    });
  }

  onTableConfigUpdate(field) {
    const tableConfig = this.state.tableConfig.map((item) => {
      if (item.field !== field) {
        return item;
      }

      return {
        ...item,
        hidden: !item.hidden,
      };
    });

    saveTableConfigOnLocalHost(this.props.tableId, tableConfig);

    this.setState({ tableConfig }, this.updateTableSizes);
  }

  /**
   * Function that calculate the initial dimension for every column
   * Table width is divided by the number of visible columns
   * and the value is assigned to every column.
   * That means that initially, all columns will have the same dimension
   *
   * @param tableWidth
   * @returns {{}}
   */
  setInitialColumnWidths(tableWidth) {
    const visibleTableConfig = this.state.tableConfig.filter(el => !el.hidden);
    let visibleColumns = visibleTableConfig.length;
    /**
     * Set width for column with fixed width
     */
    let newTableWidth = tableWidth - (this.props.acceptExpand ? 30 : 0);
    const tableConfig = visibleTableConfig.filter(value => Object.keys(value).includes('width'))
      .reduce((acc, value) => {
        newTableWidth -= value.width;
        visibleColumns -= 1;
        return {
          ...acc,
          [value.field]: value.width,
        };
      }, {});
    let columnWidth = +(newTableWidth / visibleColumns).toFixed();
    if (columnWidth < 140) {
      columnWidth = 140;
    }
    return visibleTableConfig.filter(value => !Object.keys(value).includes('width'))
      .reduce((acc, value) => ({
        ...acc,
        [value.field]: columnWidth,
      }), tableConfig);
  }

  /**
   *
   * Function that return the sorted and sliced data
   * @returns {*}
   */
  getViewData() {
    const data = [...this.props.data];
    const { sort, pageSize, selectedPage, searchTags } = this.state;
    const viewData = filterByMultipleTags(data, searchTags).sort((a, b) => {
      let sortValue = 0;

      if (a[sort.key] > b[sort.key]) {
        sortValue = 1;
      }
      if (a[sort.key] < b[sort.key]) {
        sortValue = -1;
      }
      if (sortValue !== 0 && sort.direction === sortTypes.ASC) {
        sortValue *= -1;
      }

      return sortValue;
    });
    const startSlice = selectedPage * Number(pageSize);
    const endSlice = startSlice + Number(pageSize);

    if (viewData.length < this.state.pageSize) {
      return viewData;
    }

    return viewData.slice(startSlice, endSlice);
  }

  getExpandedRowClass(rowIndex) {
    const { className } = this.props;
    const { collapsedRows } = this.state;
    return collapsedRows.has(rowIndex) ? `${className}__row--expanded` : `${className}__row`;
  }

  /**
   * @todo: add description of this method
   * @param rowIndex
   */
  handleCollapseClick(rowIndex) {
    const { collapsedRows } = this.state;
    const shallowCopyOfCollapsedRows = new Set([...collapsedRows]);
    if (shallowCopyOfCollapsedRows.has(rowIndex)) {
      shallowCopyOfCollapsedRows.delete(rowIndex);
    } else {
      shallowCopyOfCollapsedRows.add(rowIndex);
    }
    this.setState({
      collapsedRows: shallowCopyOfCollapsedRows,
    });
  }

  /**
   * @todo: add description of this method
   * @param index
   * @returns {number}
   */
  subRowHeightGetter(index) {
    return this.state.collapsedRows.has(index) ? this.props.expandedHeight : 0;
  }

  /**
   * @todo: add description of this method
   * @param rowIndex
   * @param width
   * @param height
   * @returns {*}
   */
  rowExpandedGetter({ rowIndex, width, height }) {
    if (!this.state.collapsedRows.has(rowIndex)) {
      return null;
    }

    const { className, data } = this.props;

    const style = {
      height,
      width: width - 2,
    };
    if (!data[rowIndex] || !data[rowIndex].expandedData) {
      return (
        <div style={style}>
          <div className={`${className}__expanded-row +no-data`}>
            <FormattedMessage id="global.nodata" />
          </div>
        </div>
      );
    }

    return (
      <div style={style}>
        <div className={`${className}__expanded-row`}>
          {data[rowIndex].expandedData}
        </div>
      </div>
    );
  }

  /**
   * Function that handle the table resize
   * and update the state with the new table sizes
   */
  updateTableSizes() {
    if (this.wrapper) {
      const tableWidth = this.wrapper.offsetWidth;
      const columnsDimension = this.setInitialColumnWidths(tableWidth - 10);
      this.setState({
        columnsDimension,
        tableWidth,
      });
    }
  }

  renderColumns(viewData) {
    const { tableConfig, sort, columnsDimension } = this.state;
    const { className } = this.props;
    const getColumnHeaderLabel = column => (
      column.intl ? (
        <FormattedMessage id={column.intl} />
      ) : (
        <span>{column.label}</span>
      )
    );

    const getSortDirection = field => (sort.key === field ? sort.direction : '');

    const getCell = (rowIndex, columnKey, column) => (
      <TextCell
        data={viewData}
        rowIndex={rowIndex}
        columnKey={columnKey}
        columnConfig={column}
      />
    );
    return tableConfig
      .filter(column => !column.hidden)
      .map(column => (
        <Column
          key={column.field}
          columnKey={column.field}
          header={
            column.sort ? (
              <SortHeaderCell
                className={className}
                onSortChange={this.onSortChange}
                sortDirection={getSortDirection(column.field)}
              >
                {getColumnHeaderLabel(column)}
              </SortHeaderCell>
            ) : (
              <Cell className={`${className}__header-cell`}>
                {getColumnHeaderLabel(column)}
              </Cell>
            )
          }
          cell={cell => getCell(cell.rowIndex, cell.columnKey, column)}
          width={columnsDimension[column.field] || 0}
          isResizable={column.resizable}
        />
      ));
  }

  render() {
    const {
      className,
      data,
      headerHeight,
      rowHeight,
      expandedHeight,
      acceptExpand,
      hasMultiTagSearch,
    } = this.props;

    const {
      tableWidth,
      pageSize,
      selectedPage,
      collapsedRows,
      searchTags,
      tableConfig,
    } = this.state;
    const maxPageSize = data.length > +pageSize ? +pageSize : data.length;

    const tableHeight = (rowHeight * maxPageSize) + (expandedHeight * collapsedRows.size) + 80;

    const viewData = this.getViewData();
    return (
      <div className={className} ref={el => this.wrapper = el}>
        <Filter
          updateTableConfig={this.onTableConfigUpdate}
          tableConfig={tableConfig}
          hasMultiTagSearch={hasMultiTagSearch}
          tags={searchTags}
          onMultiTagsSearchChange={this.onSearchTagsChange}
        />
        <Table
          rowHeight={rowHeight}
          headerHeight={headerHeight}
          rowsCount={viewData.length}
          rowClassNameGetter={this.getExpandedRowClass}
          subRowHeightGetter={this.subRowHeightGetter}
          rowExpanded={this.rowExpandedGetter}
          onColumnResizeEndCallback={this.onColumnResize}
          isColumnResizing={false}
          touchScrollEnabled
          width={tableWidth}
          height={tableHeight}
        >
          {
            acceptExpand && <Column
              cell={
                <CollapseCell
                  callback={this.handleCollapseClick}
                  collapsedRows={collapsedRows}
                />
              }
              fixed
              width={30}
            />
          }
          {
            data.length ?
              this.renderColumns(viewData) : NoDataColumn({ width: tableWidth, className })
          }
        </Table>

        {
          data.length > 0 && (
            <Pagination
              className={className}
              currentPage={selectedPage}
              dataSize={data.length}
              pageSize={pageSize}
              onPageSizeChange={this.onPageSizeHandler}
              onPageSelectHandler={this.onPageSelectHandler}
            />
          )
        }
      </div>
    );
  }
}

SmartTableComponent.propTypes = {
  tableId: PropTypes.string.isRequired,
  tableConfig: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  hasMultiTagSearch: PropTypes.bool,
  acceptExpand: PropTypes.bool,
  className: PropTypes.string,
  rowHeight: PropTypes.number,
  headerHeight: PropTypes.number,
  pageSize: PropTypes.string,
  expandedHeight: PropTypes.number,
};

SmartTableComponent.defaultProps = {
  hasMultiTagSearch: false,
  acceptExpand: false,
  className: 'smart-table',
  rowHeight: 30,
  headerHeight: 50,
  pageSize: '10',
  expandedHeight: 80,
};

export default SmartTableComponent;
