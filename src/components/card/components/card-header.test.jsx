import React from 'react';
import CardHeader from './card-header.component';
import { COUNT } from '../constants';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<CardHeader />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      count: COUNT,
      countValue: 1,
      title: 'Card Header Test',
      hasMore: true,
      hasHelp: true,
      onHelpClick: jest.fn(),
      onMoreClick: jest.fn(),
    };
    wrapper = shallow(<CardHeader {...props} />);
  });

  it('should match with snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onHelpClick when element is clicked', () => {
    wrapper.find('.icon-question').simulate('click');
    expect(props.onHelpClick.mock.calls.length).toBe(1);
  });

  it('should call onMoreClick whenif element is clicked', () => {
    wrapper.find('.card__header__more').simulate('click');
    expect(props.onMoreClick.mock.calls.length).toBe(1);
  });
});
