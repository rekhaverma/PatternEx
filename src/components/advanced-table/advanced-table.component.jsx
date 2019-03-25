import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ActiveColumns from 'lib/active-columns';
import Table from 'components/table-v2';
import IconSelectBox from 'components/icon-select-box';

import './advanced-table.style.scss';

class AdvancedTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'options': [],
      'activeOptions': [],
    };

    this.showHideColumnsHandler = this.showHideColumnsHandler.bind(this);
  }

  componentWillMount() {
    const { tableConfig, locationPage } = this.props;
    const localStorageOptions = ActiveColumns.getActiveOptions(locationPage);

    let activeColumns = tableConfig.filter(el => (!el.hidden)).map(el => el.field);
    if (localStorageOptions) {
      activeColumns = localStorageOptions;
    }
    this.setState({
      'options': tableConfig.filter(el => el.field !== 'id').map(el => ({
        id: el.field,
        content: el.label,
        disabled: el.field === 'actions',
      })),
      'activeOptions': activeColumns,
    });
  }

  showHideColumnsHandler(e) {
    const { activeOptions } = this.state;
    const options = [...activeOptions];
    const currentId = e.target.getAttribute('data-id') !== null
      ? e.target.getAttribute('data-id')
      : e.target.parentNode.getAttribute('data-id');
    const index = options.indexOf(currentId);
    if (index > -1) {
      options.splice(index, 1);
    } else {
      options.push(currentId);
    }

    ActiveColumns.setActiveOptions(this.props.locationPage, options);

    this.setState({
      activeOptions: options,
    }, () => {
      this.forceUpdate();
    });
  }

  render() {
    const { activeOptions, options } = this.state;
    const { tableConfig, children } = this.props;
    let columns = tableConfig;

    if (Object.keys(tableConfig).length > 0) {
      columns = tableConfig.map((el) => {
        let hidden = true;
        if (activeOptions.includes(el.field)) {
          hidden = false;
        }
        return {
          ...el,
          hidden,
        };
      });
    }
    return (
      <div className="table-section">
        <div className="table-top-section">
          {children}
          <IconSelectBox
            options={options}
            activeOptions={activeOptions}
            updateOptionsHandler={this.showHideColumnsHandler}
          />
        </div>
        <Table {...this.props} tableConfig={columns} />
      </div>

    );
  }
}
export default AdvancedTable;

AdvancedTable.displayName = 'AdvancedTable';
AdvancedTable.propTypes = {
  'children': PropTypes.any,
  'rowHeight': PropTypes.number,
  'maxPageSize': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  'rowHighlightIndex': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  'pageSize': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  'classname': PropTypes.string,
  'tableConfig': PropTypes.array,
  'data': PropTypes.array,
  'onRowClick': PropTypes.func,
  'locationPage': PropTypes.string,
};

AdvancedTable.defaultProps = {
  'children': <div />,
  'rowHeight': 30,
  'maxPageSize': '5',
  'rowHighlightIndex': '',
  'pageSize': '5',
  'classname': '',
  'tableConfig': [],
  'onRowClick': () => {},
  'data': [],
  'locationPage': '',
};
