import React from 'react';
import MenuItem from './menu-item.component';

describe('<MenuItem />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      active: false,
      id: 'test',
      className: 'sidebarMenu__test',
      disabled: false,
      hasSubmenu: false,
      icon: 'test-icon',
      title: 'Test',
      onClick: jest.fn(),
    };
    wrapper = shallow(<MenuItem {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

