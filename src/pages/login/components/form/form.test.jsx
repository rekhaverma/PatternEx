import React from 'react';
import Form from './form.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Form />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      onSubmitForm: jest.fn(),
    };
    wrapper = shallow(<Form {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger setOption when method addLabel is called', () => {
    wrapper.instance().onChangeInputHandler('username','username');
    wrapper.instance().onChangeInputHandler('password','password');
    wrapper.instance().onSubmitFormHandler({
      preventDefault: () => {
      },
    });

    expect(props.onSubmitForm.mock.calls.length).toBe(1);
  });

});
