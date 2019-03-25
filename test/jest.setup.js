import React from 'react';
import Adapter from 'enzyme-adapter-react-15';
import { shallow, render, mount, configure } from 'enzyme';
import { IntlProvider, intlShape } from 'react-intl';

import { enObj } from '../src/model/actions/i18n.actions';

configure({ 'adapter': new Adapter() });

// Create a whitelist to get rid of
// annoying deprecation warning (from 3rd party libs)
const oldWarn = console.warn;
const newWarn = (warning) => {
  const whitelist = [
    'Warning: Accessing PropTypes via the main React package is deprecated, and will be removed in  React v16.0. Use the latest available v15.* prop-types package from npm instead. For info on usage, compatibility, migration and more, see https://fb.me/prop-types-docs',
  ];

  if (!whitelist.includes(warning)) {
    oldWarn(warning);
  }
};

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(node) {
  return React.cloneElement(node, { intl });
}

// Fail tests on any warning
console.error = (message) => {
  throw new Error(message);
};
console.warn = newWarn;

const intlProvider = new IntlProvider(enObj, {});
const { intl } = intlProvider.getChildContext();

global.intl = intl;
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.shallowWithIntl = (node, { context } = {}) => shallow(
  nodeWithIntlProp(node),
  { 'context': Object.assign({}, context, { intl }) },
);
global.mountWithIntl = (node, { context, childContextTypes } = {}) => mount(
  nodeWithIntlProp(node),
  {
    'context': Object.assign({}, context, { intl }),
    'childContextTypes': Object.assign({}, { 'intl': intlShape }, childContextTypes),
  },
);
