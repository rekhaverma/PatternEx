import React from 'react';
import PropTypes from 'prop-types';

import { Input } from 'components/forms';


class Pagination extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'value': '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.setState({ 'value': this.props.currentPage });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPage !== this.props.currentPage) {
      this.setState({ 'value': nextProps.currentPage });
    }
  }

  handleInputChange(e) {
    this.setState({
      'value': e.target.value,
    });
  }

  render() {
    const {
      currentPage,
      totalPage,
      onClick,
      onBlur,
    } = this.props;
    return (
      <div style={{ 'marginLeft': 10, 'userSelect': 'none' }}>
        <span
          onClick={() => onClick(1)}
          style={{ 'margin': '0 5px', 'cursor': 'pointer' }}
        >
          {'<<'}
        </span>
        <span
          onClick={() => onClick(currentPage - 1)}
          style={{ 'margin': '0 5px', 'cursor': 'pointer' }}
        >
          {'<'}
        </span>
        <span style={{ 'marginRight': 3 }}>Page</span>
        <Input
          value={this.state.value}
          style={{ 'width': 50, 'padding': 5, 'borderRadius': 3 }}
          onBlur={onBlur}
          onChange={e => this.handleInputChange(e)}
        />
        <span style={{ 'margin': '0 6px' }}>/ {totalPage}</span>
        <span
          onClick={() => onClick(currentPage + 1)}
          style={{ 'margin': '0 5px', 'cursor': 'pointer' }}
        >
          {'>'}
        </span>
        <span
          onClick={() => onClick(totalPage)}
          style={{ 'margin': '0 5px', 'cursor': 'pointer' }}
        >
          {'>>'}
        </span>
      </div>
    );
  }
}
Pagination.displayName = 'Pagination';
Pagination.propTypes = {
  'currentPage': PropTypes.number,
  'totalPage': PropTypes.number,
  'onBlur': PropTypes.func,
  'onClick': PropTypes.func,
};
Pagination.defaultProps = {
  'currentPage': 1,
  'totalPage': 1,
  'onBlur': () => null,
  'onClick': () => null,
};

export default Pagination;
