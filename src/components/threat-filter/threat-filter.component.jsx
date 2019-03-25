import React from 'react';
import PropTypes from 'prop-types';
import { mapIcons } from 'lib';

import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import Tooltip from 'components/tooltip';

import './threat-filter.style.scss';

const ThreatFilter = (props) => {
  const createTactic = (el) => {
    let className = mapIcons(el.id);
    if (props.activeThreatTactic !== null) {
      if (props.activeThreatTactic === el.id) {
        className = `${className} active`;
      } else {
        className = `${className} inactive`;
      }
    }

    const renderTactic = () => (
      <span
        key={el.id}
        className={className}
        onClick={() => props.setThreatTactic(el.id)}
      />
    );
    renderTactic.propTypes = {
      'setThreatTactic': PropTypes.func,
    };
    renderTactic.defaultProps = {
      'setThreatTactic': () => {},
    };

    if (props.withTooltip) {
      return (
        <Tooltip trigger={renderTactic()} position="bottom" key={el.id}>
          <FormattedHTMLMessage
            id="tooltip.filterBy"
            values={{ 'value': el.label }}
          />
        </Tooltip>
      );
    }

    return renderTactic();
  };
  createTactic.propTypes = {
    'activeThreatTactic': PropTypes.string,
    'withTooltip': PropTypes.bool,
  };
  createTactic.defaultProps = {
    'activeThreatTactic': null,
    'withTooltip': false,
  };

  return (
    <div className="threatTactics">
      <p className="threatTactics__label"><FormattedMessage id="filters.threatTactics" />:</p>
      <div className="threatTactics__list">
        { props.threatTactics.map(createTactic) }
      </div>
    </div>
  );
};
ThreatFilter.displayName = 'ThreatFilter';
ThreatFilter.propTypes = {
  'activeThreatTactic': PropTypes.string,
  'threatTactics': PropTypes.array,
  'withTooltip': PropTypes.bool,
};
ThreatFilter.defaultProps = {
  'activeThreatTactic': null,
  'threatTactics': [],
  'withTooltip': false,
};

export default ThreatFilter;
