import React from 'react';
import { connect } from 'react-redux';
import ptrxREST from 'lib/rest';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';

import { Button } from 'components/forms';
import { fetchLabelsForLabels, updateLabel, deleteLabel, setUpdateLabel, setDeleteLabel } from 'model/actions/rest/labels.actions.js';
import { fetchTags } from 'model/actions';
import { EvpOpenMethods } from 'model/classes/evp-open-methods';
import { nameToPipeline } from 'lib/decorators';
import { tagsSelectBox, getSevenDayCount, formatLabelsData, filterEnabledPipelines, filterLabels } from 'model/selectors';
import Loader from 'components/loader/loader-v2.component';
import Popup from 'components/popup';
import Table from 'components/table';
import Search from 'components/search';
import SelectBox from 'components/select-box';
import List from 'components/select-box/components/option-list.component.jsx';

import ConfirmationPopup from './components/confirmationPopup';
import { labelsColumns, allPipelines } from './constants.jsx';
import EditLabelModal from './containers/editLabelModal';
import DeleteLabelModal from './containers/deleteLabelModal';

import LabelGraphs from './containers/labelGraph';

import './labels.style.scss';

const status = [{ 'id': 'active', 'content': 'Active' }, { 'id': 'inactive', 'content': 'Inactive' }];

class Labels extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      'inputValue': '',
      'showDeleteLabelModal': false,
      'showEditLabelModal': false,
      'showExportPipelines': false,
      'activeEntity': '',
      'downloadLink': '',
      'downloadIsLoading': false,
      'displayPopup': false,
      'popupText': '',
      'displayConfirmationPopup': false,
      'popupConfirmationText': '',
      'importLabelResponse': undefined,
      'rowData': {},
    };
    this.showExportCsvPipelines = this.showExportCsvPipelines.bind(this);
    this.handleLabelClickEvent = this.handleLabelClickEvent.bind(this);
    this.fetchLabels = this.fetchLabels.bind(this);
    this.changeStateValue = this.changeStateValue.bind(this);
    this.triggerDownload = this.triggerDownload.bind(this);
    this.handleCSV = this.handleCSV.bind(this);
    this.uploadLabels = this.uploadLabels.bind(this);
    this.openEditLabel = this.openEditLabel.bind(this);
    this.openDeleteLabel = this.openDeleteLabel.bind(this);
    this.editLabelCall = this.editLabelCall.bind(this);
    this.deleteLabelCall = this.deleteLabelCall.bind(this);
    this.updateEditLabelData = this.updateEditLabelData.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
  }

  componentDidMount() {
    const { tagsv2 } = window.localStorage;
    if (tagsv2 && Object.keys(tagsv2).length > 0) {
      delete window.localStorage.tagsv2;
      this.props.fetchTags();
    }
    this.fetchLabels();
  }

  componentDidUpdate() {
    const { deleteLabelCall, updateLabelCall } = this.props;
    if (deleteLabelCall || updateLabelCall) {
      if (deleteLabelCall) {
        this.props.setDeleteLabelCall(false);
      }
      if (updateLabelCall) {
        this.props.setUpdateLabelCall(false);
      }
      this.fetchLabels();
    }
  }

  /**
  * Function to open the EVP
  *
  * @param {object} row
  */
  onRowClick(row) {
    const { isOldEVPActive, handleExplodedView } = this.props;
    const param = {
      ...row,
      'start_time': row.time_start,
      'end_time': row.time_end,
    };
    EvpOpenMethods.onRowClickHandler(param, 'labels', isOldEVPActive, handleExplodedView);
  }

  /**
 * Function to upload the labels (PUT request)
 * and validate the uploaded labels
 *
 * @param {object} DOM event
 * @return {}
 */
  async handleCSV(e) {
    try {
      const target = e.target;
      const file = target.files && target.files[0] ? target.files[0] : undefined;

      if (file) {
        const fileNameSectionArray = file.name ? file.name.split('.') : [];
        const fileExtension = fileNameSectionArray.length > 1 ? fileNameSectionArray[fileNameSectionArray.length - 1] : '';
        if (file.type !== 'text/csv' && fileExtension !== 'csv') {
          if (fileNameSectionArray.length > 1) {
            this.setState({
              'displayPopup': true,
              'popupText': `Input File should be a CSV file. Received a File of type: ${fileExtension}`,
            });
          } else {
            this.setState({
              'displayPopup': true,
              'popupText': 'Input File should be a CSV file. Received a File without any type',
            });
          }
        } else {
          const formData = new FormData();
          formData.append('label_file', file);
          const url = 'labels/import';
          try {
            const res = await ptrxREST.put(url, formData);
            if (res.status >= 200 && res.status < 300) {
              const validLabels = res.data.valid_labels;

              if (validLabels === 0) {
                this.setState({
                  'displayPopup': true,
                  'popupText': 'No new labels found.',
                });
              } else {
                this.setState({
                  'displayConfirmationPopup': true,
                  'popupConfirmationText': `Found ${validLabels} new labels${validLabels === 1 ? '' : 's'} in File. Import these labels?`,
                  'importLabelResponse': res,
                });
              }
            } else {
              this.setState({
                'displayPopup': true,
                'popupText': 'Error in uploading csv file',
              });
            }
          } catch (error) {
            throw (error);
          }
        }
      }
    } catch (error) {
      throw (error);
    }
  }

  /**
  * Function to show the export csv pipelines
  *
  * @param {}
  * @return {}
  */
  showExportCsvPipelines() {
    this.setState({
      'showExportPipelines': true,
    });
  }

  fetchLabels() {
    const params = {
      'start': 0,
      'limit': 500,
    };
    if (this.state.activeEntity !== '') {
      params.pipeline = nameToPipeline(this.state.activeEntity);
    }
    this.props.fetchLabels(params);
  }

  /**
 * Function to upload the labels (POST)
 *
 * @param {}
 * @return {}
 */
  async uploadLabels() {
    const labelResponse = this.state.importLabelResponse;
    if (labelResponse) {
      const data = { 'file_name': labelResponse.data.file_name || '' };
      const url = 'labels/import';
      try {
        const response = await ptrxREST.post(url, data);
        if (response.status >= 200 && response.status < 300) {
          this.setState({
            'displayPopup': true,
            'popupText': response.data,
          });
        } else {
          this.setState({
            'displayPopup': true,
            'popupText': 'Error importing labels',
          });
        }
      } catch (e) {
        throw (e);
      }
    }
  }

  /**
 * Function to download the export CSV
 *
 * @param {object} DOM event
 * @return {}
 */
  async triggerDownload(formatedPipeline) {
    this.setState({
      'downloadIsLoading': true,
      'showExportPipelines': false,
    });
    let pipeline = '';
    if (formatedPipeline) {
      pipeline = nameToPipeline(formatedPipeline);
    }
    const url = `labels/export?pipeline=${pipeline}&export=true`;
    try {
      const response = await ptrxREST.get(url);
      if (response.status >= 200 && response.status < 300) {
        if (response.data.file_url !== '') {
          this.setState({
            'downloadLink': response.data.file_url,
            'downloadIsLoading': false,
          });
        } else {
          this.setState({
            'displayPopup': true,
            'popupText': 'No CSV data found.',
            'downloadIsLoading': false,
          });
        }
      }
    } catch (e) {
      throw (e);
    }
  }

  /**
 * Function to Update the label
 *
 * @param {string} label's id
 * @return {}
 */
  editLabelCall(id) {
    const rowData = this.state.rowData;
    const params = {
      'tag_id': rowData.tag_id,
      'status': rowData.status,
      'weight': rowData.weight,
      'description': rowData.description,
    };
    this.changeStateValue('showEditLabelModal', false);
    this.props.updateLabel(params, id);
  }

  /**
 * Function to delete a label
 *
 * @param {string} label ID
 * @return {}
 */
  deleteLabelCall(labelId) {
    this.changeStateValue('showDeleteLabelModal', false);
    this.props.deleteLabel(labelId);
  }

  /**
 * Function to open the edit label modal
 *
 * @param {object, object} DOM event, label's detail
 * @return {}
 */
  openEditLabel(e, row) {
    this.setState({
      'showEditLabelModal': true,
      'rowData': row,
    });
  }

  /**
 * Function to open delete label modal
 *
 * @param {object, object} DOM event
 * @return {}
 */
  openDeleteLabel(e, row) {
    this.setState({
      'showDeleteLabelModal': true,
      'rowData': row,
    });
  }

  /**
 * Function to update the row on change
 *
 * @param {object} DOM event, label's detail
 * @return {}
 */
  updateEditLabelData(key, value) {
    const rowData = this.state.rowData;
    this.setState({
      'rowData': {
        ...rowData,
        [key]: value,
      },
    });
  }

  /**
 * Function to update the state value
 *
 * @param {string, string/number/boolean/array/object} key, value
 * @return {}
 */
  changeStateValue(key, value) {
    this.setState({
      [key]: value,
    });
  }

  /**
 * Function to hide the export csv labels
 * if the click occurs outside it
 *
 * @param {object} DOM event
 * @return {}
 */
  handleLabelClickEvent(e) {
    if (e && e.target && e.target.id !== 'exportCSV') {
      this.setState({
        'showExportPipelines': false,
      });
    }
  }

  render() {
    const {
      showDeleteLabelModal,
      showEditLabelModal,
      showExportPipelines,
      activeEntity,
      downloadLink,
      downloadIsLoading,
      inputValue,
    } = this.state;
    const {
      labelSummary,
      labelsAvailable,
      labelSummaryAvailable,
      tags,
      allLabels,
      pipelines,
    } = this.props;
    const lastSevenDayCount = getSevenDayCount(allLabels);
    let data = inputValue !== ''
      ? filterLabels({ 'allLabels': allLabels, 'inputValue': inputValue })
      : allLabels;
    data = data.map(el => ({
      ...el,
      'handlers': {
        ...el.handlers,
        'onEdit': (e, row) => {
          e.stopPropagation();
          this.openEditLabel(e, row);
        },
        'onDelete': (e, row) => {
          e.stopPropagation();
          this.openDeleteLabel(e, row);
        },
      },
    }));
    return (
      <section className="labels" onClick={this.handleLabelClickEvent}>
        {this.props.isLoading && <Loader />}
        <div className="labels__header">
          <h1>My Labels</h1>
          <h2>Total: {allLabels.length || 0 }, Last 7 Days : {lastSevenDayCount}</h2>
        </div>
        <div className="labels__filter">
          <SelectBox
            singleSelect
            activeOption={activeEntity}
            options={allPipelines.concat(pipelines)}
            placeholder="Entities"
            onClick={value => this.changeStateValue('activeEntity', value)}
          />
          { /* BYUI-595 Removing label type filter */ }
          <Button
            onClick={() => this.fetchLabels()}
          >
            <FormattedMessage id="labels.apply" />
          </Button>
          <div className="fileUpload importCsv">
            <span className="icon-download file-download" />
            <FormattedMessage id="labels.import" />
            <input type="file" onChange={this.handleCSV} />
          </div>
          <div className="exportCsvContainer">
            {
              downloadLink === '' && (
                <span>
                  <Button
                    onClick={this.showExportCsvPipelines}
                    id="exportCSV"
                  >
                    <span className="icon-export" />
                    <FormattedMessage id="labels.export" />
                  </Button>
                  { showExportPipelines && (
                    <List
                      singleSelect
                      activeOption=""
                      options={pipelines}
                      hasScrollbar={false}
                      className="selectBox__optionList"
                      onClick={e => this.triggerDownload(e.target.getAttribute('data-id') !== null
                        ? e.target.getAttribute('data-id')
                        : e.target.parentNode.getAttribute('data-id'))}
                    />
                  )}
                  {downloadIsLoading && (
                    <div className="sk-fading-circle">
                      <div className="sk-circle1 sk-circle" />
                      <div className="sk-circle2 sk-circle" />
                      <div className="sk-circle3 sk-circle" />
                      <div className="sk-circle4 sk-circle" />
                      <div className="sk-circle5 sk-circle" />
                      <div className="sk-circle6 sk-circle" />
                      <div className="sk-circle7 sk-circle" />
                      <div className="sk-circle8 sk-circle" />
                      <div className="sk-circle9 sk-circle" />
                      <div className="sk-circle10 sk-circle" />
                      <div className="sk-circle11 sk-circle" />
                      <div className="sk-circle12 sk-circle" />
                    </div>
                  )}
                </span>
              )
            }
            {
              this.state.downloadLink !== '' && (
                <div>
                  <a
                    href={this.state.downloadLink}
                    style={{ 'textDecoration': 'none', 'color': '#337ab7', 'width': '135px' }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Click to download CSV
                    <span
                      className="icon-close"
                      style={{ 'color': '#C52121', 'marginLeft': '5px' }}
                      onClick={(e) => {
                        e.preventDefault();
                        this.changeStateValue('downloadLink', '');
                      }}
                    />
                  </a>
                </div>
              )
            }
          </div>
        </div>
        <LabelGraphs
          items={allLabels}
          labelSummary={labelSummary}
          totalLabels={allLabels && allLabels.length}
          labelsAvailable={labelsAvailable}
          labelSummaryAvailable={labelSummaryAvailable}
        />
        <Search
          className="labelSearch"
          inputProps={{
            'placeholder': 'Search for entity',
            'value': this.state.inputValue,
            'onChange': e => this.changeStateValue('inputValue', e.target.value),
          }}
        />
        <Table
          className="labelsTable"
          columns={labelsColumns}
          data={data || []}
          pagination
          options={{
            'onRowClick': this.onRowClick,
          }}
          expandableRow={() => null}
          expandComponent={() => null}
        />
        {
          showDeleteLabelModal && <DeleteLabelModal data={this.state.rowData} onSuccess={this.deleteLabelCall} onCancel={() => this.changeStateValue('showDeleteLabelModal', false)} />
        }
        {
          showEditLabelModal && <EditLabelModal data={this.state.rowData} onSuccess={this.editLabelCall} onCancel={() => this.changeStateValue('showEditLabelModal', false)} status={status} tags={tags} onChange={this.updateEditLabelData} />
        }
        { this.state.displayPopup && <Popup onClose={() => { this.changeStateValue('displayPopup', false); }} text={this.state.popupText} version={2} context="labelPopup" />}
        { this.state.displayConfirmationPopup && (
          <ConfirmationPopup
            onCancel={() => this.changeStateValue('displayConfirmationPopup', false)}
            actionText={this.state.popupConfirmationText}
            onSuccess={() => this.uploadLabels(this.state.importLabelResponse
              && this.state.importLabelResponse.file_name)}
          />
        )}
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  'fetchLabels': (...args) => dispatch(fetchLabelsForLabels(...args)),
  'updateLabel': (...args) => dispatch(updateLabel(...args)),
  'deleteLabel': (...args) => dispatch(deleteLabel(...args)),
  'setUpdateLabelCall': (...args) => dispatch(setUpdateLabel(...args)),
  'setDeleteLabelCall': (...args) => dispatch(setDeleteLabel(...args)),
  'handleExplodedView': (...args) => dispatch(routerActions.push(...args)),
  'fetchTags': (...args) => dispatch(fetchTags(...args)),
});

const mapStateToProps = state => ({
  'isLoading': state.data.labels.toJS().isLoading.length !== 0,
  'allLabels': formatLabelsData(state),
  'labelSummary': state.data.labels.toJS().labelSummary,
  'pipelines': filterEnabledPipelines(state),
  'labelSummaryAvailable': state.data.labels.toJS().labelSummaryAvailable,
  'labelsAvailable': state.data.labels.toJS().labelsAvailable,
  'tags': tagsSelectBox(state),
  'updateLabelCall': state.data.labels.toJS().updateLabelCall,
  'deleteLabelCall': state.data.labels.toJS().deleteLabelCall,
  'isDataLoaded': state.raw.getIn(['loadStatus', 'suspiciousBehavior']),
});

Labels.propTypes = {
  'isLoading': PropTypes.bool,
  'allLabels': PropTypes.array,
  'labelSummary': PropTypes.object,
  'pipelines': PropTypes.array,
  'labelSummaryAvailable': PropTypes.bool,
  'labelsAvailable': PropTypes.bool,
  'tags': PropTypes.array,
  'updateLabelCall': PropTypes.bool,
  'deleteLabelCall': PropTypes.bool,
  'setDeleteLabelCall': PropTypes.func.isRequired,
  'setUpdateLabelCall': PropTypes.func.isRequired,
  'updateLabel': PropTypes.func.isRequired,
  'deleteLabel': PropTypes.func.isRequired,
  'fetchLabels': PropTypes.func.isRequired,
  'handleExplodedView': PropTypes.func.isRequired,
  'fetchTags': PropTypes.func.isRequired,
  'isOldEVPActive': PropTypes.bool,
};

Labels.defaultProps = {
  'isLoading': true,
  'allLabels': [],
  'labelSummary': {},
  'pipelines': [],
  'labelSummaryAvailable': false,
  'labelsAvailable': false,
  'tags': [],
  'updateLabelCall': false,
  'deleteLabelCall': false,
  'isOldEVPActive': false,
};

export default connect(mapStateToProps, mapDispatchToProps)(Labels);
