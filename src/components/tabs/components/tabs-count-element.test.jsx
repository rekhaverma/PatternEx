import React from 'react';
import TabCountElement from './tabs-count-element.component';

describe('<TabCountElement />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      active: true,
      className: 'tabCountElement__test',
      count: '102',
      title: 'Test Tab',
      id: 'test',
      onClick: jest.fn(),
    };
    wrapper = shallow(<TabCountElement {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

