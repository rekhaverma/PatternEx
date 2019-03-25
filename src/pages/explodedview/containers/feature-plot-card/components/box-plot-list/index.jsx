import React from 'react';
import BoxPlot from 'components/d3-box-plot-chart';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';
import BoxPlotLegend from '../box-plot-legend';
import BoxPlotHeaders from '../box-plot-headers';

import './box-plot-list.style.scss';

const BoxPlotList = (props) => {
  const scrollBarProps = {
    'autoHeight': true,
    'autoHeightMin': 0,
    'autoHeightMax': 180,
  };
  const {
    sort,
    modelHistogram,
    searchData,
    selectedDropDown,
    featureDictionary,
    onListedFeatureSelect,
    onSortByDeviation } = props;
  return (
    <div className="box-plot-list">
      <BoxPlotLegend />
      <BoxPlotHeaders
        sort={sort}
        onSortByDeviation={onSortByDeviation}
      />
      <Scrollbars {...scrollBarProps}>
        {
          selectedDropDown.map(feature => (
            <BoxPlot
              key={feature}
              feature={feature}
              value={searchData[feature]}
              title={featureDictionary[feature]}
              histogram={modelHistogram[feature]}
              onListedFeatureSelect={graphProperties => onListedFeatureSelect(graphProperties)}
            />
          ))
        }
      </Scrollbars>
    </div>
  );
};

BoxPlotList.propTypes = {
  'modelHistogram': PropTypes.object.isRequired,
  'searchData': PropTypes.object.isRequired,
  'selectedDropDown': PropTypes.array.isRequired,
  'featureDictionary': PropTypes.object.isRequired,
  'onListedFeatureSelect': PropTypes.func.isRequired,
  'sort': PropTypes.string.isRequired,
  'onSortByDeviation': PropTypes.func.isRequired,
};

export default BoxPlotList;
