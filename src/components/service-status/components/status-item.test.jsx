import React from 'react';
import StatusItem from './status-item.component';

describe('<StatusItem />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      serviceState: 'active',
      className: 'statusItem__test',
      name: 'Status Item',
    };
    wrapper = shallow(<StatusItem {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

