import React from 'react';
import { ClustersToolbar } from './clusters-toolbar.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<ClustersToolbar />', () => {
  it('should match with snapshot', () => {
    const props = {
      list: [],
      options: [],
      sortClusterBy: 'sort',
      onClusterClick: jest.fn(),
      updateClusterSortBy: jest.fn(),
      activeCluster: 'first',
      router: {},
      link: '',
      saveDasboardLink: jest.fn(),
    };
    const wrapper = shallow(<ClustersToolbar {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
