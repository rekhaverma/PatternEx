import React from 'react';
import MenuRendererCustomReport from './menuRendererCR';

/**
 * @status: WIP
 * @sign-off-by: Alex Andries
 * @todo: find a way to mount this component
 */
describe('<MenuRendererCustomReport />', () => {
  it.skip('should match with snapshot', () => {
    const props = {
      options: [],
      onFooterClick: jest.fn(),
    };
    const wrapper = shallow(<MenuRendererCustomReport {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
