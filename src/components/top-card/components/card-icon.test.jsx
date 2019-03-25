import React from 'react';
import CardIcon from './card-icon.component';

describe('<CardIcon />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      className: 'testClass',
      type: 'details',
    };
    wrapper = shallow(<CardIcon {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

