import React from 'react';
import { OnDemand } from './onDemand.jsx';

Date.now = jest.fn(() => 1487076708000);
describe('<OnDemand /> modal: ', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      'onCancel': jest.fn(),
      'fetchResultSummary': jest.fn(),
      'enableDates': [],
      'enableRTDates': [],
      'pipeline': '',
      'mode': '',
      'onApply': jest.fn(),
    };
    wrapper = shallow(<OnDemand {...props} />);
  });

  describe('render: ', () => {
    it('should match with snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('action simulation: ', () => {
    it('should call "onApply" function on click of apply', () => {
      wrapper.find('.button--success').simulate('click');
      expect(props.onApply.mock.calls.length).toBe(1);
    });

    it('should call "onCancel" function on click of cancel and close sign', () => {
      wrapper.find('.button--dark').simulate('click');
      wrapper.find('.icon-close2').simulate('click');
      expect(props.onCancel.mock.calls.length).toBe(2);
    });
  });
});
