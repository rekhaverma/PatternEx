import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';

// Libs
import { pipelineToName } from 'lib/decorators';

// Selectors
import { getPrivileges, getTime } from 'model/selectors';

// Containers
import MaliciousListing from './containers/malicious.container';
import SuspiciousListing from './containers/suspicious.container';

// Style
import './behavior.style.scss';

// Constants
const MALICIOUS_VIEW = 'behavior/malicious';
const SUSPICIOUS_VIEW = 'behavior/suspicious';

const filterEnabledPipelines = pipelines => Object.keys(pipelines)
  .filter(key => pipelines[key].enabled)
  .map(item => ({
    'id': item,
    'content': pipelineToName(item) !== 'HPA' ? pipelineToName(item) : 'Login',
  }));

  /**
   * @todo both containers have 80% same logic, try to extract that here
   * @todo both listing tables have same layout and components, make a reusable component
   *  with different columns
   *
   * @param {Object} props
   */
const BehaviorContainer = (props) => {
  const pipelines = filterEnabledPipelines(props.pipelines);
  return (
    <div>
      {
        props.location.pathname.includes(MALICIOUS_VIEW) && (
          <MaliciousListing
            pipelines={pipelines}
            location={props.location}
            time={props.time}
            updateLocation={props.updateLocation}
          />
        )
      }
      {
        props.location.pathname.includes(SUSPICIOUS_VIEW) && (
          <SuspiciousListing
            pipelines={pipelines}
            location={props.location}
            time={props.time}
            updateLocation={props.updateLocation}
          />
        )
      }
    </div>
  );
};
BehaviorContainer.displayName = 'BehaviorContainer';
BehaviorContainer.propTypes = {
  'location': PropTypes.object.isRequired,
  'pipelines': PropTypes.object,
  'time': PropTypes.shape({
    'startTime': PropTypes.object.isRequired,
    'endTime': PropTypes.object.isRequired,
    'timezone': PropTypes.string,
  }).isRequired,
  'updateLocation': PropTypes.func.isRequired,
};
BehaviorContainer.defaultProps = {
  'isLoading': true,
  'pipelines': {},
  'version': '',
};

const mapStateToProps = state => ({
  'isLoading': state.raw.toJS().loadStatus.isLoading.length > 0,
  'pipelines': state.raw.toJS().pipelines,
  'privileges': getPrivileges(state),
  'version': state.raw.toJS().systemInfo.version,
  'time': getTime(state),
});

const mapDispatchToProps = dispatch => ({
  'updateLocation': location => dispatch(routerActions.push(location)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BehaviorContainer);
