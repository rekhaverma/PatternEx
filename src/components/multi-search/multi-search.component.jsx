import React from 'react';
import PropTypes from 'prop-types';

import './multi-search.style.scss';
import Tag from './components/tag.component';

class MultiSearch extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      currentValue: '',
      removeCount: 0,
    };

    this.onTagRemove = this.onTagRemove.bind(this);
    this.onTagAdd = this.onTagAdd.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
  }

  componentDidMount() {
    this.setState({
      tags: this.props.tags,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tags: nextProps.tags,
    });
  }

  onTagAdd(value) {
    if (!value) {
      return;
    }

    const tags = [...this.state.tags];

    if (tags.indexOf(value) === -1) {
      tags.push(value);

      this.setState({ tags }, () => {
        this.updateTags();
      });
    }
  }

  onTagRemove(value) {
    const tags = [...this.state.tags];
    tags.splice(tags.indexOf(value), 1);

    this.setState({ tags }, () => {
      this.updateTags();
    });
  }

  onInputKeyDown(e) {
    switch (e.which) {
      case 8: // backspace
      case 46: // delete
        if (this.state.removeCount) {
          this.onTagRemove(this.state.tags[this.state.tags.length - 1]);
          this.setState({
            removeCount: 0,
          });
        } else {
          this.setState({
            removeCount: 1,
          });
        }
        break;
      case 13: // enter
        this.onTagAdd(this.state.currentValue);
        this.setState({
          currentValue: '',
        });
        break;
      default:
        this.setState({
          removeCount: 0,
        });
        break;
    }
  }

  updateTags() {
    this.props.onChange(this.state.tags.filter(tag => typeof tag === 'string'));
  }

  renderTags() {
    if (this.state.tags.length === 0) {
      return <span />;
    }

    return this.state.tags.map((item, index) => {
      let className = `${this.props.className}__tag`;

      if (this.state.removeCount && index === this.state.tags.length - 1 && typeof item === 'string') {
        className += ` ${this.props.className}__tag--before-delete`;
      }

      return (
        <Tag
          key={index}
          className={className}
          value={item}
          onRemove={() => (this.onTagRemove(item))}
        />
      );
    });
  }

  render() {
    const { className, style, placeholder } = this.props;

    return (
      <div className={`multi-search ${className}`} style={style}>
        <div className={`multi-search__container ${className}__container`}>
          <div className={`multi-search__tags ${className}__tags`}>
            {this.renderTags()}
          </div>
          <div className={`multi-search__input ${className}__input`}>
            <input
              type="text"
              placeholder={this.state.tags.length ? '' : placeholder}
              value={this.state.currentValue}
              onChange={e => this.setState({ currentValue: e.target.value })}
              onKeyDown={this.onInputKeyDown}
            />
            <span className="icon-search" />
          </div>
        </div>
      </div>
    );
  }
}

MultiSearch.propTypes = {
  onChange: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

MultiSearch.defaultProps = {
  placeholder: '',
  className: 'multi-search',
  style: {},
};

export default MultiSearch;
