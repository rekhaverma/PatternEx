import React from 'react';
import Modal from 'components/modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from 'components/loader/loader-v2.component';
import { uploadFile } from 'model/actions';
import { Button } from 'components/forms';
import { FormattedMessage } from 'react-intl';
import SelectBox from 'components/select-box';

import { logTypes } from './constant';
import './upload-file.style.scss';

class UploadFile extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      'errorMessage': '',
      'file': '',
      'logType': logTypes[0].content,
    };
    this.handleCSV = this.handleCSV.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const { file, logType } = this.state;
    this.props.uploadFile({
      'file': file,
      'logType': logType,
    });
    this.closeModal();
  }

  /**
   * Function to validate and upload the file
   *
   * @param {object} DOM event
   * @return {}
   */
  handleCSV(e) {
    try {
      const target = e.target;
      const file = target.files && target.files[0] ? target.files[0] : undefined;

      if (file) {
        const fileNameSectionArray = file.name ? file.name.split('.') : [];
        const fileExtension = fileNameSectionArray.length > 1 ? fileNameSectionArray[fileNameSectionArray.length - 1] : '';
        if (file.type !== 'text/csv' && fileExtension !== 'csv') {
          if (fileNameSectionArray.length > 1) {
            this.setState({
              'errorMessage': `Input File should be a CSV file. Received a File of type: ${fileExtension}`,
            });
          } else {
            this.setState({
              'errorMessage': 'Input File should be a CSV file. Received a File without any type',
            });
          }
        } else if (file.size > 104857600) {
          this.setState({
            'errorMessage': 'Input File size should be upto 100MB',
          });
        } else {
          this.setState({
            'errorMessage': '',
            'file': file,
          });
        }
      }
    } catch (error) {
      throw (error);
    }
  }

  closeModal() {
    this.props.onClose();
  }

  updateStateValue(key, value) {
    this.setState({
      [key]: value,
    });
  }

  render() {
    const { errorMessage, file } = this.state;
    return (
      <Modal>
        <div className="upload-file">
          { this.props.isLoading && <Loader /> }
          <div className="upload-file__header">
            <span className="upload-file__heading">
              Upload File
            </span>
            <span
              className="icon-close2 close-upload-file-modal"
              onClick={this.closeModal}
            />
          </div>
          <div className="upload-file__import importCsv">
            <div className="upload-file__logtype">
              <SelectBox
                singleSelect
                options={logTypes}
                placeholder="Log Type"
                onClick={value => this.updateStateValue('logType', value)}
                activeOption={this.state.logType}
              />
            </div>
            <div className="upload-file__fileUploadWrapper">
              <Button className="button--success +small">Upload File</Button>
              <input type="file" onChange={this.handleCSV} />
            </div>
          </div>
          <div>
            {file !== '' &&
              <span className="upload-file__fileName" ref={ref => this.message = ref}>
                {file.name}
              </span>
            }
            {errorMessage !== '' &&
              <span className="upload-file__message" ref={ref => this.message = ref}>
                <FormattedMessage id="upload.error" values={{ 'message': errorMessage }} />
              </span>
            }
          </div>
          <div className="upload-file__actions">
            <div className="upload-file__action--save">
              <Button className="button--success +small" onClick={this.onSubmit}>
                Save
              </Button>
              <Button className="button--dark +small" onClick={this.closeModal}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

UploadFile.propTypes = {
  'onClose': PropTypes.func.isRequired,
  'isLoading': PropTypes.bool,
  'uploadFile': PropTypes.func.isRequired,
};

UploadFile.defaultProps = {
  'isLoading': false,
};

const mapStateToProps = state => ({
  'isLoading': state.data.settings.toJS().isLoading,
});

const mapDispatchToProps = dispatch => ({
  'uploadFile': (...args) => dispatch(uploadFile(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);
