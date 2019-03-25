import React from 'react';
import ViewDetail from './viewDetail.jsx';

describe('<DeleteReport /> modal: ', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      'onClose': jest.fn(),
      'data': {},
      'rules': [],
    };
    wrapper = shallow(<ViewDetail {...props} />);
  });

  describe('render: ', () => {
    it('should match with snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('action simulation: ', () => {
    it('should call "onClose" function on click of icon-close', () => {
      wrapper.find('.icon-close').simulate('click');
      expect(props.onClose.mock.calls.length).toBe(1);
    });
  });
});
