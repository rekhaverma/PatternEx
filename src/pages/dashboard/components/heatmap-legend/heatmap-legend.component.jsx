import React from 'react';

import { FormattedHTMLMessage } from 'react-intl';

import './heatmap-legend.style.scss';

const HeatMapLegend = () => (
  <div className="heatMap__legend">
    <FormattedHTMLMessage id="heatmap.legend.start" />
    <div className="heatMap__gradient" />
    <FormattedHTMLMessage id="heatmap.legend.end" />
  </div>
);

export default HeatMapLegend;
