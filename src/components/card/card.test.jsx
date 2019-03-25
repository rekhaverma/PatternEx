import React from 'react';
import Card from './card.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<Card />', () => {
  it('should match with snapshot', () => {
    const props = {
      children: <div />,
      footer: <div />,
      count: 'count',
      countValue: 1,
    };
    const tree = shallow(<Card {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
