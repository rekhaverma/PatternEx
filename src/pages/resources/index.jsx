import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { pick } from 'lodash';

import { Button } from 'components/forms';
import { getResources, resetResource, getUserDetail, updateResource, deleteResourceByName } from 'model/actions';
import Table from 'components/table';
import Search from 'components/search';
import Loader from 'components/loader/loader-v2.component';
import { FormattedMessage } from 'react-intl';
import { filterResources, formatResources } from 'model/selectors';
import { resourceColumns } from './constants.jsx';

import { AddEditResourceModal } from './components/AddEditResourceModal';
import ManageResource from './components/ManageResource';
import './resources.style.scss';

export class Resources extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      'searchValue': '',
      'showAddEditResourceModal': false,
      'rowData': {},
      'type': '',
      'showManageResourceModal': false,
    };
    this.changeStateValue = this.changeStateValue.bind(this);
    this.openAddEditResource = this.openAddEditResource.bind(this);
    this.refreshResources = this.refreshResources.bind(this);
    this.openAddEditResource = this.openAddEditResource.bind(this);
    this.openManageResourceModel = this.openManageResourceModel.bind(this);
    this.updateResource = this.updateResource.bind(this);
    this.deleteResource = this.deleteResource.bind(this);
  }

  componentDidMount() {
    this.props.getResources();
    this.props.getUserDetail();
  }

  componentDidUpdate() {
    this.refreshResources();
  }
  /**
  * Function to open add/edit resource modal

  * @param {object, object, string} event, resource data, type of event
  * @return {}
  */
  openAddEditResource(e, row, type) {
    this.setState({
      'showAddEditResourceModal': true,
      'rowData': row,
      'type': type,
    });
  }

  openManageResourceModel(e, row, type) {
    this.setState({
      'showManageResourceModal': true,
      'rowData': row,
      'type': type,
    });
  }

  updateResource() {
    const { rowData, type } = this.state;
    const { userDetail } = this.props;
    const params = pick(rowData, ['active', 'description', 'name', 'url']);
    params.active = type === 'activate';
    params.updated_by_email = userDetail.email;
    params.updated_by_name = userDetail.name;
    this.props.updateResource(params, params.name);
    this.changeStateValue('showManageResourceModal', false);
  }

  deleteResource() {
    const { rowData } = this.state;
    this.props.deleteResourceByName(rowData.name);
    this.changeStateValue('showManageResourceModal', false);
  }

  refreshResources() {
    const { updateResources } = this.props;
    if (updateResources) {
      this.props.getResources();
      this.changeStateValue('showAddEditResourceModal', false);
      this.props.resetResource();
    }
  }

  /**
  * Function to update the state value
  *
  * @param {string, string} key, value
  * @return {}
  */
  changeStateValue(key, value) {
    this.setState({
      [key]: value,
    });
  }

  render() {
    const { resources, userDetail } = this.props;
    const { searchValue, type, rowData } = this.state;
    let data = searchValue !== '' && searchValue !== undefined
      ? filterResources({ 'resources': resources, 'inputValue': searchValue })
      : resources;

    data = data.map(el => ({
      ...el,
      'handlers': {
        ...el.handlers,
        'onEdit': (e, row) => {
          e.stopPropagation();
          this.openAddEditResource(e, row, 'Edit');
        },
        'manageResource': (e, row, action) => {
          e.stopPropagation();
          this.openManageResourceModel(e, row, action);
        },
      },
    }));

    return (
      <section className="resources" >
        {this.props.isLoading && <Loader />}
        <div className="resources__header">
          <h1>
            <FormattedMessage
              id="resource.title"
            />
          </h1>
        </div>
        <div className="col-md-4 resources__addNewResource">
          <Button
            className="button--success"
            onClick={e => this.openAddEditResource(e, null, 'Add')}
          >
            <FormattedMessage
              id="resource.add"
            />
          </Button>
        </div>
        <Search
          className="resourceSearch"
          inputProps={{
            'placeholder': 'Search',
            'value': this.state.searchValue,
            'onChange': e => this.changeStateValue('searchValue', e.target.value),
          }}
        />
        <Table
          className="resourceTable"
          columns={resourceColumns}
          data={data || []}
          pagination
          options={{}}
          expandableRow={() => null}
          expandComponent={() => null}
        />
        {
          this.state.showAddEditResourceModal && type === 'Edit' && <AddEditResourceModal
            userDetail={userDetail}
            data={rowData}
            onCancel={() => this.changeStateValue('showAddEditResourceModal', false)}
            type={this.state.type}
          />
        }
        {
          this.state.showAddEditResourceModal && type === 'Add' && <AddEditResourceModal
            onCancel={() => this.changeStateValue('showAddEditResourceModal', false)}
            type={this.state.type}
            userDetail={userDetail}
          />
        }
        {
          this.state.showManageResourceModal && <ManageResource
            onCancel={() => this.changeStateValue('showManageResourceModal', false)}
            type={this.state.type}
            data={rowData}
            onSubmit={this.state.type === 'delete' ? this.deleteResource : this.updateResource}
          />
        }
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  'getResources': (...args) => dispatch(getResources(...args)),
  'resetResource': () => dispatch(resetResource()),
  'getUserDetail': () => dispatch(getUserDetail()),
  'updateResource': (...args) => dispatch(updateResource(...args)),
  'deleteResourceByName': (...args) => dispatch(deleteResourceByName(...args)),
});

const mapStateToProps = state => ({
  'isLoading': state.data.resources.toJS().isLoading.length !== 0,
  'resources': formatResources(state.data.resources.toJS()),
  'userDetail': state.data.users.toJS().userDetail,
  'updateResources': state.data.resources.toJS().updateResources,
});

Resources.propTypes = {
  'isLoading': PropTypes.bool,
  'getResources': PropTypes.func.isRequired,
  'resources': PropTypes.array,
  'getUserDetail': PropTypes.func.isRequired,
  'updateResources': PropTypes.bool,
  'userDetail': PropTypes.object.isRequired,
  'resetResource': PropTypes.func.isRequired,
  'updateResource': PropTypes.func.isRequired,
  'deleteResourceByName': PropTypes.func.isRequired,
};

Resources.defaultProps = {
  'isLoading': true,
  'resources': [],
  'userDetail': {},
  'updateResources': false,
};

export default connect(mapStateToProps, mapDispatchToProps)(Resources);
