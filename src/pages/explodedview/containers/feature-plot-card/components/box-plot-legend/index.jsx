import React from 'react';
import { FormattedMessage } from 'react-intl';

import './box-plot-legend.style.scss';

const BoxPlotLegend = () => (
  <div className="box-plot-legend">
    <div className="percentile">
      <div className="icon-rectangle" />
      <span className="rectangle-label">
        <FormattedMessage id="evp.percentiles" />
      </span>
    </div>
    <div className="actual">
      <span className="icon-actual" />
      <span className="actual-label">
        <FormattedMessage id="evp.actual" />
      </span>
    </div>
    <div className="mean">
      <span className="icon-mean" />
      <span className="mean-label">
        <FormattedMessage id="evp.mean" />
      </span>
    </div>
  </div>
);

export default BoxPlotLegend;
