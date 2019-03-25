import React from 'react';
import CardFooter from './card-footer.component';

describe('<CardFooter />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      className: 'testClass',
      type: 'details',
      element: 'Test',
      nextURL: 'http://google.ro',
    };
    wrapper = shallow(<CardFooter {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

