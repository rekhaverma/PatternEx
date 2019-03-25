import React from 'react';
import DeleteReport from './deleteReport.jsx';

describe('<DeleteReport /> modal: ', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      'onClose': jest.fn(),
      'deleteReport': jest.fn(),
      'data': {},
    };
    wrapper = shallow(<DeleteReport {...props} />);
  });

  describe('render: ', () => {
    it('should match with snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('action simulation: ', () => {
    it('should call "deleteReport" function on click of delete', () => {
      wrapper.find('.button--success').simulate('click');
      expect(props.deleteReport.mock.calls.length).toBe(1);
    });

    it('should call "onClose" function on click of cancel and close sign', () => {
      wrapper.find('.button--dark').simulate('click');
      wrapper.find('.icon-close').simulate('click');
      expect(props.onClose.mock.calls.length).toBe(2);
    });
  });
});
