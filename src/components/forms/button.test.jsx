import React from 'react';
import { Button } from './index';

describe('<Button />', () => {
  const props = {
    'children': {},
  };

  it('renders correctly', () => {
    const wrapper = shallow(<Button {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
