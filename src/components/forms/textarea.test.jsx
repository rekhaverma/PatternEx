import React from 'react';
import { Textarea } from './index';

describe('<Textarea />', () => {
  const props = {};

  it('renders correctly', () => {
    const wrapper = shallow(<Textarea {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
