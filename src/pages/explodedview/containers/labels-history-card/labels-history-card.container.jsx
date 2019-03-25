import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import moment from 'moment';
import NoData from 'components/no-data';
import List, { LABEL_HISTORY } from '../../components/list';
import Section from '../../components/section';

import { withLabelsHistoryData, withLabelsActions, withLocationData, withHistoricalData } from '../../hoc';

class LabelsHistoryCard extends Component {
  constructor(props) {
    super(props);

    this.handleDeleteLabel = this.handleDeleteLabel.bind(this);
  }

  handleDeleteLabel(labelID) {
    const getLabels = () => {
      this.props.getEntityLabelHistory(this.props.location);
      this.props.getSearchData(this.props.location);
      this.props.getHistoricalData(this.props.location);
      this.props.changeSetLabelDisplay(false);
    };
    this.props.deleteLabel(labelID, getLabels);
  }

  render() {
    const { startDate, endDate } = this.props;

    return (
      <Section
        size="small"
        title="Label History"
        loaded={this.props.isLabelsHistoryLoaded}
        expandable
        isDraggable={this.props.isDraggable}
      >
        {this.props.labelsHistory.length > 0 ?
            (<List
              type={LABEL_HISTORY}
              data={this.props.labelsHistory}
              handlers={{
                'deleteLabel': this.handleDeleteLabel,
              }}
              customClass={{
                base: 'labels-card',
              }}
              startDate={startDate}
              endDate={endDate}
            />) : (
              <NoData
                intlId="global.nodata"
                intlDefault="There is no data to display"
                className="nodata--labelcard"
                withIcon
              />
            )
          }
      </Section>
    );
  }
}

LabelsHistoryCard.displayName = 'LabelsHistoryCard';

LabelsHistoryCard.propTypes = {
  'isLabelsHistoryLoaded': PropTypes.bool,
  'labelsHistory': PropTypes.array,
  'location': PropTypes.object,
  'getEntityLabelHistory': PropTypes.func,
  'getSearchData': PropTypes.func,
  'deleteLabel': PropTypes.func,
  'getHistoricalData': PropTypes.func,
  'startDate': PropTypes.object,
  'endDate': PropTypes.object,
  'changeSetLabelDisplay': PropTypes.func,
  'isDraggable': PropTypes.bool,
};

LabelsHistoryCard.defaultProps = {
  'isLabelsHistoryLoaded': false,
  'labelsHistory': [],
  'location': {},
  'getEntityLabelHistory': () => {},
  'getSearchData': () => {},
  'deleteLabel': () => {},
  'getHistoricalData': () => {},
  'startDate': moment(),
  'endDate': moment(),
  'changeSetLabelDisplay': () => {},
  'isDraggable': true,
};

const enhance = compose(
  withHistoricalData,
  withLabelsHistoryData,
  withLocationData,
  withLabelsActions,
);

export default enhance(LabelsHistoryCard);
