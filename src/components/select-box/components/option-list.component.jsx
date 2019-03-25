import React from 'react';
import PropTypes from 'prop-types';

import { Scrollbars } from 'react-custom-scrollbars';
import Option from './option.component';

import './option-list.style.scss';

class OptionList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
    };

    this.onSearchInputUpdate = this.onSearchInputUpdate.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
  }

  onSearchInputUpdate(event) {
    this.setState({
      searchTerm: event.target.value,
    });
  }

  renderOptions(el) {
    const { onClick, style } = this.props;

    return (
      <Option
        {...el}
        isActive={Array.isArray(this.props.activeOption)
          ? this.props.activeOption.includes(el.id)
          : this.props.activeOption === el.id
        }
        key={el.id}
        singleSelect={this.props.singleSelect}
        onClick={e => onClick(e)}
        style={style}
      />
    );
  }

  render() {
    let options = [...this.props.options];
    if (this.props.autocomplete) {
      options = options.filter(item => (
        item.content.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) > -1 ||
        item.id.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) > -1
      ));
    }

    if (this.props.scrollbar === true) {
      return (
        <div className={this.props.className}>
          {this.props.autocomplete && (
            <div className={`${this.props.className}__autocomplete options-list__autocomplete`}>
              <input
                onChange={this.onSearchInputUpdate}
                placeholder="Search..."
              />
            </div>
          )}
          <Scrollbars
            autoHeight
            autoHeightMax={200}
            renderTrackHorizontal={subProps => <div {...subProps} className="track-horizontal" />}
            renderTrackVertical={subProps => <div {...subProps} className="track-vertical" />}
            renderThumbHorizontal={subProps => <div {...subProps} className="thumb-horizontal" />}
            renderThumbVertical={subProps => <div {...subProps} className="thumb-vertical" />}
          >
            {options.map(this.renderOptions)}
          </Scrollbars>
        </div>
      );
    }

    return (
      <div className={this.props.className}>
        {this.props.autocomplete && (
          <div className={`${this.props.className}__autocomplete options-list__autocomplete`}>
            <input
              onChange={this.onSearchInputUpdate}
              placeholder="Search..."
            />
          </div>
        )}
        {options.map(this.renderOptions)}
      </div>
    );
  }
}

OptionList.displayName = 'OptionList';
OptionList.propTypes = {
  'activeOption': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  'className': PropTypes.string,
  'options': PropTypes.arrayOf(PropTypes.shape({
    'id': PropTypes.string.isRequired,
    'label': PropTypes.string,
    'content': PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,
  })),
  'scrollbar': PropTypes.bool,
  'singleSelect': PropTypes.bool.isRequired,
  'onClick': PropTypes.func.isRequired,
  'style': PropTypes.object,
  'autocomplete': PropTypes.bool,
};
OptionList.defaultProps = {
  'className': 'selectBox__optionList',
  'options': [],
  'scrollbar': false,
  'style': {},
  'autocomplete': false,
};

export default OptionList;
