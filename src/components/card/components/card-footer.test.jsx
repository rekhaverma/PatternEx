import React from 'react';
import CardFooter from './card-footer.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<CardFooter />', () => {
  it('should match with snapshot', () => {
    const props = {
      content: 'footer content',
    };
    const wrapper = shallow(<CardFooter {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
