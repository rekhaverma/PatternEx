import React from 'react';
import PredictionHead from './prediction-head.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<PredictionHead />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      titles: ['Test', 'Another Test'],
    };
    wrapper = shallow(<PredictionHead {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
