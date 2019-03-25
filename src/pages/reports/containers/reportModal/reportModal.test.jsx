import React from 'react';
import ReportModal from './reportModal.jsx';

describe('<ReportModal /> page: ', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      'onClose': jest.fn(),
      'pipelines': [],
      'saveDetail': jest.fn(),
      'data': {
        'rules': '',
      },
      'updateReportFields': jest.fn(),
      'rules': [],
      'allowedFields': {
        'name': true,
        'mode': true,
        'pipelines': true,
        'rules': true,
      },
      'title': '',
      'formErrors': {},
      'formValid': false,
      'onAddnewRule': jest.fn(),
    };
    wrapper = shallow(<ReportModal {...props} />);
  });

  describe('render: ', () => {
    it('should match with snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('action simulation: ', () => {
    it('should call "saveDetail" function on click of save', () => {
      wrapper.find('.button--success').simulate('click');
      expect(props.saveDetail.mock.calls.length).toBe(1);
    });

    it('should call "onClose" function on click of cancel and close sign', () => {
      wrapper.find('.button--dark').simulate('click');
      wrapper.find('.icon-close').simulate('click');
      expect(props.onClose.mock.calls.length).toBe(2);
    });
  });
});
