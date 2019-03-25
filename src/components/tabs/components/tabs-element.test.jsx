import React from 'react';
import TabElement from './tabs-element.component';

describe('<TabElement />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      active: true,
      className: 'tabCountElement__test',
      title: 'Test Tab',
      id: 'test',
      onClick: jest.fn(),
    };
    wrapper = shallow(<TabElement {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

