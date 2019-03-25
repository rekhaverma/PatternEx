import React from 'react';
import PropTypes from 'prop-types';

import NoCSVDataConnect from './components/nocsvdata.component';
import DynamicPopup from './components/dynamicPopup.component';
import { NOCSVDATA, SETLABELFAILED, SETLABELSUCCESS, LABELSPOPUP } from './constants';

import './popup.style.scss';

const Popup = (props) => {
  if (props.version === 1) {
    return (
      <div className={props.className}>
        <div className={`${props.className}__wrapper`} style={props.style}>
          <div className={`${props.className}__header`}>
            {
              props.title && (
                React.isValidElement(props.title) ? (
                  props.title
                ) : (
                  <h2>{props.title}</h2>
                )
              )
            }
            <span className="icon-close" onClick={props.onClose} />
          </div>
          <div className={`${props.className}__content`}>
            { props.children }
          </div>
        </div>
        <div className={`${props.className}__overlay`} onClick={props.onClose} />
      </div>
    );
  }

  switch (props.context) {
    case NOCSVDATA:
      return <NoCSVDataConnect className="popupV2" text="No data found." />;

    case SETLABELFAILED:
      return (
        <NoCSVDataConnect
          className="popupV2"
          text={(
            <span style={{ 'textAlign': 'center' }}>
              <p>Set label failed.</p>
              <p>Please contact the admin.</p>
            </span>
          )}
        />
      );

    case SETLABELSUCCESS:
      return (
        <NoCSVDataConnect
          className="popupV2"
          text={(
            <span style={{ 'textAlign': 'center' }}>
              <p>Set label succeded.</p>
            </span>
          )}
        />
      );
    case LABELSPOPUP:
      return <DynamicPopup className="popupV2" text={props.text} onClick={props.onClose} />;

    default:
      return null;
  }
};
Popup.displayName = 'Popup';
Popup.propTypes = {
  'children': PropTypes.element,
  'className': PropTypes.string,
  'context': PropTypes.oneOf([NOCSVDATA, SETLABELFAILED, SETLABELSUCCESS, LABELSPOPUP]),
  'title': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  'style': PropTypes.object,
  'version': PropTypes.number,
  'onClose': PropTypes.func,
  'text': PropTypes.string,
};
Popup.defaultProps = {
  'className': 'popup',
  'children': null,
  'context': '',
  'title': '',
  'style': {},
  'version': 1,
  'onClose': () => null,
  'text': 'No Data Found',
};

export default Popup;
