import React from 'react';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import { connect } from 'react-redux';

import { predictionByEntityName } from 'model/selectors';
import { getEntityTypeByPipeline } from 'lib/decorators';
import Table from 'components/table';
import { EvpOpenMethods } from 'model/classes/evp-open-methods';

import SelectedPrediction from '../../components/selected-prediction';
import predictionColumns from './constants';

const SelectedPredictionContainer = ({ prediction, ...props }) => (
  Object.keys(prediction).length > 0
    ? (
      <SelectedPrediction>
        <Table
          className="table"
          columns={predictionColumns}
          options={{}}
          data={[
            {
              ...prediction,
              'handlers': {
                setLabel: (e) => {
                  e.stopPropagation();
                  props.setLabelForPrediction(prediction, true);
                },
                'openEVP': (e) => {
                  e.stopPropagation();
                  const row = {
                    ...prediction,
                    entity_type: getEntityTypeByPipeline(prediction.pipeline),
                  };
                  const { isOldEVPActive, handleExplodedView } = props;
                  EvpOpenMethods.onRowClickHandler(
                    row,
                    row.behavior,
                    isOldEVPActive,
                    handleExplodedView,
                  );
                },
              },
            },
          ]}
          expandableRow={() => false}
          expandComponent={() => null}
        />
      </SelectedPrediction>
    )
    : <SelectedPrediction isHidden />
);
SelectedPredictionContainer.propTypes = {
  'prediction': PropTypes.object,
  // 'selectedEntity': PropTypes.string,
  'setLabelForPrediction': PropTypes.func.isRequired,
  'handleExplodedView': PropTypes.func.isRequired,
  'isOldEVPActive': PropTypes.bool,
};
SelectedPredictionContainer.defaultProps = {
  'prediction': {},
  'selectedEntity': '',
  'isOldEVPActive': false,
};

const mapStateToProps = (state, ownProps) => ({
  'prediction': predictionByEntityName(state, ownProps.selectedEntity),
  'isOldEVPActive': !state.app.ui.toJS().newEVPVisibility,
});

const mapDispatchToProps = dispatch => ({
  'handleExplodedView': (...args) => dispatch(routerActions.push(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectedPredictionContainer);
