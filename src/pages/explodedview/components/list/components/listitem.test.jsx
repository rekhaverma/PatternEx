import React from 'react';

import ListItem from './listitem.component';
import {
  VALUES_PROP,
  LABEL_HISTORY,
  DOMAIN_INFO_RESOLUTIONS,
} from '../constants.jsx';

/**
 * @status: Complete
 * @sign-off-by: Alex Andries
 */
describe('<ListItem />', () => {
  it('should match with snapshot default', () => {
    const props = {
      customClass: '',
      handlers: {},
      data: {
        name: 'demo',
        value: 1,
      },
      type: '',
    };
    const wrapper = shallow(<ListItem {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - VALUES_PROP', () => {
    const props = {
      customClass: '',
      handlers: {},
      data: 'demo',
      type: VALUES_PROP,
    };
    const wrapper = shallow(<ListItem {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - LABEL_HISTORY', () => {
    const props = {
      customClass: '',
      handlers: {},
      data: {
        name: 'demo',
        value: 1,
      },
      type: LABEL_HISTORY,
    };
    const wrapper = shallow(<ListItem {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
  it('should match with snapshot - DOMAIN_INFO_RESOLUTIONS', () => {
    const props = {
      customClass: '',
      handlers: {},
      data: {
        name: 'demo',
        value: 1,
      },
      type: DOMAIN_INFO_RESOLUTIONS,
    };
    const wrapper = shallow(<ListItem {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
