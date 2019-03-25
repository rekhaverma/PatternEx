import React from 'react';
import { ConfirmationModal } from './confirmation-modal.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<ConfirmationModal />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      message: 'message',
      onConfirmation: jest.fn(),
      onDecline: jest.fn(),
      modalWidth: '100px',
    };
    wrapper = shallow(<ConfirmationModal {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onConfirmation when `yes` button is clicked', () => {
    wrapper.find('.button').simulate('click');
    expect(props.onConfirmation.mock.calls.length).toBe(1);
  });

  it('should call onDecline when `no` button is clicked', () => {
    wrapper.find('.button--success').simulate('click');
    expect(props.onDecline.mock.calls.length).toBe(1);
  });
});
