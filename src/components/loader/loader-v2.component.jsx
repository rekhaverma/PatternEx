import React from 'react';
import PropTypes from 'prop-types';

import './loader.style.scss';

const Loader = (props) => {
  const className = props.small ? 'loaderV2 loaderV2--small' : 'loaderV2';
  return (
    <div className={className}>
      <div className="loaderV2__content">
        <div className="rowTriangle">
          <div className="arrow up outer outer-18" />
          <div className="arrow down outer outer-17" />
          <div className="arrow up outer outer-16" />
          <div className="arrow down outer outer-15" />
          <div className="arrow up outer outer-14" />
        </div>
        <div className="rowTriangle">
          <div className="arrow up outer outer-1" />
          <div className="arrow down outer outer-2" />
          <div className="arrow up inner inner-6" />
          <div className="arrow down inner inner-5" />
          <div className="arrow up inner inner-4" />
          <div className="arrow down outer outer-13" />
          <div className="arrow up outer outer-12" />
        </div>
        <div className="rowTriangle">
          <div className="arrow down outer outer-3" />
          <div className="arrow up outer outer-4" />
          <div className="arrow down inner inner-1" />
          <div className="arrow up inner inner-2" />
          <div className="arrow down inner inner-3" />
          <div className="arrow up outer outer-11" />
          <div className="arrow down outer outer-10" />
        </div>
        <div className="rowTriangle">
          <div className="arrow down outer outer-5" />
          <div className="arrow up outer outer-6" />
          <div className="arrow down outer outer-7" />
          <div className="arrow up outer outer-8" />
          <div className="arrow down outer outer-9" />
        </div>
      </div>
    </div>
  );
};

Loader.displayName = 'Loader';

Loader.propTypes = {
  'small': PropTypes.bool,
};

Loader.defaultProps = {
  'small': false,
};

export default Loader;
