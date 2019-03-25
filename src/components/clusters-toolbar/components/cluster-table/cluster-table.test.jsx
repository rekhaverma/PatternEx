import React from 'react';
import ClusterTable from './cluster-table.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<ClusterTable />', () => {
  it('should match with snapshot', () => {
    const props = {
      clientHeight: 100,
      data: [
        {
          central_entity: 'central_entity',
          counts: 10,
          ts: 1531140517,
        }],
      options: {},
      onClick: jest.fn(),
    };
    const wrapper = shallow(<ClusterTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
