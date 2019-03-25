import React from 'react';
import ProfileGroup from './profile-group.component';

describe('<ProfileGroup />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      items: [{
        id: 'test',
        label: 'TestLabel',
      }],
      privileges: {},
      type: 'test',
      onClick: jest.fn(),
    };
    wrapper = shallow(<ProfileGroup {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

