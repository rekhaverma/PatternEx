import React from 'react';
import PropTypes from 'prop-types';
import LoaderSmall from 'components/loader/loader-small.component';
import { ConfirmationModal } from 'components/confirmation-modal';
import { Button } from 'components/forms';
import Modal from 'components/modal';

import Listing from './components/listing/listing.component';
import AddDataSourceModal from './components/add-data-source-modal/add-data-source-modal.component';
import DetailsDataSourceModal from './components/details-data-source-modal/details-data-source-modal.component';
import { INPUT_NAMES } from './constants';
import { dataSourceData } from '../../mock';

class LogManager extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      addDataSourceModalOpen: false,
      viewDataSourceModalOpen: false,
      deleteConfirmationModalOpen: false,
      currentDataSource: {},
    };

    this.containerRef = null;
    this.handleAddDataSourceModal = this.handleAddDataSourceModal.bind(this);
    this.handleViewDataSourceModal = this.handleViewDataSourceModal.bind(this);
    this.handleDeleteConfirmationModal = this.handleDeleteConfirmationModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { dataSourceStatuses } = nextProps;
    if (dataSourceStatuses.add !== this.props.dataSourceStatuses.add &&
      dataSourceStatuses.add === 'success') {
      this.setState({
        addDataSourceModalOpen: false,
      });
      this.props.dataSourceActions.onFetch();
    }
    if (dataSourceStatuses.update !== this.props.dataSourceStatuses.update &&
      dataSourceStatuses.update === 'success') {
      this.setState({
        viewDataSourceModalOpen: false,
      });
      this.props.dataSourceActions.onFetch();
    }
    if (dataSourceStatuses.start !== this.props.dataSourceStatuses.start &&
      dataSourceStatuses.start === 'success') {
      this.props.dataSourceActions.onFetch();
    }
    if (dataSourceStatuses.stop !== this.props.dataSourceStatuses.stop &&
      dataSourceStatuses.stop === 'success') {
      this.props.dataSourceActions.onFetch();
    }
    if (dataSourceStatuses.delete !== this.props.dataSourceStatuses.delete &&
      dataSourceStatuses.delete === 'success') {
      this.props.dataSourceActions.onFetch();
    }
  }

  handleAddDataSourceModal() {
    this.setState({
      addDataSourceModalOpen: !this.state.addDataSourceModalOpen,
    });
  }

  handleViewDataSourceModal() {
    this.setState({
      viewDataSourceModalOpen: !this.state.viewDataSourceModalOpen,
    });
  }

  handleDeleteConfirmationModal(confirmDelete = false) {
    this.setState({
      deleteConfirmationModalOpen: !this.state.deleteConfirmationModalOpen,
    });

    if (confirmDelete) {
      this.props.dataSourceActions.onDelete(this.state.currentDataSource);
    }
  }

  render() {
    const {
      className,
      tableData,
      dataSourceConfig,
      dataSourceStatuses,
      dataSourceActions,
    } = this.props;
    const { currentDataSource } = this.state;

    const tableDataWithHandlers = tableData.map(el => ({
      ...el,
      handlers: {
        ...el.handlers,
        onDebugUpdate: (event, row) => {
          const element = {
            ...row,
            debug: !row.debug,
            processingLoading: true,
          };
          dataSourceActions.onUpdate(element);
        },
        onViewDetails: (event, row) => {
          // @todo: update this when we'll get more specs
          const params = {
            configuration: {
              ...row,
              [INPUT_NAMES.TEMPLATE.name]: {
                option: row['input.template.option'],
                subOption: row['input.template.suboption'],
              },
            },
            useCases: dataSourceData.useCases,
            debug: null,
          };

          this.setState({
            currentDataSource: params,
          }, this.handleViewDataSourceModal);
        },
        onStart: (event, row) => {
          const element = {
            ...row,
            processingLoading: true,
          };
          dataSourceActions.onStart(element);
        },
        onStop: (event, row) => {
          const element = {
            ...row,
            processingLoading: true,
          };
          dataSourceActions.onStop(element);
        },
        onDelete: (event, row) => {
          this.setState({
            currentDataSource: {
              ...row,
              processingLoading: true,
            },
          }, this.handleDeleteConfirmationModal);
        },
      },
    }));

    /**
     * Display modal with width 70% of page
     */
    const modalWidth = this.containerRef
      ? (7 / 10) * this.containerRef.clientWidth
      : 1000;

    return (
      <div className={`${className}--log-manager`} ref={ref => this.containerRef = ref}>
        <div className={`${className}__actions`}>
          <div className={`${className}__filter-loader`}>
            {dataSourceStatuses.isLoading && <LoaderSmall />}
          </div>
          <Button
            className="button--success"
            onClick={this.handleAddDataSourceModal}
          >
            Add Data Source
          </Button>
        </div>
        <Listing
          data={tableDataWithHandlers}
          className={className}
        />
        {
          this.state.addDataSourceModalOpen && (
            <Modal>
              <AddDataSourceModal
                isLoading={dataSourceStatuses.add === 'loading'}
                dataSourceConfig={dataSourceConfig}
                addDataSource={dataSourceActions.onAdd}
                handleForm={this.handleAddDataSourceModal}
              />
            </Modal>
          )
        }
        {
          this.state.viewDataSourceModalOpen && (
            <Modal style={{ 'width': modalWidth }}>
              <DetailsDataSourceModal
                isLoading={dataSourceStatuses.update === 'loading'}
                dataSourceConfig={dataSourceConfig}
                entityData={currentDataSource}
                updateDataSource={dataSourceActions.onUpdate}
                handleForm={this.handleViewDataSourceModal}
              />
            </Modal>
          )
        }
        {
          this.state.deleteConfirmationModalOpen && (
            <ConfirmationModal
              modalWidth="320px"
              message="logManager.deleteDataSource.confirmation"
              onConfirmation={() => this.handleDeleteConfirmationModal(true)}
              onDecline={this.handleDeleteConfirmationModal}
            />
          )
        }
      </div>
    );
  }
}

LogManager.propTypes = {
  dataSourceConfig: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  dataSourceActions: PropTypes.shape({
    onAdd: PropTypes.func.isRequired,
    onFetch: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onStart: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  }).isRequired,
  dataSourceStatuses: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    add: PropTypes.string.isRequired,
    update: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    stop: PropTypes.string.isRequired,
    delete: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
};

LogManager.defaultProps = {
  className: 'log-manager',
};

export default LogManager;
