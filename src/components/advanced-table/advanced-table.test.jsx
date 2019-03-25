import React from 'react';
import AdvancedTable from './advanced-table.component';

/**
 * @status: Complete
 * @sign-off-by: Bogdan Iacoboae
 */
describe('<AdvancedTable />', () => {
  beforeEach(() => {
    global.localStorage = jest.fn();
    global.localStorage.setItem = jest.fn();
    global.localStorage.getItem = jest.fn();
  });
  it('should match with snapshot', () => {
    const props = {
      children: <div />,
      rowHeight: 300,
      maxPageSize: '5',
      rowHighlightIndex: 1,
      pageSize: '5',
      classname: 'test',
      tableConfig: [
        {
          className: 'table__headerColumn',
          field: 'hash',
          hidden: true,
          intl: 'malicious.table.hash',
          isKey: true,
          label: 'Hash',
          resizable: false,
        },
        {
          className: 'table__headerColumn',
          field: 'start_time_formatted',
          hidden: false,
          intl: 'malicious.table.start_time_formatted',
          isKey: false,
          label: 'Log Date',
          resizable: true,
          width: 100,
        }],
      data: [{
        hash: 'asd-test',
        start_time_formatted: 'start-time',
      }],
      onRowClick: jest.fn(),
      locationPage: '@tEST/LOCATION',
    };


    const tree = shallow(<AdvancedTable {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
