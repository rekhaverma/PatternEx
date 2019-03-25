import React from 'react';
import PredictionTabs from './prediction-tabs.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<PredictionTabs />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      className: 'test-class',
      activeTab: '1',
      tabs: [
        {
          count: 2,
          id: '1',
          title: 'tab 1 title',
        }, {
          count: 2,
          id: '2',
          title: 'tab 2 title',
        }],
      onClick: jest.fn(),
    };
    wrapper = shallow(<PredictionTabs {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onClick when element is clicked', () => {
    wrapper.find('.test-class__el--active').simulate('click');
    expect(props.onClick.mock.calls.length).toBe(1);
  });
});
