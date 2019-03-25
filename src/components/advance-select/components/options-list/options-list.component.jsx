import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';

import { MatField } from 'components/forms';

import Option from '../option/option.component';

class OptionList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
    };

    this.onAutoCompleteUpdate = this.onAutoCompleteUpdate.bind(this);
  }

  onAutoCompleteUpdate(filter) {
    this.setState({ filter });
  }

  getFilteredOptions() {
    const { options, allowSearch } = this.props;
    const { filter } = this.state;
    if (allowSearch && filter.toString().length) {
      return options.filter(({ id, value }) =>
        id.toLowerCase().includes(filter.toString().toLowerCase()) ||
        value.toLowerCase().includes(filter.toString().toLowerCase()));
    }

    return options;
  }

  render() {
    const { className, dropDownHeader, allowSearch, onOptionClick } = this.props;
    const options = this.getFilteredOptions();
    let minHeight = options.length * 25;
    const maxHeight = 200;
    if (minHeight > maxHeight) {
      minHeight = maxHeight;
    }
    return (
      <div className={`${className}__option-list`}>
        {dropDownHeader && (
          <div className={`${className}__option-list-header`}>
            {dropDownHeader}
          </div>
        )}
        {allowSearch && (
          <div className={`${className}__option-list-auto-complete`}>
            <MatField
              label="default.search.string"
              name="autocomplete"
              errorMessage="default.search.string"
              type="text"
              prefix="autocomplete"
              value={this.state.filter}
              onChange={this.onAutoCompleteUpdate}
              onErrorFound={() => null}
            />
          </div>
        )}
        <Scrollbars
          autoHeight
          hideTracksWhenNotNeeded
          autoHeightMin={minHeight}
          autoHeightMax={maxHeight}
          renderThumbVertical={subProps => <div {...subProps} style={{ 'backgroundColor': '#ccc', 'borderRadius': '3px' }} className="thumb-vertical" />}
        >
          {options.map(({ id, value, isSelected, disabled }) => (
            <Option
              className={className}
              key={id}
              id={id}
              value={value}
              isDisabled={disabled}
              onOptionClick={onOptionClick}
              isSelected={isSelected || false}
            />
          ))}
        </Scrollbars>
      </div>
    );
  }
}

OptionList.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    isSelected: PropTypes.bool,
    disabled: PropTypes.bool,
  })).isRequired,
  onOptionClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  dropDownHeader: PropTypes.string,
  allowSearch: PropTypes.bool,
};

OptionList.defaultProps = {
  className: 'advance-select',
  dropDownHeader: null,
  allowSearch: false,
};

export default OptionList;
