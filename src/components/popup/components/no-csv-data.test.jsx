import React from 'react';
import { NoCSVData, mapDispatchToProps } from './nocsvdata.component';
import { SET_POPUP } from 'model/actions/ui.actions';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<NoCSVData />', () => {
  describe('renders: ', () => {
    let wrapper; let props;

    beforeEach(() => {
      props = {
        className: 'no-csv-data-popup',
        text: <div className="no-csv-data-popup__text">Text</div>,
        onClick: jest.fn(),
      };
      wrapper = shallow(<NoCSVData {...props} />);
    })

    it('should match with snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should call onClick when element is clicked', () => {
      wrapper.find('.button').simulate('click');
      expect(props.onClick.mock.calls.length).toBe(1);
    });
  });

  describe('mapDispatchToProps method', () => {
    it('should trigger the setPopup action', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).onClick('');

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: SET_POPUP,
        payload: '',
      });
    });
  });
}) 
