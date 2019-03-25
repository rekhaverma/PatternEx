import React from 'react';
import { Input, Button } from 'components/forms';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateSystemInfo } from 'model/actions/rest/systemInfo.actions';
import './okta-settings.style.scss';

class OktaSettings extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      'ssoEntryPoint': '',
      'domainList': [{ 'key': 0, 'name': '' }],
    };
    this.onChange = this.onChange.bind(this);
    this.addDomain = this.addDomain.bind(this);
    this.handleData = this.handleData.bind(this);
    this.deleteDomain = this.deleteDomain.bind(this);
    this.saveSystemInfo = this.saveSystemInfo.bind(this);
  }
  componentWillMount() {
    if (this.props.configSet) {
      this.handleData();
    }
  }

  onChange(key, value, index) {
    if (Object.keys(this.state).includes(key)) {
      if (key !== 'domainList') {
        this.setState({
          [key]: value,
        });
      } else {
        const DomainChange = this.state.domainList.slice(0);
        DomainChange[index] = { 'key': index, 'name': value };
        this.setState({
          [key]: DomainChange,
        });
      }
    }
  }
  /*
  * Populates Domain list from the props into a key name pair of domains
  * where key is the index and name is the domain
  * and sets it in state for the input to initiallize with those values
  */
  handleData() {
    const configSet = this.props.configSet || {};
    const domainListInput = configSet.domain_list;
    const oktaEntryPoint = configSet.okta_entry_point;
    const domainListArray = JSON.parse(domainListInput || '[]');
    let domainList = [];
    if (domainListArray.length !== 0) {
      domainList = domainListArray.map((domain, index) => (
        {
          'key': index,
          'name': domain,
        }
      ));
    }

    this.setState({
      'ssoEntryPoint': oktaEntryPoint,
      'domainList': domainList,
    });
  }

  addDomain() {
    const domainArray = this.state.domainList.slice(0);
    domainArray.push({ 'key': domainArray[domainArray.length - 1].key + 1, 'name': '' });
    this.setState({
      'domainList': domainArray,
    });
  }

  deleteDomain(index) {
    const domainArray = this.state.domainList.slice(0);
    domainArray.splice(index, 1);
    this.setState({
      'domainList': domainArray,
    });
  }
  saveSystemInfo() {
    const { ssoEntryPoint, domainList } = this.state;
    const { customerId, updateSystemInfoDetails } = this.props;
    const domainListUpdate = domainList.map(domain => domain.name);
    const params = {
      'login_strategy': 'smal',
      'login_config': JSON.stringify({
        'okta_entry_point': ssoEntryPoint,
        'domain_list': JSON.stringify(domainListUpdate),
      }),
    };
    updateSystemInfoDetails(customerId, params);
  }

  render() {
    return (
      <div className="okta-settings">
        <div className="okta-settings__row">
          <div className="okta-input-sso">
            <Input
              type="text"
              name="ssoEntryPoint"
              value={this.state.ssoEntryPoint}
              onChange={e => this.onChange('ssoEntryPoint', e.target.value)}
              placeholder="SSO Entry Point"
            />
          </div>
          <div className="okta-input-domain">
            { this.state.domainList.map((domain, index, totalArray) => (
              <div
                key={`${domain.key}_div`}
                className="div_domain"
              >
                <Input
                  type="text"
                  key={domain.key}
                  name="domainList"
                  value={domain.name}
                  onChange={e => this.onChange('domainList', e.target.value, index)}
                  placeholder="Domain List"
                />
                { totalArray.length !== 1 ? (
                  <span
                    key={`${domain.key}_icon`}
                    className="icon-remove remove-domain"
                    onClick={() => this.deleteDomain(index)}
                  />
                ) : (
                  ''
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="okta-settings__row">
          <div className="okta-add-domain">
            <Button
              className="button--success"
              onClick={this.addDomain}
            >
              Add new domain
            </Button>
          </div>
          <div className="okta-actions">
            <Button className="button--success" onClick={this.saveSystemInfo}>
              Save changes
            </Button>
            <Button className="button--dark" onClick={this.props.closeButton} >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

OktaSettings.propTypes = {
  'configSet': PropTypes.object,
  'customerId': PropTypes.string.isRequired,
  'closeButton': PropTypes.func.isRequired,
  'updateSystemInfoDetails': PropTypes.func.isRequired,
};
OktaSettings.defaultProps = {
  'configSet': {},
  'customerId': '',
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  'updateSystemInfoDetails': (customerId, params) => dispatch(updateSystemInfo(customerId, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OktaSettings);
