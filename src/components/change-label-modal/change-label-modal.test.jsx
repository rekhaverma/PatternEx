import React from 'react';
import ChangeModal from './change-label-modal.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<ChangeModal />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      className: 'test-class',
      tags: ['tag'],
      selectedLabel: 'selected-label',
      weight: 'weight',
      description: 'description',
      onItemClick: jest.fn(),
      onSave: jest.fn(),
      onCancel: jest.fn(),
      onWeightChange: jest.fn(),
      onDescriptionChange: jest.fn(),
    };
    wrapper = shallow(<ChangeModal {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onCancel when element is clicked', () => {
    wrapper.find('.icon-close').simulate('click');
    expect(props.onCancel.mock.calls.length).toBe(1);
  });

  it('should call onSave when button is clicked', () => {
    wrapper.find('.button--success').simulate('click');
    expect(props.onSave.mock.calls.length).toBe(1);
  });

  it('should call onCancel when button is clicked', () => {
    wrapper.find('.button').simulate('click');
    expect(props.onCancel.mock.calls.length).toBe(1);
  });

  it('should call onDescriptionChange when textarea is changed', () => {
    wrapper.find('.textarea').simulate('change');
    expect(props.onDescriptionChange.mock.calls.length).toBe(1);
  });
});
