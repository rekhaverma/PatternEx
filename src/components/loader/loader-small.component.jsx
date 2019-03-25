import React from 'react';

import './loader.style.scss';

const LoaderSmall = () => (
  <div className="loaderSmall">
    <svg className="loaderSmall__circular" viewBox="25 25 50 50">
      <circle
        className="loaderSmall__path"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        strokeWidth="3"
        strokeMiterlimit="10"
      />
    </svg>
  </div>
);

export default LoaderSmall;
