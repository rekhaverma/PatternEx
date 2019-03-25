import React from 'react';
import HoursList from './hours-list.component';
/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<HoursList />', () => {
  let wrapper; let props;

  beforeEach(() => {
    props = {
      selectedHour: 1,
      onSelectHour: jest.fn(),
    };
    wrapper = shallow(<HoursList {...props} />);
  })

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the component with .hours__wrapper', () => {
    expect(wrapper.find('.hours__wrapper').length).toEqual(1);
  });
}) 
