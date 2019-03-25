import React from 'react';
import ServiceStatus from './service-status.component';

describe('<ServiceStatus />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      className: 'serviceStatus__test',
      states: [
        {
          name: 'Name1',
          state: 'State1',
          running: 'active',
        },
        {
          name: 'Name2',
          state: 'State2',
          running: 'active',
        },
      ],
    };
    wrapper = shallow(<ServiceStatus {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

