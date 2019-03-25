import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';

import HeaderAlert from 'components/header-alert';
import Search from 'components/search';
import Tooltip from 'components/tooltip';
import SidebarMenu from 'components/sidebar-menu';
import UserProfile from 'components/user-profile';

import logo from 'public/images/logo.png';

import './header.style';

const menu = [
  {
    'id': 'dashboard',
    'title': 'Dashboard',
    'icon': 'icon-dashboard',
    'items': [],
  },
  {
    'id': 'autocorrelateLink',
    'title': 'Autocorrelate',
    'icon': 'icon-chain',
    'items': [],
  },
  {
    'id': 'maliciousLink',
    'title': 'Malicious',
    'icon': 'icon-warning',
    'items': [],
  },
  {
    'id': 'suspiciousLink',
    'title': 'Suspicious',
    'icon': 'icon-binoculars',
    'items': [],
  },
  // {
  //   'id': 'correlation',
  //   'title': 'Correlation',
  //   'icon': 'icon-connectdevelop',
  //   'items': [],
  // },
  {
    'id': 'reports',
    'title': 'Reports',
    'icon': 'icon-area-chart',
    'items': [
      {
        'id': 'resultsDashboardLink',
        'title': 'Pipeline',
        'icon': 'icon-shield',
      },
      {
        'id': 'customReportsDashboardLink',
        'title': 'Custom Reports',
        'label': 'CustomReports',
        'icon': 'icon-line-chart',
      },
      {
        'id': 'labelsDashboardLink',
        'title': 'Labels',
        'label': 'Labels',
        'icon': 'icon-tag',
      },
      {
        'id': 'performance',
        'title': 'Performance',
        'icon': 'icon-bar-chart',
      },
    ],
  },
  {
    'id': 'analyticsDashboardLink',
    'title': 'Analytics',
    'icon': 'icon-pie-chart',
    'items': [],
  },
  {
    'id': 'apidocSwagger',
    'title': 'API-DOC',
    'icon': 'icon-file-text-o',
    'items': [],
  },
  {
    'id': 'healthContainer',
    'title': 'System Health',
    'icon': 'icon-heartbeat',
    'items': [],
  },
];

/**
 * Function used to create a <FormattedHTMLMessage /> instance
 *
 * @param   {String}  id
 * @param   {Object}  values
 * @returns {Element} Returns an instance of <FormattedHTMLMessage />
 */
const createLabel = (id, values) => (
  <FormattedHTMLMessage key={id} id={id} values={values} />
);

const Header = (props) => {
  /**
   * Function used to iterate over the keys of an object and return
   * an instance of <HeaderAlert />.
   *
   * Example:
   *  Caller: Object.keys(alerts).map(createAlert)
   *  Data Model:
        {
          'malicious': 20,
          'suspicious': 23
        }
   *
   * @param  {String}     el Key of an object
   * @return {Element}    Returns an instance of <HeaderAlert />
   */
  const createAlert = (el) => {
    const label = createLabel(
      `alerts.${el}`,
      { 'num': parseInt(props.alerts[el], 10), 'className': 'highlight' },
    );
    const renderAlert = () => (
      <HeaderAlert
        active={props.activeBehaviorFilter === el}
        noInactive={props.activeBehaviorFilter === null}
        image={el}
        label={label}
        onClick={() => props.setBehaviorFilter(el)}
      />
    );
    /* eslint-disable react/prop-types */
    if (props.withTooltip) {
      return (
        <Tooltip trigger={renderAlert()} position="bottom" key={el}>
          <FormattedHTMLMessage
            id="tooltip.filterBy"
            values={{ 'value': el }}
          />
        </Tooltip>
      );
    }
    /* eslint-enable */
    return renderAlert();
  };
  createAlert.propTypes = {
    'withTooltip': PropTypes.bool,
  };
  createAlert.defaultProps = {
    'withTooltip': true,
  };

  const width = props.hasSearch ? 440 : 140;
  const style = {
    'display': 'flex',
    'width': width,
    'justifyContent': 'space-between',
    'marginLeft': props.hasAlerts ? 0 : 'auto',
    'alignItems': 'center',
  };

  return (
    <header className={props.isOld ? 'header1 +old' : 'header1'} style={{ 'left': 0, 'right': 0 }}>
      <SidebarMenu
        active={props.pathname}
        items={menu}
        isOld
        privileges={props.privileges}
      />
      <img
        src={logo}
        alt="PatternEx"
        style={{ 'width': 150, 'height': 35 }}
        onClick={props.onLogoClick}
      />
      {
        props.hasAlerts && (
          <div className="header1__alert-list">
            {
              Object.keys(props.alerts).map(createAlert)
            }
          </div>
        )
      }
      {
        props.version !== '' && (
          <span className="header1__version">Version: {props.version}</span>
        )
      }
      <div style={style}>
        {
          props.hasSearch && (
            <Search
              inputProps={{
                'onChange': e => props.searchCb(e.target.value),
                'value': props.query,
              }}
              tag={props.activeBehaviorFilter}
              resetTags={() => props.setBehaviorFilter(null)}
            />
          )
        }
        <UserProfile
          setPopup={props.setPopup}
          type="configuration"
          icon="icon-gear"
          privileges={props.privileges}
        />
        <UserProfile setPopup={props.setPopup} privileges={props.privileges} />
      </div>
    </header>
  );
};
Header.displayName = 'Header';
Header.propTypes = {
  'activeBehaviorFilter': PropTypes.string,
  'alerts': PropTypes.object,
  'hasAlerts': PropTypes.bool,
  'hasSearch': PropTypes.bool,
  'isOld': PropTypes.bool,
  'query': PropTypes.string,
  'pathname': PropTypes.string.isRequired,
  'version': PropTypes.string,
  'privileges': PropTypes.object.isRequired,
  'searchCb': PropTypes.func,
  'setPopup': PropTypes.func,
  'setBehaviorFilter': PropTypes.func,
  'onLogoClick': PropTypes.func.isRequired,
  'withTooltip': PropTypes.bool,
};
Header.defaultProps = {
  'activeBehaviorFilter': null,
  'alerts': {},
  'hasAlerts': false,
  'hasSearch': false,
  'isOld': false,
  'query': '',
  'version': '',
  'searchCb': () => null,
  'setBehaviorFilter': () => null,
  'withTooltip': true,
  'setPopup': () => null,
};

export default Header;
