import React from 'react';
import FeatureSelectionModal from './featureSelection.jsx';

describe('<FeatureSelectionModal /> page', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      'onClose': jest.fn(),
      'filters': [],
      'pipeline': 'domain',
      'features': [],
      'onSelect': jest.fn(),
      'selected': [],
    };
    wrapper = shallow(<FeatureSelectionModal {...props} />);
  });

  describe('render: ', () => {
    it('should match with snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('should call onClose when button is clicked', () => {
    wrapper.find('.icon-close2').simulate('click');
    wrapper.find('.button--dark').simulate('click');
    expect(props.onClose.mock.calls.length).toBe(2);
  });

  it('should call onSelect when button is clicked', () => {
    wrapper.find('.button--success').simulate('click');
    expect(props.onSelect.mock.calls.length).toBe(1);
  });
});
