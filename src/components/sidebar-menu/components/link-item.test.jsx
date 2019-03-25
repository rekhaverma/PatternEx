import React from 'react';
import LinkItem from './link-item.component';

describe('<LinkItem />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      type: 'link',
      className: 'sidebarMenu__test',
      icon: 'test-icon',
      label: 'Test Label',
      location: '/test',
      style: {},
      query: {},
      params: [],
    };
    wrapper = shallow(<LinkItem {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

