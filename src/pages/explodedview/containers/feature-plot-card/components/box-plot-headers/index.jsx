import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';

import './box-plot-headers.style.scss';

class BoxPlotHeaders extends PureComponent {
  static getCaret(direction) {
    switch (direction) {
      case 'asc':
        return (<span className="icon-sort-asc" />);
      case 'desc':
        return (<span className="icon-sort-desc" />);
      default:
        return (<span className="icon-sort" />);
    }
  }
  // TODO Add sorting feature
  // {this.constructor.getCaret(sort)}
  render() {
    // const { onSortByDeviation } = this.props;
    return (
      <div className="box-plot-headers">
        <span className="features">
          Features
        </span>
        <div className="deviation">
          <span className="deviation-heading">
            Distance from mean
          </span>
        </div>
      </div>
    );
  }
}

export default BoxPlotHeaders;
