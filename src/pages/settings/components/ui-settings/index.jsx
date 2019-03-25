import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CheckBox, Button } from 'components/forms';
import { toggleNewEVPPage } from 'model/actions/ui.actions';

import './ui-settings.style.scss';

class UISettings extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    localStorage.setItem('newEVPVisibility', JSON.stringify(!this.props.newEVPVisibility));
    this.props.toggleNewEVPPage(!this.props.newEVPVisibility);
  }

  render() {
    const { newEVPVisibility } = this.props;
    return (
      <div className="ui-settings">
        <div className="ui-settings__row">
          <CheckBox
            key="UI"
            id="ui"
            onChange={() => { this.onChange(); }}
            onMouseOver={() => null}
            onFocus={() => null}
            label="BETA - Enable new Exploded View Page"
            value={newEVPVisibility}
            checked={newEVPVisibility}
          />
        </div>
        <div className="ui-settings__buttons">
          <Button className="button--success" onClick={this.props.closeButton} >
              Save changes
          </Button>
          <Button className="button--dark" onClick={this.props.closeButton} >
              Cancel
          </Button>
        </div>
      </div>
    );
  }
}

UISettings.propTypes = {
  'newEVPVisibility': PropTypes.bool.isRequired,
  'toggleNewEVPPage': PropTypes.func.isRequired,
  'closeButton': PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  'toggleNewEVPPage': bool => dispatch(toggleNewEVPPage(bool)),
});

const mapStateToProps = state => ({
  'newEVPVisibility': state.app.ui.toJS().newEVPVisibility,
});

export default connect(mapStateToProps, mapDispatchToProps)(UISettings);
