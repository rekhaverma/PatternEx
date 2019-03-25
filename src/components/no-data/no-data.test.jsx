import React from 'react';
import NoData from './no-data.component';

describe('<NoData />', () => {
  it('should match with snapshot', () => {
    const props = {
      'intlDefault': 'Default Message',
      'intlId': 'nothing.here',
    };
    const component = mountWithIntl(<NoData {...props} />);

    expect(component).toMatchSnapshot();
  });
  it('should render a default intl message', () => {
    const props = {
      'intlDefault': 'Default Message',
      'intlId': 'nothing.here',
    };
    const component = mountWithIntl(<NoData {...props} />);

    expect(component.text()).toBe(props.intlDefault);
  });
});
