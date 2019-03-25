import React from 'react';
import DropdownItem from './dropdown-item.component';

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

describe('<DropdownItem />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
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
    wrapper = shallow(<DropdownItem {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

