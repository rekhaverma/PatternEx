import React from 'react';
import MetaList from './meta-list.component';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<MetaList />', () => {
  it('should match with snapshot', () => {
    const props = {
      className: 'class-name',
      metas: {
        relations: 10,
      },
    };
    const wrapper = mountWithIntl(<MetaList {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
