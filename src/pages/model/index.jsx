import React from 'react';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';
import Tooltip from 'components/tooltip';
import Modal from 'components/modal';
import Loader from 'components/loader/loader-v2.component';
import { fetchModels, resetModelState, modelAction, fetchModelDetails, clearResultSummary, retrainModel } from 'model/actions/rest/models.actions';
import { fetchColumnFormat } from 'model/actions/rest/pipelines.actions';
import { addNotification } from 'model/actions';
import { pipelinesLabels, formatAndFilterModelData, allFeatureDictionary } from 'model/selectors';
import { Button } from 'components/forms';
import CreateModel from './components/create-model';
import ModelDetail from './components/model-details';
import ModalRetrain from './components/modelRetrain';
import ModelDeployment from './components/model-deployment';
import { formatStatus, formatStats, trClassFormat, getCaret, formatDate, formatMode } from './lib/format-actions';
import { modelsListingColumns, modelTypes } from './constants';

import './model.style.scss';

export class Model extends React.PureComponent {
  constructor() {
    super();
    // Start date would be 1 Jan, 1970 to get all the models present till date
    this.state = {
      'startDate': moment.utc(1, 'X'),
      'endDate': moment.utc(),
      'showAddNewModal': false,
      'showModelDeployment': false,
      'showModelDetails': false,
      'selectedRowData': null,
      'showRetrainModal': false,
      'modelRetrainData': {},
    };

    this.changeStateValue = this.changeStateValue.bind(this);
    this.formatAction = this.formatAction.bind(this);
    this.tableColumns = this.tableColumns.bind(this);
    this.handleAddModel = this.handleAddModel.bind(this);
    this.handleModelDetail = this.handleModelDetail.bind(this);
    this.handleModelDeployment = this.handleModelDeployment.bind(this);
    this.handleModelAction = this.handleModelAction.bind(this);
    this.fetchAllModels = this.fetchAllModels.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.openRetrainModal = this.openRetrainModal.bind(this);
    this.retrainModel = this.retrainModel.bind(this);
  }

  componentWillMount() {
    this.fetchAllModels();
  }

  componentDidUpdate() {
    const { requestStatus } = this.props;

    if (requestStatus && requestStatus.status === 'false') {
      this.props.addNotification('error', requestStatus.reason);
      this.props.resetModelState();
    }

    // Refresh the modle list on successfull model action
    if (requestStatus && requestStatus.status === 'true') {
      this.props.addNotification('success', requestStatus.reason);
      this.props.resetModelState();
      this.fetchAllModels();
    }
  }

  onCloseModal(modalType) {
    const state = {};
    state[modalType] = false;
    this.setState(state);
  }

  openRetrainModal(row) {
    this.setState({
      'showRetrainModal': true,
      'modelRetrainData': row,
    });
  }

  retrainModel(data) {
    this.props.retrainModel(data);
    this.props.clearResultSummary();
    this.changeStateValue('showRetrainModal', false);
  }

  fetchAllModels() {
    const {
      startDate,
      endDate,
    } = this.state;
    const params = {
      'start_time': startDate.unix(),
      'end_time': endDate.endOf('day').unix(),
    };
    this.props.fetchModels(params);
  }

  handleAddModel() {
    this.setState({
      'showAddNewModal': true,
    });
  }

  handleModelDetail(row) {
    const { modelDetails } = this.props;
    this.setState({
      'selectedRowData': row,
      'showModelDetails': true,
    });
    this.props.fetchColumnFormat(row.feature_type && row.feature_type.toLowerCase());
    if (!(modelDetails && modelDetails.name && modelDetails.name === row.name)) {
      this.props.fetchModelDetails(row && row.name);
    }
  }

  /* Model actions can be Undeploy/Delete
  * @param {row}  type object
  * @param {action} type string
  */
  handleModelAction(row, action) {
    const params = {
      'action': action,
      'model_name': row.name,
    };
    this.props.modelAction(params);
  }

  handleModelDeployment(row) {
    this.setState({
      'selectedRowData': row,
      'showModelDeployment': true,
    });
  }

  formatAction(cell, rowData) {
    const row = rowData;
    if (row) {
      if (row.isDeployed) {
        if (row.isPrimary) {
          row.deploymentStats = 'Primary';
        } else {
          row.deploymentStats = 'Secondary';
        }
      } else if (row.training_status && row.training_status.toLowerCase() === 'training') {
        row.deploymentStats = 'Training';
      } else {
        row.deploymentStats = 'Deploy';
      }
    }
    const silentModeIcon = () => {
      if (row.silent_mode) {
        return (
          <Tooltip
            position="bottom"
            trigger={(
              <span
                className={`icon-mute ${!row.isDeployed ? 'faded' : ''}`}
                aria-hidden="true"
              />
            )}
          >
            <FormattedHTMLMessage
              id="model.actions.mute"
            />
          </Tooltip>
        );
      }
      return (
        <Tooltip
          position="bottom"
          trigger={(
            <span
              className={`icon-speaker ${!row.isDeployed ? 'faded' : ''}`}
              aria-hidden="true"
            />
          )}
        >
          <FormattedHTMLMessage
            id="model.actions.speaker"
          />
        </Tooltip>
      );
    };
    return (
      <div className="model-action">
        {
          !row.is_user_model && !row.isFailed && row.deploymentStats !== 'Training' && (
            <Tooltip
              position="bottom"
              trigger={(
                <span
                  className="icon-retrain"
                  aria-hidden="true"
                  onClick={() => this.openRetrainModal(row)}
                />
              )}
            >
              <FormattedHTMLMessage
                id="model.actions.retrain"
              />
            </Tooltip>
          )
        }
        { silentModeIcon() }
        <Tooltip
          position="bottom"
          trigger={(
            <span
              className="icon-Info-icon blue-text"
              onClick={() => this.handleModelDetail(row)}
            />
          )}
        >
          <FormattedHTMLMessage
            id="model.actions.details"
          />
        </Tooltip>
        {
          !row.isFailed && (row.deploymentStats === 'Deploy' ? (
            <Tooltip
              position="bottom"
              trigger={(
                <span
                  className="icon-Deploy-icon green-text"
                  aria-hidden="true"
                  onClick={() => this.handleModelDeployment(row)}
                />
              )}
            >
              <FormattedHTMLMessage
                id="model.actions.deploy"
              />
            </Tooltip>
          ) : row.deploymentStats !== 'Training' && (
            <Tooltip
              position="bottom"
              trigger={(
                <span
                  className="icon-Cancel-icon red-text"
                  aria-hidden="true"
                  onClick={() => this.handleModelAction(row, 'undeploy')}
                />
              )}
            >
              <FormattedHTMLMessage
                id="model.actions.undeploy"
              />
            </Tooltip>
          ))
        }
        <Tooltip
          position="bottom"
          trigger={(
            <span
              className="icon-trash-outline yellow-text"
              aria-hidden="true"
              onClick={() => this.handleModelAction(row, 'delete')}
            />
          )}
        >
          <FormattedHTMLMessage
            id="model.actions.delete"
          />
        </Tooltip>
      </div>
    );
  }

  tableColumns() {
    let tableColumns = [];
    tableColumns = modelsListingColumns.map((tableColumn, index) => {
      let tableHeader;
      if (tableColumn.format) {
        const formatter = tableColumn.format;
        if (formatter === 'formatStats') {
          tableHeader = (
            <TableHeaderColumn
              columnTitle
              key={`${index}modelCol`}
              dataField={tableColumn.data}
              dataFormat={(cell, row) => (formatStats(cell, row))}
              dataSort
              caretRender={getCaret}
            >
              {tableColumn.title}
            </TableHeaderColumn>
          );
        } else if (formatter === 'formatStatus') {
          tableHeader = (
            <TableHeaderColumn
              key={`${index}modelCol`}
              dataField={tableColumn.data}
              dataFormat={(cell, row) => (formatStatus(cell, row))}
            >
              {tableColumn.title}
            </TableHeaderColumn>
          );
        } else if (formatter === 'formatDeployDate') {
          tableHeader = (
            <TableHeaderColumn
              key={`${index}modelCol`}
              dataField={tableColumn.data}
              dataFormat={(cell, row) => (formatDate(cell, row, 'dep_ts_formatted'))}
              columnTitle
              dataSort
              caretRender={getCaret}
            >
              {tableColumn.title}
            </TableHeaderColumn>
          );
        } else if (formatter === 'formatCreateDate') {
          tableHeader = (
            <TableHeaderColumn
              key={`${index}modelCol`}
              dataField={tableColumn.data}
              dataFormat={(cell, row) => (formatDate(cell, row, 'create_date_formatted'))}
              columnTitle
              dataSort
              caretRender={getCaret}
            >
              {tableColumn.title}
            </TableHeaderColumn>
          );
        } else if (formatter === 'formatMode') {
          tableHeader = (
            <TableHeaderColumn
              key={`${index}modelCol`}
              dataField={tableColumn.data}
              dataFormat={(cell, row) => formatMode(cell, row)}
              columnTitle
              dataSort
              caretRender={getCaret}
            >
              {tableColumn.title}
            </TableHeaderColumn>
          );
        } else {
          tableHeader = (
            <TableHeaderColumn
              key={`${index}modelCol`}
              dataField={tableColumn.data}
              dataFormat={this[tableColumn.format] || tableColumn.format}
              columnTitle={tableColumn.title !== 'Action'}
              dataSort={tableColumn.title !== 'Action'}
              caretRender={tableColumn.title !== 'Action' ? getCaret : null}
              width={tableColumn.width ? tableColumn.width : undefined}
            >
              {tableColumn.title}
            </TableHeaderColumn>
          );
        }
      } else {
        tableHeader = (
          <TableHeaderColumn
            key={`${index}modelCol`}
            dataField={tableColumn.data}
            columnTitle={tableColumn.title !== 'Action'}
            dataSort
            caretRender={getCaret}
          >
            {tableColumn.title}
          </TableHeaderColumn>
        );
      }
      return tableHeader;
    });
    return tableColumns;
  }

  changeStateValue(key, value) {
    const state = {};

    state[key] = value;
    this.setState(state);
  }

  render() {
    const {
      models,
      pipelines,
      isLoading,
      modelDetails,
      columnFormat,
    } = this.props;
    const { modelRetrainData } = this.state;

    const isModelDetailsEmpty = Object.keys(modelDetails).length === 0
    && modelDetails.constructor === Object;

    const isColumnFormatEmpty = Object.keys(columnFormat).length === 0
    && columnFormat.constructor === Object;
    // @todo : use table-v2 for rendering table and add iNTL
    return (
      <div className="models">
        { isLoading && <Loader /> }
        <h2 className="models__modelHeading"> Model list </h2>
        <div>
          <div className="col-md-4 models__addNewModel">
            <Button
              className="button--success +smal"
              onClick={this.handleAddModel}
            > Add New Model
            </Button>
          </div>
        </div>
        <div className="modelTable">
          <BootstrapTable
            data={models}
            striped
            bordered={false}
            keyField="name"
            searchPlaceholder="Search..."
            pagination
            search
            trClassName={trClassFormat}
          >
            {this.tableColumns()}
          </BootstrapTable>
        </div>
        {this.state.showAddNewModal ? (
          <div className="models__createModal">
            <Modal>
              <CreateModel
                onCancel={() => {
                  this.onCloseModal('showAddNewModal');
                  this.props.clearResultSummary();
                }}
                pipelines={pipelines}
                modelTypes={modelTypes}
              />
            </Modal>
          </div>
        ) : (
          ''
        )}
        {this.state.showModelDeployment ? (
          <Modal>
            <ModelDeployment
              onCancel={() => this.onCloseModal('showModelDeployment')}
              data={this.state.selectedRowData}
            />
          </Modal>
        ) : (
          ''
        )}
        {this.state.showModelDetails && !isModelDetailsEmpty && !isColumnFormatEmpty ? (
          <Modal>
            <ModelDetail
              onCancel={() => this.onCloseModal('showModelDetails')}
              modelDetails={modelDetails}
              columnFormat={columnFormat}
              row={this.state.selectedRowData}
            />
          </Modal>
        ) : (
          ''
        )}
        {
          this.state.showRetrainModal && (
            <ModalRetrain
              onClose={() => {
                this.props.clearResultSummary();
                this.changeStateValue('showRetrainModal', false);
              }}
              modelData={modelRetrainData}
              retrainModel={this.retrainModel}
            />
          )
        }
      </div>
    );
  }
}

Model.propTypes = {
  'models': PropTypes.array,
  'pipelines': PropTypes.array,
  'fetchModels': PropTypes.func.isRequired,
  'resetModelState': PropTypes.func.isRequired,
  'isLoading': PropTypes.bool,
  'requestStatus': PropTypes.object,
  'addNotification': PropTypes.func.isRequired,
  'fetchColumnFormat': PropTypes.func.isRequired,
  'modelDetails': PropTypes.object,
  'fetchModelDetails': PropTypes.func.isRequired,
  'modelAction': PropTypes.func.isRequired,
  'columnFormat': PropTypes.object,
  'clearResultSummary': PropTypes.func.isRequired,
  'retrainModel': PropTypes.func.isRequired,
};

Model.defaultProps = {
  'models': [],
  'pipelines': [],
  'isLoading': false,
  'requestStatus': {},
  'modelDetails': {},
  'columnFormat': {},
};

const mapStateToProps = state => ({
  'models': formatAndFilterModelData(state),
  'pipelines': pipelinesLabels(state),
  'isLoading': state.data.models.toJS().isLoading,
  'requestStatus': state.data.models.toJS().requestStatus,
  'modelDetails': state.data.models.toJS().modelDetails,
  'columnFormat': allFeatureDictionary(state),
});

const mapDispatchToProps = dispatch => ({
  'fetchModels': params => dispatch(fetchModels(params)),
  'resetModelState': () => dispatch(resetModelState()),
  'modelAction': params => dispatch(modelAction(params)),
  'addNotification': (...args) => dispatch(addNotification(...args)),
  'fetchModelDetails': modelName => dispatch(fetchModelDetails(modelName)),
  'fetchColumnFormat': pipeline => dispatch(fetchColumnFormat(pipeline)),
  'clearResultSummary': (...args) => dispatch(clearResultSummary(...args)),
  'retrainModel': (...args) => dispatch(retrainModel(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Model);
