import React from 'react';
import Item from './item.component';

const itemsList = [
  {
    icon: 'icon-test1',
    id: 'test1',
    label: 'Test1',
    location: '/test',
    params: ['start_time', 'end_time'],
    type: 'link',
  },
  {
    icon: 'icon-test2',
    id: 'test2',
    label: 'Test2',
    location: '/test',
    params: ['start_time', 'end_time'],
    type: 'link',
  },
];

describe('<Item />', () => {
  it('should render correctly as LinkItem', () => {
    const props = {
      type: 'link',
      className: 'sidebarMenu__test',
      icon: 'test-icon',
      label: 'Test Label',
      location: '/test',
      style: {},
      query: {},
      params: [],
    };
    const wrapper = shallow(<Item {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly as DropdownItem', () => {
    const props = {
      type: 'dropdown',
      active: true,
      activeDropdown: true,
      className: 'dropdownItem__test',
      disabled: false,
      id: 'testItem',
      icon: 'test-icon',
      items: itemsList,
      label: 'Test Label',
      onClick: jest.fn(),
      onDropdownClick: jest.fn(),
    };
    const wrapper = shallow(<Item {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly as RegularItem', () => {
    const props = {
      type: '',
      className: 'sidebarMenu__test',
      active: true,
      disabled: false,
      id: 'testItem',
      icon: 'test-icon',
      label: 'Test Label',
      style: {},
      query: {},
      params: [],
      onClick: jest.fn(),
    };
    const wrapper = shallow(<Item {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});

