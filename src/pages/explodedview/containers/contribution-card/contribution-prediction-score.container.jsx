import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { contributionData } from 'model/selectors';

import NoData from 'components/no-data';
import D3Legend from 'components/d3-legend';
import D3Piechart from 'components/d3-piechart';

import Section from '../../components/section';

import './contribution-prediction-score.style.scss';

class ContributionPredictionScore extends PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'inspectedLabel': '',
    };

    this.inspectItem = this.inspectItem.bind(this);
    this.leaveItem = this.leaveItem.bind(this);
  }

  inspectItem(itemId) {
    if (itemId !== this.state.inspectedLabel) {
      this.setState({
        'inspectedLabel': itemId,
      });
    }
  }

  leaveItem() {
    this.setState({
      'inspectedLabel': '',
    });
  }

  render() {
    const { detailsData } = this.props;

    return (
      <Section
        size="medium"
        className="+full-height"
        title="Contribution Prediction Score"
        loaded
      >
        {
          detailsData.length > 0 ? (
            <div className="contribution-prediction-score">
              <D3Legend
                data={detailsData}
                onInspectItem={this.inspectItem}
                onLeaveItem={this.leaveItem}
              />
              <D3Piechart
                data={detailsData}
                hoveredSlice={this.state.inspectedLabel}
              />
            </div>
          ) : (
            <NoData
              intlId="global.nodata"
              intlDefault="There is no data to display"
              className="nodata"
              withIcon
            />
            )
        }
      </Section>
    );
  }
}

ContributionPredictionScore.displayName = 'ContributionPredictionScore';
ContributionPredictionScore.propTypes = {
  'detailsData': PropTypes.array,
};
ContributionPredictionScore.defaultProps = {
  'detailsData': [],
};

const mapStateToProps = state => ({
  'detailsData': contributionData(state),
});

export default connect(mapStateToProps)(ContributionPredictionScore);
