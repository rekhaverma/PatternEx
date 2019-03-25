import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Input, Textarea, CheckBox } from 'components/forms';
import Modal from 'components/modal';
import { FormattedMessage } from 'react-intl';
import { addResource, updateResource, resetErrorResource } from 'model/actions';
import './addEditResourceModal.style.scss';

export class AddEditResourceModal extends React.PureComponent {
  constructor(args) {
    super(args);
    this.state = {
      'name': (args.data && args.data.name) || '',
      'description': (args.data && args.data.description) || '',
      'url': (args.data && args.data.url) || '',
      'message': '',
      'active': (args.data ? args.data.active : true),
    };

    this.onStateChange = this.onStateChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
  }

  componentDidMount() {
    this.props.resetErrorResource();
  }

  onStateChange(key, value) {
    this.setState({
      [key]: value,
    });
  }

  onSubmit(type) {
    if (!this.isFormValid()) {
      return;
    }
    const { name, url, description, active } = this.state;
    const { userDetail } = this.props;
    const params = {
      name,
      url,
      description,
      active,
    };
    if (type === 'Add') {
      params.created_by_name = userDetail.name;
      params.created_by_email = userDetail.email;
      this.props.addResource(params);
    } else if (type === 'Edit') {
      params.updated_by_name = userDetail.name;
      params.updated_by_email = userDetail.email;
      this.props.updateResource(params, name);
    }
  }

  isFormValid() {
    this.props.resetErrorResource();
    const { name, description, url } = this.state;
    let message = '';
    if (name === '') {
      message = 'Resource name is required';
    } else if (url === '') {
      message = 'URL is required';
    } else if (url[0] !== '/') {
      message = 'URL should start with "/"';
    } else if (description === '') {
      message = 'Description is required';
    }
    this.setState({
      'message': message,
    });
    if (message) {
      return false;
    }
    return true;
  }

  render() {
    const { type, onCancel, resourceError } = this.props;
    const { name, url, description, active, message } = this.state;

    let ErrorResource = '';
    if (resourceError !== '') {
      ErrorResource = resourceError;
    } else if (message !== '') {
      ErrorResource = message;
    }

    return (
      <Modal>
        <div className="addEditResource">
          <div className="addEditResource__header">
            <span className="big-heading">
              <FormattedMessage
                id="resource.type"
                values={{
                  'type': type,
                }}
              />
            </span>
            <span className="icon-close-modal" onClick={onCancel} />
          </div>
          {ErrorResource !== '' ? (
            <div className="addEditResource__message">
              <FormattedMessage
                id="resource.message"
                values={{
                  'message': ErrorResource,
                }}
              />
            </div>
          ) : ''}
          <div className="addEditResource__row +spaceBetween">
            <div className="addEditResource__row--name">
              <Input
                className="input--v2"
                placeholder="Name"
                disabled={type === 'Edit'}
                value={name || ''}
                style={{ 'paddingLeft': 2, 'paddingRight': 2 }}
                onChange={value => this.onStateChange('name', value.target.value)}
              />
            </div>
            <div className="addEditResource__row--url">
              <Input
                className="input--v2"
                placeholder="URL"
                disabled={type === 'Edit'}
                value={url || ''}
                style={{ 'paddingLeft': 2, 'paddingRight': 2 }}
                onChange={value => this.onStateChange('url', value.target.value)}
              />
            </div>
          </div>
          <div className="addEditResource__row">
            <div className="addEditResource__row--description">
              <Textarea
                className="input--v2"
                placeholder="Description"
                value={description || ''}
                style={{ 'height': 110, 'paddingLeft': 10, 'paddingRight': 2, 'borderRadius': 5, 'border': '1px solid' }}
                onChange={value => this.onStateChange('description', value.target.value)}
              />
            </div>
          </div>
          <div className="addEditResource__row">
            <div className="addEditResource__row--status">
              <CheckBox
                id="resourceId"
                className="input--v2"
                value={active}
                onChange={value => this.onStateChange('active', value.target.checked)}
                onMouseOver={() => null}
                onFocus={() => null}
                label="Active"
                checked={active}
              />
            </div>
          </div>
          <div className="addEditResource__action">
            <div className="addEditResource__action--save">
              <Button className="button--dark +small" onClick={onCancel}>
                <FormattedMessage id="resource.cancel" />
              </Button>
              <Button className="button--success +small" onClick={() => this.onSubmit(type)}>
                <FormattedMessage id="resource.save" />
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  'addResource': params => dispatch(addResource(params)),
  'updateResource': (params, name) => dispatch(updateResource(params, name)),
  'resetErrorResource': () => dispatch(resetErrorResource()),
});

const mapStateToProps = state => ({
  'resourceError': state.data.resources.toJS().resourceError,
});

AddEditResourceModal.propTypes = {
  'addResource': PropTypes.func.isRequired,
  'updateResource': PropTypes.func.isRequired,
  'onCancel': PropTypes.func.isRequired,
  'type': PropTypes.string.isRequired,
  'userDetail': PropTypes.object.isRequired,
  'resourceError': PropTypes.string,
  'resetErrorResource': PropTypes.func.isRequired,
};

AddEditResourceModal.defaultProps = {
  'userDetail': {},
  'resourceError': '',
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEditResourceModal);
