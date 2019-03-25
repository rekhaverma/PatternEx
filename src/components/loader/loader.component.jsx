import React from 'react';

import './loader.style.scss';

const Loader = () => (
  <div className="loader">
    <div className="loader__content">
      <div className="bullet" />
      <div className="bullet" />
      <div className="bullet" />
      <div className="bullet" />
      <div className="loader__text">Crunching Numbers. Please wait!</div>
    </div>
  </div>
);

export default Loader;
