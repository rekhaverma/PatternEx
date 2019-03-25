import React from 'react';
import RegularItem from './regular-item.component';

describe('<RegularItem />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
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
    wrapper = shallow(<RegularItem {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

