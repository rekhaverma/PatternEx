import React from 'react';
import IconSelectBox from './icon-select-box.component';

/**
 * @status: Complete
 * @sign-off-by: Bogdan Iacoboae
 */
describe('<IconSelectBox />', () => {
  it('should match with snapshot', () => {
    const props = {
      activeOptions: ['test1', 'test2'],
      autocomplete: false,
      boxIsOpen: false,
      closeBox: jest.fn(),
      options: [{
        content: 'Test1',
        disabled: false,
        id: 'test1',
      }, {
        content: 'Test2',
        disabled: true,
        id: 'test2',
      }],
      updateOptionsHandler: jest.fn(),
      openBox: jest.fn(),
      intlid: 'intl.test',
      tooltipIntl: 'tooltip.test',
      icon: 'icon-test',
    };


    const tree = shallow(<IconSelectBox {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
