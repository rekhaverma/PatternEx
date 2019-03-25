import React from 'react';
import Paragraph from './paragraph.component';

const errorProps = {
  'status': 'ERROR',
  'results': {
    'code': 'ERROR',
    'msg': [{
      'type': 'TEXT',
      'data': 'Table or view not found: bank2; \n line 2 pos 5 set zeppelin.spark.sql.stacktrace = true to see full stacktrace',
    }],
  },
};

describe('<Paragraph />', () => {
  it('should fallback to default i18n props', () => {
    const component = mountWithIntl(<Paragraph />);
    expect(component.find('.paragraph__title').text()).toBe('Untitled');
    expect(component.find('.paragraph__status').text()).toBe('Unknown');
  });

  it('should have the correct className', () => {
    const component = mountWithIntl(<Paragraph />);
    expect(component.prop('className')).toBe('paragraph');

    component.setProps({ 'className': 'paragraphAfter' });
    expect(component.prop('className')).toBe('paragraphAfter');
  });

  it('should display an error', () => {
    const component = mountWithIntl(<Paragraph {...errorProps} />);
    expect(component.find('.paragraph__output').exists()).toBe(true);
  });

  it('should split the error correctly', () => {
    const component = mountWithIntl(<Paragraph {...errorProps} />);
    expect(component.find('.paragraph__output').children()).toHaveLength(2);
  });
});
