import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Button } from 'components/forms';
import { getRules, getRulesById, deleteRuleById, resetRule } from 'model/actions';
import Table from 'components/table';
import Search from 'components/search';
import Loader from 'components/loader/loader-v2.component';
import { filterRules, EnabledPipelines } from 'model/selectors';
import { rulesColumns } from './constants.jsx';
import AddEditRuleModal from './components/AddEditRuleModal';
import DeleteRuleModal from './components/DeleteRuleModal';

import './rules.style.scss';

class Rules extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      'searchValue': '',
      'showAddEditRuleModal': false,
      'rowData': {},
      'type': '',
      'showDeleteRuleModal': false,
    };
    this.changeStateValue = this.changeStateValue.bind(this);
    this.openAddEditRule = this.openAddEditRule.bind(this);
    this.deleteRule = this.deleteRule.bind(this);
    this.opendeleteRule = this.opendeleteRule.bind(this);
  }

  componentWillMount() {
    this.props.fetchRules();
  }

  componentDidUpdate() {
    const { ruleAction } = this.props;
    // Reload rules list on successfull complition  of delete rule action
    if (ruleAction === 'Success') {
      this.props.resetRule();
      this.props.fetchRules();
    } else if (ruleAction === 'Failed') {
      this.props.resetRule();
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

  /**
  * Function to open the edit rule modal
  *
  * @param {object, object, boolean} DOM event, rule's detail
  * @return {}
  */
  openAddEditRule(e, row, type) {
    if (row) {
      this.props.fetchRuleById(row.id);
    }
    this.setState({
      'showAddEditRuleModal': true,
      'rowData': row,
      'type': type,
    });
  }

  /**
  * Function to open delete rule modal
  *
  * @param {object, object} DOM event
  * @return {}
  */
  opendeleteRule(e, row) {
    this.setState({
      'showDeleteRuleModal': true,
      'rowData': row,
    });
  }

  /**
  * Function to delete rule
  *
  * @param {string} DOM event
  * @return {}
  */
  deleteRule(ruleid) {
    this.props.deleteRuleById(ruleid);
    this.changeStateValue('showDeleteRuleModal', false);
  }

  render() {
    const { rules, ruleDetail } = this.props;
    const { searchValue, rowData, type } = this.state;
    let data = searchValue !== '' && searchValue !== undefined
      ? filterRules({ 'allRules': rules, 'inputValue': searchValue })
      : rules;

    data = data.map(el => ({
      ...el,
      'handlers': {
        ...el.handlers,
        'onEdit': (e, row) => {
          this.openAddEditRule(e, row, 'Edit');
        },
        'onDelete': (e, row) => {
          this.opendeleteRule(e, row);
        },
      },
    }));
    const isRuleDetailEmpty = Object.keys(ruleDetail).length === 0 &&
    ruleDetail.constructor === Object;
    return (
      <section className="rules" >
        {this.props.isLoading && <Loader />}
        <div className="rules__header">
          <h1>Manage rules</h1>
        </div>
        <div className="col-md-4 rules__addNewRule">
          <Button
            className="button--success"
            onClick={e => this.openAddEditRule(e, null, 'Add')}
          > Add New Rule
          </Button>
        </div>
        <Search
          className="ruleSearch"
          inputProps={{
            'placeholder': 'Search',
            'value': this.state.searchValue,
            'onChange': e => this.changeStateValue('searchValue', e.target.value),
          }}
        />
        <Table
          className="rulesTable"
          columns={rulesColumns}
          data={data || []}
          pagination
          options={{}}
          expandableRow={() => null}
          expandComponent={() => null}
        />
        {
          this.state.showAddEditRuleModal && !isRuleDetailEmpty && type === 'Edit' && <AddEditRuleModal
            data={rowData}
            ruleDetail={ruleDetail}
            onCancel={() => this.changeStateValue('showAddEditRuleModal', false)}
            type={this.state.type}
            pipelines={this.props.pipelines}
          />
        }
        {
          this.state.showAddEditRuleModal && type === 'Add' && <AddEditRuleModal
            onCancel={() => this.changeStateValue('showAddEditRuleModal', false)}
            type={this.state.type}
            pipelines={this.props.pipelines}
          />
        }
        {
          this.state.showDeleteRuleModal && <DeleteRuleModal
            onCancel={() => this.changeStateValue('showDeleteRuleModal', false)}
            data={rowData}
            onSuccess={id => this.deleteRule(id)}
          />
        }
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  'fetchRules': (...args) => dispatch(getRules(...args)),
  'fetchRuleById': (...args) => dispatch(getRulesById(...args)),
  'deleteRuleById': ruleId => dispatch(deleteRuleById(ruleId)),
  'resetRule': () => dispatch(resetRule()),
});

const mapStateToProps = state => ({
  'isLoading': state.data.rules.toJS().isLoading.length !== 0,
  'rules': state.data.rules.toJS().rules,
  'pipelines': EnabledPipelines(state),
  'ruleAction': state.data.rules.toJS().ruleAction,
  'ruleDetail': state.data.rules.toJS().ruleDetail,
});

Rules.propTypes = {
  'isLoading': PropTypes.bool,
  'fetchRules': PropTypes.func.isRequired,
  'rules': PropTypes.array,
  'pipelines': PropTypes.array,
  'ruleAction': PropTypes.string,
  'resetRule': PropTypes.func.isRequired,
  'fetchRuleById': PropTypes.func.isRequired,
  'deleteRuleById': PropTypes.func.isRequired,
  'ruleDetail': PropTypes.object,
};

Rules.defaultProps = {
  'isLoading': true,
  'rules': [],
  'pipelines': [],
  'ruleAction': '',
  'ruleDetail': {},
};

export default connect(mapStateToProps, mapDispatchToProps)(Rules);
