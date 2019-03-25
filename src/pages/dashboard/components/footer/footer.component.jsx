import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import './footer.style.scss';

const Footer = ({ version }) => (
  <div className="footer">
    <div className="footer__info">
      <FormattedMessage id="footer.info" values={{ version }} />
    </div>
  </div>
);

Footer.displayName = 'Footer';
Footer.propTypes = {
  'version': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};
Footer.defaultProps = {
  'version': '',
};
export default Footer;
