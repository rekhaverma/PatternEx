import React from 'react';
import moment from 'moment';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';

import BarChartDiagram from 'components/d3-bar-chart';
import { createStackedBarChart } from './chartUtils.jsx';

const dateFormats = {
  'longFormatWithOffset': 'ddd, DD MMM YYYY hh:mm:ss ZZ',
  'longFormatWithTimeZone': 'ddd, DD MMM YYYY hh:mm:ss z',
  'longFormatWithOffset2': 'YYYY-MM-DD HH:mm:ssZZ',
  'longFormatWithoutOffset': 'ddd, DD MMM YYYY hh:mm:ss',
  'longFormatWithTimeZoneAMPM': 'ddd, DD MMM YYYY hh:mm:ss A z',
  'displayFormat': 'MM/DD/YYYY hh:mm A',
  'apiSendFormat': 'YYYY-MM-DD',
  'mmddyyyySlash': 'MM/DD/YYYY',
  'ddmmyyDash': 'DD-MM-YY',
  'mmddyySlash': 'MM/DD/YY',
  'shortFormat': 'HH:mm',
  'unix': 'X',
  'longFormatWithoutYear': 'MM/DD/YY HH:mm',
  'datePickerParserFormat': 'yy-mm-dd', // This format is specific to the datePicker date parser
};

const pieMaxSlice = 10;

const staticTagColorMap = {
  'Benign': '#B93740', // Normal Green
  'HPA': '#e96b4b',
  'TOS Abuse': '#24433f',
  'Denial of Service': '#574B90',
  'Delivery': '#539279',
  'Discovery': '#c1b06b',
  'Lateral Movement': '#67809F',
  'Credential Access': '#227093',
  'Exfiltration': '#f5c367',
  'Command and Control': '#F2784B',
  'CC Fraud': '#efa84e',
  'ATO': '#4B77BE',
  'Unknown': '#947CB0',
  'undefined': '#947CB0',
  '': '#947CB0',
};

const emptyContainer = (node) => {
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
  return node;
};

const sortByDate = (dataSet, field, dateFormat, order) => {
  let sortOrderValue = 1;
  if (dataSet && dataSet.length && field && dateFormat) {
    sortOrderValue = order && order.toLowerCase() === 'desc' ? -1 : 1;
  }
  return dataSet.sort((a, b) =>
    sortOrderValue * (moment(a[field], dateFormat).unix() - moment(b[field], dateFormat).unix()));
};

const formatTagName = tagName => (tagName ? tagName.trim() : 'Unknown');

class LabelGraphs extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'barChartData': [],
    };
    this.handleCharts = this.handleCharts.bind(this);
    this.labelsByDate = null;
  }

  componentDidMount() {
    this.handleCharts(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.items, this.props.items)) {
      this.handleCharts(nextProps);
    }
  }

  handleCharts(data) {
    const { items, labelsAvailable } = data;
    const labelTagGraphData = [];
    let dateLabelGraphData = [];
    const tagMap = {};
    const dateMap = {};
    const labelDateContainer = emptyContainer(this.labelsByDate);

    if (labelsAvailable && items) {
      items.forEach((label) => {
        const tagName = formatTagName(label.tactic);
        tagMap[tagName] = tagMap[tagName] ? tagMap[tagName] + 1 : 1;

        // Creating date count map for barChart
        const labelDateMoment = moment.utc(label.time_start, dateFormats.longFormatWithOffset).startOf('day');
        const labelDate = labelDateMoment.format(dateFormats.mmddyySlash);

        if (labelDate !== 'Invalid date') {
          if (typeof (dateMap[labelDate]) !== 'object') {
            dateMap[labelDate] = {};
          }
          dateMap[labelDate][tagName] = dateMap[labelDate][tagName]
            ? dateMap[labelDate][tagName] + 1
            : 1;
        }
      });

      const tagList = Object.keys(tagMap);
      const tagColors = [];

      tagList.forEach((key) => {
        const tagName = formatTagName(key);
        const tagColor = staticTagColorMap[tagName];

        tagColors.push(tagColor);

        labelTagGraphData.push({
          'name': tagName,
          'value': tagMap[key],
          'color': tagColor,
        });
      });

      Object.keys(dateMap).forEach((key) => {
        const value = {
          'name': key,
        };
        tagList.forEach((tagName) => {
          value[tagName] = dateMap[key][tagName] || 0;
        });
        dateLabelGraphData.push(value);
      });

      // Creating Label Date BarChart
      if (dateLabelGraphData && dateLabelGraphData.length) {
        dateLabelGraphData = sortByDate(dateLabelGraphData, 'name', dateFormats.mmddyySlash);
        dateLabelGraphData = dateLabelGraphData.slice(-10);

        createStackedBarChart({
          'barChartData': dateLabelGraphData,
          'container': labelDateContainer,
          'fields': tagList,
          'colors': tagColors,
          'yAxisText': 'Count',
          'height': 300,
          'header': 'Labels by Date',
          'noData': { 'class': 'no-data-found', 'text': 'No Data Exists!' },
          'maxSlice': pieMaxSlice,
        });
      }

      // Creating Label Tag BarChart
      if (labelTagGraphData && labelTagGraphData.length) {
        this.setState({
          'barChartData': labelTagGraphData,
        });
      }
    }
  }


  render() {
    return (
      <div className="graphSection">
        <div ref={div => this.labelsByDate = div} />
        <BarChartDiagram
          items={this.state.barChartData}
          header="Labels By Tactic Name"
          yAxisText="Label Count"
          maxSlice={pieMaxSlice}
          config={{ 'svgHeight': 300, 'svgWidth': 700 }}
          drawLegend
        />
      </div>
    );
  }
}

LabelGraphs.defaultProps = {
  'items': [],
  'labelSummary': {},
  'totalLabels': 0,
  'labelSummaryAvailable': false,
  'labelsAvailable': false,
};
LabelGraphs.propTypes = {
  'items': PropTypes.array,
};

export default LabelGraphs;
