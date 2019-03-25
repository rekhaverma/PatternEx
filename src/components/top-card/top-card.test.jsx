import React from 'react';
import TopCard from './top-card.component';

describe('<TopCard />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      className: 'testClass',
      disabled: false,
      icon: 'testIcon',
      footer: 'Footer Test',
      footerType: 'details',
      mainText: 'mainTest',
      state: 'stateTest',
      topText: 'topTest',
      nextURL: 'http://google.ro',
    };
    wrapper = shallow(<TopCard {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

