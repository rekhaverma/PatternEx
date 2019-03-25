import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Tooltip from 'components/tooltip';

import withBox from 'components/withBox';
import OptionList from 'components/select-box/components/option-list.component';

import './icon-select-box.style.scss';

class IconSelectBox extends Component {
  constructor(props) {
    super(props);

    this.openBoxHander = this.openBoxHander.bind(this);
  }

  openBoxHander() {
    if (this.props.boxIsOpen) {
      this.props.closeBox();
    //   this.props.boxIsOpen = false;
    }
    this.props.openBox();
  }

  render() {
    const {
      boxIsOpen,
      options,
      activeOptions,
      updateOptionsHandler,
      icon,
      intlid,
      tooltipIntl,
      autocomplete,
    } = this.props;

    return (
      <div className="iconSelectBox">
        <div className={boxIsOpen ? 'iconSelectBox__box +open' : 'iconSelectBox__box'} onClick={this.openBoxHander}>
          {intlid !== '' &&
          <FormattedMessage id={intlid} />
                }
          <Tooltip
            trigger={(
              <span className={icon} />
                    )}
            position="top"
          >
            <FormattedMessage id={tooltipIntl} />
          </Tooltip>

        </div>
        <div>
          {
                options.length > 0 && boxIsOpen && (
                  <OptionList
                    autocomplete={autocomplete}
                    activeOption={activeOptions}
                    scrollbar={false}
                    options={options}
                    singleSelect={false}
                    onClick={updateOptionsHandler}
                  />
                )
              }
        </div>
      </div>
    );
  }
}

IconSelectBox.displayName = 'IconSelectBox';
IconSelectBox.propTypes = {
  'options': PropTypes.array,
  'activeOptions': PropTypes.array,
  'updateOptionsHandler': PropTypes.func,
  'openBox': PropTypes.func.isRequired,
  'closeBox': PropTypes.func.isRequired,
  'boxIsOpen': PropTypes.bool.isRequired,
  'intlid': PropTypes.string,
  'tooltipIntl': PropTypes.string,
  'icon': PropTypes.string,
  'autocomplete': PropTypes.bool,
};
IconSelectBox.defaultProps = {
  'options': [],
  'autocomplete': false,
  'activeOptions': [],
  'updateOptionsHandler': () => null,
  'intlid': '',
  'tooltipIntl': 'tooltip.icon-select-box',
  'icon': 'icon-cog',
};

export default withBox(IconSelectBox);
