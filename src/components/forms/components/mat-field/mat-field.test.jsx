import React from 'react';
import MatField from './mat-field.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<MatField />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      label: '',
      name: '',
      errorMessage: '',
      type: 'text',
      prefix: 'login',
      hasError: false,
      value: '',
      onChange: jest.fn(),
      onErrorFound: jest.fn(),
    };
    wrapper = shallow(<MatField {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger setOption when method addLabel is called', () => {
    wrapper.instance().onChangeInputHandler({ target: { value: 'value' } });

    expect(props.onChange.mock.calls.length).toBe(1);
  });

});
