import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Column } from 'fixed-data-table-2';
import { isEqual } from 'lodash';

import Tooltip from 'components/tooltip';
import { FormattedMessage } from 'react-intl';

import './table.style.scss';

import TextCell from './components/text-cell';
import SortHeaderCell from './components/sort-header-cell';
import Pagination from './components/pagination';
import NoDataColumn from './components/no-data-column';


/* eslint-disable react/prop-types */

class ConfigurableTable extends Component {
  constructor(props) {
    super(props);

    this.wrapper = null;

    this.onColumnResize = this.onColumnResize.bind(this);
    this.onMouseUpHandler = this.onMouseUpHandler.bind(this);
    this.onPageSizeHandler = this.onPageSizeHandler.bind(this);
    this.onPageSelectHandler = this.onPageSelectHandler.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.renderColumns = this.renderColumns.bind(this);
    this.setInitialColumnWidths = this.setInitialColumnWidths.bind(this);
    this.setInitialSortDirection = this.setInitialSortDirection.bind(this);
    this.sliceData = this.sliceData.bind(this);
    this.updateTableSizes = this.updateTableSizes.bind(this);

    this.state = {
      tableWidth: 0,
      pageSize: '5',
      selectedPage: 0,
      dataToRender: [],
      sort: [],
      columnsDimension: {},
      tablePadding: 20,
    };
  }

  componentWillMount() {
    if (Number(this.props.pageSize)) {
      this.setState({
        pageSize: this.props.pageSize,
      });
    }
  }

  componentDidMount() {
    this.updateTableSizes();

    window.addEventListener('resize', this.updateTableSizes);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.state.data, nextProps.data)) {
      this.setState({
        tableWidth: this.wrapper.offsetWidth - (this.state.tablePadding * 2),
        columnsDimension: this.setInitialColumnWidths(this.wrapper.offsetWidth -
          (this.state.tablePadding * 3), nextProps),
        sort: this.setInitialSortDirection(),
      }, () => {
        this.sliceData(nextProps.data);
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateTableSizes);
  }

  /*
   * Function that handle the column resize
   * and update the state with the new width
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

  /*
   * Function that handle the behavior of click row functionality
   * Based on rowIndex, the data for the row is isolated and passed at onRowClick callback
   *
   * @param {Number} rowIndex - clicked row index
   */

  onMouseUpHandler(rowIndex) {
    this.props.onRowClick(this.props.data[rowIndex], rowIndex);
  }

  /*
   * Function that handle the page size(number of rows displayed) behavior
   *
   * @param {String} value - number of visible rows
   */

  onPageSizeHandler(value) {
    /* Based on the value, a new selected page value is calculated
     *
     * Eg. if the current page of table is 10 and number of displayed rows is 10,
     * when the number of displayed rows became 20 we must set the current table page to 5
     */
    const newSelectedPage = (Number(this.state.pageSize) * this.state.selectedPage) / Number(value);
    this.setState({
      'pageSize': value,
      'selectedPage': Math.floor(newSelectedPage),
    }, () => {
      this.sliceData();
    });
  }

  /*
   * Function that handle the page change behavior
   * Based on value, the selectedPage and data from the table are updated
   *
   * @param {String} value - selected page number
   */

  onPageSelectHandler(value) {
    this.setState({
      'selectedPage': value.selected,
    }, () => {
      this.sliceData();
    });
  }

  /*
   * Function that handle the page change behavior
   * Based on column and sort direction, the data is sorted and
   * passed as parameter at sliceData function
   *
   * @param {String} columnKey - key of the column that was resized
   * @param {String} sortDir - desired sort direction
   */

  onSortChange(columnKey, sortDir) {
    const sortedData = this.props.data.sort((a, b) => {
      let sortValue = 0;

      if (a[columnKey] > b[columnKey]) {
        sortValue = 1;
      }
      if (a[columnKey] < b[columnKey]) {
        sortValue = -1;
      }
      if (sortValue !== 0 && sortDir === 'ASC') {
        sortValue *= -1;
      }

      return sortValue;
    });

    this.setState({
      sort: {
        [columnKey]: sortDir,
      },
    }, () => {
      this.sliceData(sortedData);
    });
  }

  /*
   * Function that reset the sort values for every column
   *
   * @return {Object} - sort value for every column
   * Eg.
   *  {
   *    'source_ip': '',
   *    'dest_ip': '',
   *  }
   */

  setInitialSortDirection() {
    return this.props.tableConfig
      .reduce((acc, el) => ({
        ...acc,
        [el.field]: '',
      }), {});
  }

  /*
   * Function that calculate the initial dimension for every column
   * Table width is divided by the number of visible columns
   * and the value is assigned to every column.
   * That means that initialy, all columns will have the same dimension
   *
   * @param {Number} tableWidth - the width of the table
   * @return {Object} - sort value for every column
   * Eg.
   *  {
   *    'source_ip': 230,
   *    'dest_ip': 230,
   *  }
   */

  setInitialColumnWidths(tableWidth, props = {}) {
    const usedProps = Object.keys(props).length > 0 ? props : this.props;

    let visibleColumns = usedProps.tableConfig.filter(el => !el.hidden).length;
    /**
     * Set width for column with fixed width
     */
    let newTableWidth = tableWidth;
    const tableConfig = usedProps.tableConfig.filter(value => Object.keys(value).includes('width'))
      .reduce((acc, value) => {
        newTableWidth -= value.width;
        visibleColumns -= 1;
        return {
          ...acc,
          [value.field]: value.width,
        };
      }, {});
    const columnWidth = +(newTableWidth / visibleColumns).toFixed();
    return usedProps.tableConfig.filter(value => !Object.keys(value).includes('width'))
      .reduce((acc, value) => ({
        ...acc,
        [value.field]: columnWidth,
      }), tableConfig);
  }

  /**
   * Function that handle the table resize
   * and update the state with the new table sizes
   */
  updateTableSizes() {
    if (this.wrapper) {
      this.setState({
        tableWidth: this.wrapper.offsetWidth - (this.state.tablePadding * 2),
        columnsDimension: this.setInitialColumnWidths(this.wrapper.offsetWidth -
          (this.state.tablePadding * 3)),
        sort: this.setInitialSortDirection(),
      }, () => {
        this.sliceData();
      });
    }
  }

  /*
   * Function read from the state the values of selected page and page size
   * and decide which slice of data needs to be rendered in the table
   *
   * @param {Array} data - data that needs to be processed
   */

  sliceData(data = this.props.data) {
    const startSlice = this.state.selectedPage * Number(this.state.pageSize);
    const endSlice = startSlice + Number(this.state.pageSize);

    if (data.length < this.state.pageSize) {
      this.setState({
        'dataToRender': data,
      });
    } else if (data.length / Number(this.state.pageSize) < this.state.selectedPage) {
      this.setState({
        'selectedPage': 0,
      });
    } else {
      this.setState({
        'dataToRender': data.slice(startSlice, endSlice),
      });
    }
  }

  /*
   * Function that generate the table columns based on a config JSON
   *
   * @param {Array} columns - columns config
   */

  renderColumns(columns) {
    const getCell = (rowIndex, columnKey, columnsArray) => {
      const isCellHighlighted = this.props.rowHighlightIndex === rowIndex;
      let rowStyle = {
        width: '100%',
        height: '100%',
      };

      if (isCellHighlighted) {
        rowStyle = {
          ...rowStyle,
          borderTop: '1px solid white',
          borderBottom: '1px solid white',
        };
      }

      if (isCellHighlighted && columnKey === columnsArray[0].field) {
        rowStyle = {
          ...rowStyle,
          borderLeft: '1px solid white',
        };
      }

      if (isCellHighlighted && columnKey === columnsArray[columnsArray.length - 1].field) {
        rowStyle = {
          ...rowStyle,
          borderRight: '1px solid white',
        };
      }

      /*
      * Show tooltip if property is set on column
      */
      const columnConfig = columnsArray.filter(col => col.field === columnKey);

      if (Object.keys(columnConfig[0]).includes('tooltip') && columnKey !== 'entity_name') {
        return (
          <Tooltip
            trigger={(
              <TextCell
                style={rowStyle}
                data={this.state.dataToRender}
                rowIndex={rowIndex}
                columnKey={columnKey}
              />
            )}
            position="bottom"
          >
            <FormattedMessage id={`tooltip.${columnConfig[0].tooltip}`} />
          </Tooltip>
        );
      }

      return (
        <TextCell
          style={rowStyle}
          data={this.state.dataToRender}
          rowIndex={rowIndex}
          columnKey={columnKey}
        />
      );
    };
    /*eslint-disable*/
    return columns
      .filter(column => column.hidden === false)
      .map((column, index, originalArr) => (
        <Column
          key={column.field}
          columnKey={column.field}
          header={
            (Object.keys(column).includes('sort') && column.sort === false) ? (
              (column.intl && column.intl !== '') ? (
                <FormattedMessage id={column.intl} />
              ) : (
                column.label
              )
            ) : (
              <SortHeaderCell
                onSortChange={this.onSortChange}
                sortDirection={this.state.sort[column.field] ? this.state.sort[column.field] : ''}
              >
                {
                  (column.intl && column.intl !== '') ? (
                    <FormattedMessage id={column.intl} />
                  ) : (
                    column.label
                  )
                }
              </SortHeaderCell>
              )
          }
          cell={cell => getCell(cell.rowIndex, cell.columnKey, originalArr)}
          width={this.state.columnsDimension[column.field] || 0}
          isResizable={column.resizable}
          cellClassName=""
        />
      ));
      /* eslint-enable */
    // to add custom class name for table cells
  }

  render() {
    const { data, tableConfig, classname, rowHeight } = this.props;
    const { dataToRender, tableWidth, selectedPage } = this.state;
    let tableHeight = (rowHeight * (+this.state.pageSize)) + 80;

    if (data.length < Number(this.state.pageSize)) {
      tableHeight = (rowHeight * data.length) + 80;
    }

    return (
      <div className="table-area">
        <div
          className={classname === undefined ? 'table-wrapper' : `table-wrapper +${classname}`}
          ref={(el) => { this.wrapper = el; }}
        >
          <Table
            rowsCount={dataToRender.length}
            rowHeight={rowHeight}
            headerHeight={50}
            width={tableWidth}
            height={tableHeight}
            onColumnResizeEndCallback={this.onColumnResize}
            isColumnResizing={false}
            onRowMouseDown={(event, rowIndex) => { this.onMouseUpHandler(rowIndex); }}
          >
            {
              data.length === 0 ?
                NoDataColumn({ 'width': tableWidth })
                :
                this.renderColumns(tableConfig)
            }
          </Table>
        </div>
        {data.length > 5 &&
          <Pagination
            currentPage={selectedPage}
            dataSize={data.length}
            pageSize={this.state.pageSize}
            onPageSizeChange={this.onPageSizeHandler}
            onPageSelectHandler={this.onPageSelectHandler}
          />
        }
      </div>
    );
  }
}

ConfigurableTable.displayName = 'ConfigurableTable';

ConfigurableTable.propTypes = {
  'tableConfig': PropTypes.array,
  'data': PropTypes.array,
  'onRowClick': PropTypes.func,
  'classname': PropTypes.string,
  'rowHeight': PropTypes.number,
};

ConfigurableTable.defaultProps = {
  'tableConfig': [],
  'data': [],
  'onRowClick': () => { },
  'classname': '',
  'rowHeight': 30,
  'maxPageSize': '100',
};

export default ConfigurableTable;
