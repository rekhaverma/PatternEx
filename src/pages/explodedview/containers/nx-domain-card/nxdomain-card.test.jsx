import React from 'react';

import { NXDomainsCard } from './nxdomain-card.container';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<NXDomainsCard />', () => {
  describe('render: ', () => {
    it('should match with snapshot', () => {
      const props = {
        isNxDomainsDataLoaded: true,
        nxDomainsData: [],
      };
      const wrapper = shallow(<NXDomainsCard {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
