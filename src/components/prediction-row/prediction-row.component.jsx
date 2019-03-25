/* eslint react/no-unused-prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import Tooltip from 'components/tooltip';

import { mapIcons } from 'lib';

import { behaviours } from 'config.js';

import './prediction-row.style.scss';

const findPredictionColor = (base, behavior) => {
  if (behavior === behaviours.MALICIOUS) {
    return `${base} +red`;
  }
  if (behavior === behaviours.SUSPICIOUS) {
    return `${base} +yellow`;
  }
  return base;
};

const PredictionRow = (props) => {
  const renderTags = tag => (
    <div key={`${tag}_${props.entity_name}`}>
      <Tooltip
        position="bottom"
        trigger={(
          <span className={mapIcons(tag)} key={`${tag}`} />
        )}
      >
        <FormattedMessage id={`predictions.type.${tag}`} />
      </Tooltip>
    </div>
  );
  const renderPredictions = (prediction, index) => (
    <div
      className={`${props.className}__item`}
      key={`${prediction}#${index}`}
    >
      <p className={findPredictionColor(
        `${props.className}__name`,
        props.behavior,
      )}
      >
        {prediction}
      </p>
      {
        props.solved ? (
          <div className={`${props.className}__actions +history`}>
            <span>Change Label</span>
            <span className={props.predictionWas ? 'icon-confirm' : 'icon-deny'} />
          </div>
        ) : (
          <div className={`${props.className}__actions`}>
            <Tooltip
              trigger={(
                <span
                  className="icon-inspect"
                  onClick={() => props.onInspect(props.entity_name)}
                />
              )}
              position="bottom"
              key="inspect"
            >
              <FormattedMessage id="predictions.labels.inspect" />
            </Tooltip>
            <Tooltip
              trigger={(
                <span
                  className="icon-confirm"
                  onClick={() => props.onConfirm(prediction)}
                />
              )}
              position="bottom"
              key="confirm"
            >
              <FormattedMessage id="predictions.labels.confirm" />
            </Tooltip>
            <Tooltip
              trigger={(
                <span
                  className="icon-deny"
                  onClick={() => props.onDeny(prediction)}
                />
              )}
              position="bottom"
              key="deny"
            >
              <FormattedMessage id="predictions.labels.deny" />
            </Tooltip>
          </div>
        )
      }
    </div>
  );
  renderPredictions.propTypes = {
    'predictionWas': PropTypes.bool,
  };
  renderPredictions.defaultProps = {
    'predictionWas': false,
  };

  return (
    <div className={`${props.className}__row`}>
      <div className={`${props.className}__type`}>
        {props.tags.map(renderTags)}
      </div>
      <div className={`${props.className}__content`}>
        <span
          className={`${props.className}__entity`}
          onClick={() => props.onEntityClick(props.entity_name)}
        >
          {props.entity_name}
        </span>
        <span className={`${props.className}__timestamp`}>
          {props.timestamp}
        </span>
        <div className={`${props.className}__list`}>
          {props.predictions.map(renderPredictions)}
        </div>
      </div>
    </div>
  );
};
PredictionRow.displayName = 'PredictionRow';
PredictionRow.propTypes = {
  'className': PropTypes.string,
  'entity_name': PropTypes.string.isRequired,
  'behavior': PropTypes.string,
  'predictions': PropTypes.arrayOf(PropTypes.string),
  'solved': PropTypes.bool,
  'tags': PropTypes.arrayOf(PropTypes.string),
  'timestamp': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  'onInspect': PropTypes.func,
  'onConfirm': PropTypes.func,
  'onDeny': PropTypes.func,
  'onEntityClick': PropTypes.func,
};
PredictionRow.defaultProps = {
  'className': 'prediction',
  'behavior': '',
  'predictions': [],
  'timestamp': '',
  'solved': false,
  'tags': [],
  'onEntityClick': () => null,
  'onInspect': () => null,
  'onConfirm': () => null,
  'onDeny': () => null,
};

export default PredictionRow;
