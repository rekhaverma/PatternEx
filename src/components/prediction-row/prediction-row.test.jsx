import React from 'react';
import PredictionRow from './prediction-row.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<PredictionRow />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      className: 'test-class',
      entity_name: 'entity_name',
      behavior: 'behavior',
      predictions: ['predictions'],
      solved: true,
      tags: ['tag-1', 'tag-2'],
      timestamp: 'timestamp',
      onInspect: jest.fn(),
      onConfirm: jest.fn(),
      onDeny: jest.fn(),
      onEntityClick: jest.fn(),
    };
    wrapper = shallow(<PredictionRow {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onEntityClick when element is clicked', () => {
    wrapper.find('.test-class__entity').simulate('click');
    expect(props.onEntityClick.mock.calls.length).toBe(1);
  });
});
