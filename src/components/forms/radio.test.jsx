import React from 'react';
import { RadioButton } from './index';

describe('<RadioButton />', () => {
  const props = {
    'id': '',
    'onChange': () => null,
    'label': '',
    'name': '',
    'checked': false,
    'value': '',
    'className': '',
  };

  it('renders correctly', () => {
    const wrapper = shallow(<RadioButton {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
