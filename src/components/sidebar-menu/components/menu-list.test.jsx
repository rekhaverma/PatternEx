import React from 'react';
import MenuList from './menu-list.component';

describe('<MenuList />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      privileges: {},
      active: 'test',
      openItem: 'test',
      list: [],
      onClick: jest.fn(),
      onOpen: jest.fn(),
    };
    wrapper = shallow(<MenuList {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

