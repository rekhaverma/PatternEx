import React from 'react';

import { AutocorrelationClusters } from './autocorrelation-clusters.container';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<AutocorrelationClusters />', () => {
  describe('render: ', () => {
    it('should match with snapshot', () => {
      const props = {
        list: [],
        sortClusterBy: '',
        onClusterClick: jest.fn(),
        updateClusterSortBy: jest.fn(),
      };
      const wrapper = shallow(<AutocorrelationClusters {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
