import React from 'react';
import { Input } from './index';

describe('<Input />', () => {
  const props = {
    'autoFocus': false,
    'disabled': false,
    'id': '',
    'name': '',
    'onClick': () => {},
    'onMouseEnter': () => {},
    'onMouseLeave': () => {},
    'onSubmit': () => {},
    'onChange': () => {},
    'onKeyPress': () => {},
    'placeholder': '',
    'style': {},
    'type': 'text',
    'value': '',
  };

  it('renders correctly', () => {
    const wrapper = shallow(<Input {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
