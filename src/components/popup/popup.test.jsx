import React from 'react';
import Popup from './popup.component';
import { NOCSVDATA, SETLABELFAILED, SETLABELSUCCESS, LABELSPOPUP } from './constants';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Popup />', () => {
  let wrapper;
  let props;
  it('should match with snapshot with version 1', () => {
    props = {
      children: <div className="testing-popup" />,
      version: 1,
      context: SETLABELSUCCESS,
      onClose: jest.fn(),
    };
    wrapper = shallow(<Popup {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot with another version and context "NOCSVDATA"', () => {
    props = {
      children: <div className="testing-popup" />,
      version: 2,
      context: NOCSVDATA,
      onClose: jest.fn(),
    };
    wrapper = shallow(<Popup {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot with another version and context "SETLABELFAILED"', () => {
    props = {
      children: <div className="testing-popup" />,
      version: 2,
      context: SETLABELFAILED,
      onClose: jest.fn(),
    };
    wrapper = shallow(<Popup {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot with another version and context "SETLABELSUCCESS"', () => {
    props = {
      children: <div className="testing-popup" />,
      version: 2,
      context: SETLABELSUCCESS,
      onClose: jest.fn(),
    };
    wrapper = shallow(<Popup {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should match with snapshot with another version and context "LABELSPOPUP"', () => {
    props = {
      children: <div className="testing-popup" />,
      version: 2,
      context: LABELSPOPUP,
      onClose: jest.fn(),
    };
    wrapper = shallow(<Popup {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onClose when element is clicked', () => {
    props = {
      children: <div className="testing-popup" />,
      version: 1,
      context: SETLABELSUCCESS,
      onClose: jest.fn(),
    };
    wrapper = shallow(<Popup {...props} />);
    wrapper.find('.icon-close').simulate('click');
    expect(props.onClose.mock.calls.length).toBe(1);
  });
});
