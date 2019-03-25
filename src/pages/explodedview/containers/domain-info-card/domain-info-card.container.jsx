import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Scrollbars } from 'react-custom-scrollbars';
import { FormattedMessage } from 'react-intl';

import Modal from 'components/modal';
import Section from '../../components/section';
import List, { DOMAIN_INFO, DOMAIN_INFO_RESOLUTIONS, DOMAIN_INFO_SUBDOMAINS } from '../../components/list';
import ModalList from '../../components/modalList';

import { withDomainInfoData } from '../../hoc';

export class DomainInfoCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'openModal': false,
      'displaySubdomains': false,
      'displayResolution': false,
    };

    this.handleOpenSubdomains = this.handleOpenSubdomains.bind(this);
    this.handleOpenResolution = this.handleOpenResolution.bind(this);
  }

  handleOpenSubdomains(modal) {
    this.setState({
      'displaySubdomains': modal,
      'openModal': modal,
    });
  }

  handleOpenResolution(modal) {
    this.setState({
      'displayResolution': modal,
      'openModal': modal,
    });
  }

  render() {
    const { isDomainInfoDataLoaded, domainInfoData } = this.props;
    const scrollBarProps = {
      'autoHeight': true,
      'autoHeightMin': 0,
      'autoHeightMax': 500,
      'renderThumbVertical': props => <div {...props} className="thumb-vertical" />,
    };

    if (domainInfoData) {
      domainInfoData.handlers = {
        openSubdomains: this.handleOpenSubdomains,
        openResolution: this.handleOpenResolution,
      };
    }

    return (
      <Section size="small" title="Domain Information" loaded={isDomainInfoDataLoaded}>
        <List
          type={DOMAIN_INFO}
          data={domainInfoData}
          customClass={{
            base: 'standard-card',
            modifiers: ['+outlayed', '+rows-highlight'],
          }}
        />
        {
          this.state.openModal && (
            <Modal>
              { this.state.displaySubdomains &&
                <ModalList
                  onClose={() => this.handleOpenSubdomains(false)}
                  title={<FormattedMessage id="evp.subdomains" />}
                >
                  <Scrollbars {...scrollBarProps}>
                    <List
                      type={DOMAIN_INFO_SUBDOMAINS}
                      data={domainInfoData.subdomains}
                      customClass={{
                        base: 'details-card',
                        modifiers: ['+rows-highlight +domainInfoSubdomains'],
                      }}
                    />
                  </Scrollbars>
                </ModalList>
              }
              { this.state.displayResolution &&
                <ModalList
                  onClose={() => this.handleOpenResolution(false)}
                  title={<FormattedMessage id="evp.resolution" />}
                >
                  <div className="domain-resolution-header" >
                    <span>IP Address</span>
                    <span>Last Resolved</span>
                  </div>
                  <Scrollbars {...scrollBarProps}>
                    <List
                      type={DOMAIN_INFO_RESOLUTIONS}
                      data={domainInfoData.resolutions}
                      customClass={{
                        base: 'domain-info-resolution',
                        modifiers: ['+rows-highlight'],
                      }}
                    />
                  </Scrollbars>
                </ModalList>
              }
            </Modal>
          )
        }
      </Section>
    );
  }
}

DomainInfoCard.displayName = 'DomainInfoCard';

DomainInfoCard.propTypes = {
  'isDomainInfoDataLoaded': PropTypes.bool,
  'domainInfoData': PropTypes.object,
};

DomainInfoCard.defaultProps = {
  'isDomainInfoDataLoaded': false,
  'domainInfoData': {},
};

const enhance = compose(withDomainInfoData);

export default enhance(DomainInfoCard);
