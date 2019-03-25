import React from 'react';
import MultiSearch from './multi-search.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */

describe('<MultiSearch />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      tags: [],
      onChange: jest.fn(),
    };

    wrapper = shallow(<MultiSearch {...props} />);
  });

  it('should renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should return `[\'tag\']`', () => {
    wrapper.find('input').simulate('change', { target: { value: 'tag' } });
    wrapper.find('input').simulate('keydown', { which: 13 });

    expect(props.onChange.mock.calls[0][0]).toEqual(['tag']);
  });

  it('should return empty array', () => {
    wrapper.find('input').simulate('change', { target: { value: 'tag' } });
    wrapper.find('input').simulate('keydown', { which: 13 });
    wrapper.find('input').simulate('keydown', { which: 8 });
    wrapper.find('input').simulate('keydown', { which: 8 });

    expect(props.onChange.mock.calls[1][0]).toEqual([]);
  });
});