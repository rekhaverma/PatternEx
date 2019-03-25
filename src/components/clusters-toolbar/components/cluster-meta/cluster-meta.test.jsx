import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import ClusterMeta from './cluster-meta.component';

describe('<ClusterMeta />', () => {
  it('should match with snapshot', () => {
    const wrapper = mountWithIntl(<ClusterMeta />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render empty', () => {
    const component = mountWithIntl(<ClusterMeta />);

    // Expect to have the content of component empty
    expect(component.html()).toEqual('<div class="clusterMeta"><p class="clusterMeta__centralEntity"></p></div>');
  });

  it('should render a button as children', () => {
    const component = mountWithIntl(
      <ClusterMeta>
        <button>Click me</button>
      </ClusterMeta>,
    );
    const button = component.find('button');

    // Expect the button HTML tag to exist
    expect(button.exists()).toEqual(true);

    // Expect to be only one button
    expect(button).toHaveLength(1);
  });

  it('should render the correct i18n message', () => {
    const metas = {
      'relations': 10,
      'entities': 100,
    };
    const component = mountWithIntl(<ClusterMeta metas={metas} />);
    const i18nMessages = component.find(FormattedHTMLMessage);

    // Expect to have the exact number of <FormattedHTMLMessage /> as in props
    expect(i18nMessages).toHaveLength(2);

    // Expect messages to have the same order as in props
    // Testing if "cluster.metas.<id>" equals the <FormattedHTMLMessage /> ID prop
    i18nMessages.forEach((node, index) => {
      expect(`cluster.metas.${Object.keys(metas)[index]}`).toEqual(node.prop('id'));
    });
  });

  it('should fallback to defaultMessage', () => {
    const metas = {
      'noTitle': 10,
    };
    const component = mountWithIntl(<ClusterMeta metas={metas} />);

    const i18nMessages = component.find(FormattedHTMLMessage);

    // Expect <FormattedHTMLMessage /> to fallback to defaultMessage in case
    // it doesn't find the meta's key
    expect(i18nMessages.html()).toEqual('<span><span style="color: white">10</span> noTitle</span>');
  });
});

