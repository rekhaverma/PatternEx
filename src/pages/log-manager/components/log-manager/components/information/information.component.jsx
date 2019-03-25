import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import './information.style.scss';

const Information = props => (
  <div className={`${props.className}__information information`}>
    <span className="icon-information" />
    <FormattedMessage
      id={props.intlId}
      defaultMessage={props.intlDefault}
      values={props.intlValues}
    >
      {text => <p className="information__message">{text}</p>}
    </FormattedMessage>
  </div>
);

Information.propTypes = {
  'className': PropTypes.string,
  'intlDefault': PropTypes.string,
  'intlId': PropTypes.string,
  'intlValues': PropTypes.object,
};

Information.defaultProps = {
  'className': 'information',
  'intlDefault': '',
  'intlId': '',
  'intlValues': {},
};

export default Information;
